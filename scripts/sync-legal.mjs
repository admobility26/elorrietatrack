// SPDX-FileCopyrightText: 2026 Aitor Delgado Martínez · AD Mobility
// SPDX-License-Identifier: LicenseRef-RutasAD-Educational-NonCommercial-1.0
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=file=>fs.readFile(path.join(root,file),'utf8');
const lock=JSON.parse(await read('package-lock.json'));
const inventory=[];
const sections=[await read('legal/MAPAS-Y-DERECHOS.txt'),`AVISOS DE COMPONENTES DE TERCEROS — ElorrietaTrack

La licencia propia de ElorrietaTrack solo se aplica a las aportaciones originales de su
titular. Los siguientes componentes conservan sus derechos y condiciones propios.
Las restricciones no comerciales de ElorrietaTrack no se extienden a código de terceros.
Este inventario incluye dependencias de ejecución declaradas en package-lock.json;
algunas son herramientas o componentes nativos y no se incluyen en el navegador.

Mapas y servicios: geoEuskadi / Gobierno Vasco, PNOA / IGN y OpenStreetMap conservan
sus derechos. Sus atribuciones no deben eliminarse. Fuentes tipográficas, documentos
oficiales DGT y otros recursos ajenos se rigen por sus condiciones de origen; este
aviso no concede permisos adicionales sobre ellos.

La biblioteca pdf-lib conserva su licencia MIT y los avisos de sus autores.
`];
for(const [directory,entry] of Object.entries(lock.packages).filter(([key,v])=>key&&!v.dev&&!v.devOptional).sort(([a],[b])=>a.localeCompare(b))){
 let pkg;try{pkg=JSON.parse(await read(directory+'/package.json'));}catch{continue;}
 const licenses=(await fs.readdir(path.join(root,directory))).filter(name=>/^(licen[cs]e|copying|notice|copyright)([._-]|$)/i.test(name)).sort();
 inventory.push({name:pkg.name,version:pkg.version,license:pkg.license||entry.license,files:licenses.length?licenses:['README.md — License']});
 sections.push(`\n${'='.repeat(72)}\n${pkg.name} ${pkg.version}\nLicencia declarada: ${typeof pkg.license==='string'?pkg.license:JSON.stringify(pkg.license||entry.license||'Véanse los avisos del componente')}\nPaquete: ${directory}\n`);
 if(!licenses.length){const readme=(await read(directory+'/README.md'));const index=readme.search(/^##? .*Licen[cs]e/m);if(index<0)throw Error('No se encuentra el texto de licencia de '+pkg.name);sections.push('--- Licencia en README ---\n'+readme.slice(index)+'\n');}
 for(const name of licenses){const location=path.join(root,directory,name);if((await fs.stat(location)).isFile())sections.push(`--- ${name} ---\n${await fs.readFile(location,'utf8')}\n`);}
}
for(const name of (await fs.readdir(path.join(root,'legal'))).filter(n=>n.startsWith('vendor-')||n==='electron-LICENSE.txt').sort())sections.push('\n'+name+'\n'+await read('legal/'+name));
for(const name of ['dmsans','dmmono','manrope'])sections.push('\n'+name+' — SIL OFL\n'+await read('public/fonts/'+name+'-OFL.txt'));
sections.push(`\n${'='.repeat(72)}\npdf-lib — copia incluida en public/vendor/pdf-lib.min.js\nLicencia MIT del proyecto original:\n${await read('legal/pdf-lib-LICENSE.txt')}\n`);
const vendor=await read('public/vendor/pdf-lib.min.js');
sections.push('Avisos originales incrustados en el archivo distribuido:\n'+[...vendor.matchAll(/\/\*![\s\S]*?\*\//g)].map(m=>m[0]).join('\n'));
await fs.writeFile(path.join(root,'legal/dependency-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
const notices=sections.join('\n').replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'');await fs.writeFile(path.join(root,'THIRD-PARTY-NOTICES.txt'),notices);
const license=await read('LICENSE');await fs.writeFile(path.join(root,'public/LICENSE.txt'),license);await fs.writeFile(path.join(root,'public/THIRD-PARTY-NOTICES.txt'),notices);
const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await fs.writeFile(path.join(root,'public/licencia.html'),`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ElorrietaTrack · Autoría y licencia</title><style>body{margin:0;background:#f2f6f2;color:#243d30;font:16px/1.65 system-ui,sans-serif}main{max-width:900px;margin:auto;padding:28px 22px}a{color:#175e4b}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:white;border:1px solid #d3dfd3;border-radius:12px;padding:22px;font:14px/1.7 system-ui,sans-serif}h1{font-size:30px}nav{display:flex;gap:20px;flex-wrap:wrap}</style></head><body><main><nav><a id="back-to-app" href="./">← Volver a ElorrietaTrack</a><a href="./LICENSE.txt">Licencia en texto</a><a href="./THIRD-PARTY-NOTICES.txt">Licencias de terceros</a></nav><h1>Autoría y condiciones de uso del código</h1><p>© 2026 Aitor Delgado Martínez · AD Mobility. Todos los derechos reservados.</p><p>La licencia de uso concedida por el titular permite el uso profesional y docente remunerado de ElorrietaTrack. Las condiciones de reutilización de su código son independientes. Los componentes ajenos conservan sus derechos y licencias. El logo de Elorrieta no implica patrocinio institucional.</p><h2>Mapas, bibliotecas, identidad visual y fuentes</h2><pre>${escape(await read('legal/MAPAS-Y-DERECHOS.txt'))}</pre><p><a href="./THIRD-PARTY-NOTICES.txt">Textos íntegros de las licencias de terceros</a> · <a href="mailto:admobility26@gmail.com" target="_blank">Contacto</a></p><p id="runtime" hidden><a href="./runtime-licenses.html" target="_blank">Avisos completos de Chromium y sus componentes del instalador</a></p><h2>Licencia del código y autorización de uso</h2><pre>${escape(license)}</pre></main><script>if(location.protocol==='elorrietatrack:')document.getElementById('runtime').hidden=false;</script></body></html>`);
console.log('Avisos de autoría y licencias preparados.');
