const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const resources = path.join(root, 'build');
const iconset = path.join(resources, 'icon.iconset');
const source = path.join(resources, 'app-icon.png');
fs.mkdirSync(iconset, { recursive: true });
execFileSync('swift', [path.join(__dirname, 'make-icon.swift'), path.join(root,'public','elorrieta-logo.svg'), source], { stdio: 'inherit' });

for (const [name, pixels] of [
  ['icon_16x16.png', 16], ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32], ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128], ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256], ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512], ['icon_512x512@2x.png', 1024],
]) {
  execFileSync('sips', ['-z', String(pixels), String(pixels), source, '--out', path.join(iconset, name)], { stdio: 'ignore' });
}
execFileSync('iconutil', ['-c', 'icns', '-o', path.join(resources, 'icon.icns'), iconset], { stdio: 'inherit' });

// Windows ICO directory containing PNG frames, preserving the supplied logo.
const sizes=[16,32,48,64,128,256],frames=sizes.map(pixels=>{const file=path.join(resources,`icon-${pixels}.png`);execFileSync('sips',['-z',String(pixels),String(pixels),source,'--out',file],{stdio:'ignore'});return fs.readFileSync(file);});
const header=Buffer.alloc(6+16*frames.length);header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);let offset=header.length;frames.forEach((frame,i)=>{const row=6+i*16;header[row]=sizes[i]===256?0:sizes[i];header[row+1]=header[row];header.writeUInt16LE(1,row+4);header.writeUInt16LE(32,row+6);header.writeUInt32LE(frame.length,row+8);header.writeUInt32LE(offset,row+12);offset+=frame.length;});fs.writeFileSync(path.join(resources,'icon.ico'),Buffer.concat([header,...frames]));fs.copyFileSync(path.join(resources,'icon-256.png'),path.join(root,'public','favicon.png'));
