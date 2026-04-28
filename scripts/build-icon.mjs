import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svg = readFileSync(join(root, 'build-assets', 'icon.svg'), 'utf-8');

for (const size of [16, 32, 48, 64, 128, 256, 512]) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  const png = resvg.render().asPng();
  writeFileSync(join(root, 'build-assets', `icon-${size}.png`), png);
}

// 512px is the primary icon electron-builder uses to generate .ico
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
const png = resvg.render().asPng();
writeFileSync(join(root, 'build-assets', 'icon.png'), png);

console.log('Icons generated in build-assets/');
