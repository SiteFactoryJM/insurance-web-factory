import { build } from 'esbuild';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

const assetsDir = resolve('public/assets');
const chunksDir = resolve(assetsDir, 'chunks');
if (dirname(chunksDir) !== assetsDir || basename(chunksDir) !== 'chunks') throw new Error('Unexpected chunk output path.');
await rm(chunksDir, { recursive: true, force: true });
await mkdir(chunksDir, { recursive: true });
await mkdir('public/assets/fonts', { recursive: true });
await copyFile(
  'node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff',
  'public/assets/fonts/noto-sans-kr-korean-400-normal.woff',
);
await build({
  entryPoints: { studio: 'src/studio/editor.ts', 'guided-studio': 'src/studio/guided.ts' },
  outdir: 'public/assets', bundle: true, format: 'esm', splitting: true, chunkNames: 'chunks/[name]-[hash]', target: 'es2022',
  minify: true, legalComments: 'none',
});
console.log('Built guided studio, advanced editor, export chunks and PDF font');
