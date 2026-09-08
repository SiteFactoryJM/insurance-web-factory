import { createHash } from "node:crypto";
import { access, link, lstat, mkdir, readFile, realpath, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MAX_PROJECT_BYTES, parseProject, validateProjectSite } from "../.preview-dist/studio/project.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validId = value => /^[a-z0-9][a-z0-9-]{1,62}$/.test(value);
const imageFields = [["agent", "profileImage", "profile"], ["agent", "logoImage", "logo"], ["hero", "image", "hero"], ["seo", "ogImage", "og"]];

function within(rootDir, relative) {
  const result = path.resolve(rootDir, relative);
  const difference = path.relative(rootDir, result);
  if (!difference || difference.startsWith(`..${path.sep}`) || difference === ".." || path.isAbsolute(difference)) throw new Error("저장 경로가 프로젝트 폴더를 벗어납니다.");
  return result;
}

async function noSymlinkAncestors(rootDir, target) {
  const relative = path.relative(rootDir, target);
  let current = rootDir;
  for (const component of relative.split(path.sep)) {
    current = path.join(current, component);
    try { if ((await lstat(current)).isSymbolicLink()) throw new Error(`심볼릭 링크 경로에는 가져올 수 없습니다: ${current}`); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
  }
}

/** Import a versioned DIY file into the source registry, never into generated TypeScript. */
export async function importStudioProject(filePath, { rootDir = repositoryRoot, id, force = false } = {}) {
  rootDir = await realpath(path.resolve(rootDir));
  const inputPath = path.resolve(filePath);
  if (path.extname(inputPath).toLowerCase() !== ".json") throw new Error(".json 제작 파일을 선택해 주세요.");
  const sourceInfo = await stat(inputPath);
  if (!sourceInfo.isFile() || sourceInfo.size > MAX_PROJECT_BYTES) throw new Error("제작 파일은 8MB 이하의 JSON 파일이어야 합니다.");
  const project = parseProject(await readFile(inputPath, "utf8"));
  const site = project.site;
  const targetId = id ?? site.id;
  if (typeof targetId !== "string" || !validId(targetId)) throw new Error("사이트 ID는 영문 소문자·숫자·하이픈으로 2~63자여야 합니다.");
  site.id = targetId;
  const configPath = within(rootDir, path.join("sites", targetId, "site.json"));
  const assetsDir = within(rootDir, path.join("public", "sites", targetId));
  await noSymlinkAncestors(rootDir, configPath);
  await noSymlinkAncestors(rootDir, assetsDir);
  try { await access(configPath); if (!force) throw new Error(`사이트 '${targetId}'가 이미 있습니다. 다른 --id를 지정하거나 확인 후 --force를 사용하세요.`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }

  const assets = [];
  for (const [group, field, label] of imageFields) {
    const source = site[group]?.[field];
    if (!source) continue;
    const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(source);
    if (match) {
      const bytes = Buffer.from(match[2], "base64");
      const extension = match[1] === "jpeg" ? "jpg" : match[1];
      const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
      const fileName = `studio-${label}-${digest}.${extension}`;
      const file = within(rootDir, path.join("public", "sites", targetId, fileName));
      await noSymlinkAncestors(rootDir, file);
      assets.push({ file, bytes });
      site[group][field] = `/sites/${targetId}/${fileName}`;
    } else if (source.startsWith("/")) {
      const file = within(rootDir, path.join("public", source.slice(1)));
      await noSymlinkAncestors(rootDir, file);
      try { await access(file); } catch { throw new Error(`이미지 파일이 없습니다: ${source}. DIY 화면에서 이미지를 업로드한 뒤 다시 저장해 주세요.`); }
    }
  }
  const issues = validateProjectSite(site);
  if (issues.length) throw new Error(issues.join("\n"));
  const createdAssets = [];
  const temporaryPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await mkdir(path.dirname(configPath), { recursive: true });
    if (assets.length) await mkdir(assetsDir, { recursive: true });
    for (const asset of assets) {
      try { await writeFile(asset.file, asset.bytes, { flag: "wx" }); createdAssets.push(asset.file); }
      catch (error) {
        if (error.code !== "EEXIST" || !(await readFile(asset.file)).equals(asset.bytes)) throw error;
      }
    }
    await writeFile(temporaryPath, `${JSON.stringify(site, null, 2)}\n`, { flag: "wx" });
    if (force) await rename(temporaryPath, configPath);
    else { await link(temporaryPath, configPath); await unlink(temporaryPath); }
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    for (const asset of createdAssets) await unlink(asset).catch(() => {});
    throw error;
  }
  return { id: targetId, configPath, assets: assets.map(asset => asset.file), status: "draft" };
}

async function main(argv) {
  const args = { file: "", id: undefined, force: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--file") args.file = argv[++index] ?? "";
    else if (argv[index] === "--id") args.id = argv[++index] ?? "";
    else if (argv[index] === "--force") args.force = true;
    else if (["--help", "-h"].includes(argv[index])) {
      console.log("npm run studio:import -- --file ./incoming/project.json --id agent-kim [--force]\n가져온 사이트는 draft/noindex/데모 미전송 상태입니다. 이후 npm run generate && npm run check를 실행하세요.");
      return;
    } else throw new Error(`알 수 없는 옵션입니다: ${argv[index]}`);
  }
  if (!args.file) throw new Error("--file로 DIY 제작 파일을 지정하세요.");
  const result = await importStudioProject(args.file, args);
  console.log(`가져오기 완료: ${result.configPath}\n이미지 ${result.assets.length}개 · draft / noindex / 데모 미전송\n다음 단계: npm run generate && npm run check`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await main(process.argv.slice(2)); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
