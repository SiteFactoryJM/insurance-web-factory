import { build } from 'esbuild';
await build({
  entryPoints: { studio: 'src/studio/editor.ts', 'guided-studio': 'src/studio/guided.ts' },
  outdir: 'public/assets', bundle: true, format: 'esm', target: 'es2022',
  minify: true, legalComments: 'none',
});
console.log('Built guided studio and advanced editor');
