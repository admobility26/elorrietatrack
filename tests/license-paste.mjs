import {_electron,expect} from '@playwright/test';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'elorrieta-paste-')),root=process.env.PACKAGED_APP||process.cwd(),harness=path.join(dir,'main.cjs');
await fs.writeFile(harness,`const {app}=require('electron');app.setPath('documents',${JSON.stringify(dir)});app.setAppPath(${JSON.stringify(root)});require(${JSON.stringify(path.join(root,'electron/main.cjs'))});`);
const app=await _electron.launch({args:[harness],timeout:20000});let previous;
try{
 const page=await app.firstWindow();await page.getByRole('button',{name:'Pegar licencia',exact:true}).waitFor();previous=await app.evaluate(({clipboard})=>clipboard.readText());
 for(const prefix of ['ADMIN','PRE','EEM']){const key=prefix+'-'+ 'A1'.repeat(16);await app.evaluate(({clipboard},text)=>clipboard.writeText(text),key);await page.getByRole('button',{name:'Pegar licencia',exact:true}).click();await expect(page.locator('input[name=key]')).toHaveValue(key);}
 await app.evaluate(({clipboard})=>clipboard.writeText('contenido ajeno a una licencia'));await page.getByRole('button',{name:'Pegar licencia',exact:true}).click();await page.getByRole('alert').filter({hasText:'Copia una clave de licencia válida'}).waitFor();
 const key='ADMIN-'+'B2'.repeat(16);await app.evaluate(({clipboard},text)=>clipboard.writeText(text),key);await page.locator('input[name=key]').focus();await page.keyboard.press(process.platform==='darwin'?'Meta+A':'Control+A');await page.keyboard.press(process.platform==='darwin'?'Meta+V':'Control+V');await expect(page.locator('input[name=key]')).toHaveValue(key);
 const roles=await app.evaluate(({Menu})=>Menu.getApplicationMenu().items.flatMap(i=>i.submenu?.items.map(j=>j.role)||[]));assert(roles.includes('paste'));
 console.log('PASS paste: ADMIN/PRE/EEM native clipboard button, invalid clipboard rejection, standard paste shortcut and Edit menu. No activation requested.');
}finally{if(previous!==undefined)await app.evaluate(({clipboard},text)=>clipboard.writeText(text),previous);await app.close();await fs.rm(dir,{recursive:true,force:true});}
