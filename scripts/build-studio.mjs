import { build } from 'esbuild';
await build({ entryPoints: ['src/studio/editor.ts'], outfile: 'public/assets/studio.js', bundle: true, format: 'esm', target: 'es2022', minify: true, legalComments: 'none' });
console.log('Built browser DIY studio');
