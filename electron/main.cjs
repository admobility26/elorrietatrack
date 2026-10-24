// SPDX-FileCopyrightText: 2026 Aitor Delgado Martínez · AD Mobility
// SPDX-License-Identifier: LicenseRef-RutasAD-Educational-NonCommercial-1.0
const { app, BrowserWindow, ipcMain, protocol, net, shell, session, dialog, safeStorage, clipboard, Menu } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const organized=require('./organized-storage.cjs');

protocol.registerSchemesAsPrivileged([{ scheme: 'elorrietatrack', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);
app.setName('RutasElorrieta');

const dataDirectory = require('./data-directory.cjs')(app.getPath('documents'));
const libraryPath = path.join(dataDirectory, 'Biblioteca de recorridos.json');
const gpxDirectory=path.join(dataDirectory,'Archivos GPX');
const videoDirectory = path.join(dataDirectory, 'Vídeos MP4');
const backupDirectory=organized.folders(dataDirectory).backups;
const appDataDirectory = path.join(dataDirectory, '.datos-de-la-aplicacion');

app.setPath('userData', appDataDirectory);
const licensing=require('./licensing.cjs')({app,safeStorage});
ipcMain.handle('license:status',()=>licensing.status());
ipcMain.handle('license:paste',async()=>{const text=(await clipboard.readText()).trim();const compact=text.toUpperCase().replace(/[\s\u200B-\u200D\uFEFF\-\u2010-\u2015\u2212]/g,'');if(text.length>100||! /^(?:(?:ADMIN|EEM|PRE))?[A-F0-9]{32}$/.test(compact))throw Error('Copia una clave de licencia válida antes de pulsar Pegar.');return text;});
ipcMain.handle('license:activate',(_event,key)=>licensing.activate(String(key||'').slice(0,100)));
// Enforce activation in the main process before opening protected data or starting recordings.
const registerHandle=ipcMain.handle.bind(ipcMain);
ipcMain.handle=(channel,handler)=>registerHandle(channel,(event,...args)=>{if((channel.startsWith('workspace:')||channel.startsWith('bluetooth:')||channel==='files:save-gpx')&&licensing.check().plan!=='premium')throw Error('Función Premium. Actualiza tu suscripción.');if(['library:load','movie:begin','files:save-video'].includes(channel)&&!licensing.check().valid)throw Error('Licencia no activa.');return handler(event,...args);});


function ensureDataDirectories() {
  organized.ensure(dataDirectory);
  for (const directory of [appDataDirectory]) fs.mkdirSync(directory, { recursive: true });
}

let workspaceDirectory=null;
const movieWrites=new Map();
function workspaceFile(name){if(!workspaceDirectory||typeof name!=='string'||name!==path.basename(name)||name.includes('\\'))throw Error('Archivo fuera de la carpeta de trabajo.');return path.join(workspaceDirectory,name);}
ipcMain.handle('workspace:choose',async()=>{const result=await dialog.showOpenDialog({title:'Carpeta de la clase · RutasElorrieta Premium',properties:['openDirectory']});if(result.canceled)return null;workspaceDirectory=result.filePaths[0];const entries=await fs.promises.readdir(workspaceDirectory,{withFileTypes:true});const files=[];for(const e of entries)if(e.isFile())files.push({name:e.name,size:(await fs.promises.stat(path.join(workspaceDirectory,e.name))).size});return {name:path.basename(workspaceDirectory),files};});
ipcMain.handle('workspace:check-media',async(_event,name,size)=>{try{const info=await fs.promises.stat(workspaceFile(name));if(!info.isFile()||info.size!==size)throw Error('changed');return true;}catch{throw Error('No se encuentra el vídeo original o ha cambiado. Si has renombrado o movido la carpeta, pulsa Abrir carpeta y selecciona su ubicación actual.');}});
ipcMain.handle('workspace:read-text',async(_event,name)=>{if(!/\.(gpx|json)$/i.test(name))throw Error('Solo se leen proyectos JSON y tracks GPX.');return fs.promises.readFile(workspaceFile(name),'utf8');});
ipcMain.handle('workspace:write-project',async(_event,text)=>{const target=workspaceFile('ElorrietaTrack Premium-proyecto.json');const parsed=JSON.parse(text);if(parsed.format!=='elorrietatrack-premium-project')throw Error('Proyecto inválido.');const temporary=target+'.tmp';await fs.promises.writeFile(temporary,text,'utf8');await fs.promises.rename(temporary,target);});

function writeLibrary(storage) {
  ensureDataDirectories();organized.writeLibrary(dataDirectory,storage);
}

function cleanFileName(value, extension) {
  const stem = path.basename(String(value || 'archivo'), path.extname(String(value || '')))
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 _-]+/g, '').trim().replace(/\s+/g, '-')
    .slice(0, 100) || 'archivo';
  return `${stem}${extension}`;
}

ipcMain.handle('library:load', () => {
  ensureDataDirectories();
  try {
    const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    return organized.libraryStorage(dataDirectory,library?.storage && typeof library.storage === 'object' ? library.storage : {});
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) console.error('No se pudo leer la biblioteca local:', error);
    return organized.libraryStorage(dataDirectory,{});
  }
});

ipcMain.handle('library:save', (_event, storage) => {
  if (!storage || typeof storage !== 'object' || Array.isArray(storage)) throw new Error('La biblioteca local no tiene un formato válido.');
  writeLibrary(storage);
  return true;
});

ipcMain.on('library:save-sync', (event, storage) => {
  try { writeLibrary(storage); event.returnValue = true; }
  catch (error) { console.error('No se pudo guardar la biblioteca al cerrar:', error); event.returnValue = false; }
});

ipcMain.handle('backup:save',async(event,{name,data}={})=>{
  if(typeof data!=='string'||Buffer.byteLength(data,'utf8')>256*1024*1024)throw Error('La copia no tiene un tamaño válido.');
  const result=await dialog.showSaveDialog(BrowserWindow.fromWebContents(event.sender),{title:'Guardar copia de seguridad',defaultPath:path.join(backupDirectory,cleanFileName(name||'ElorrietaTrack-copia','.json')),filters:[{name:'Copia ElorrietaTrack',extensions:['json']}]});
  if(result.canceled||!result.filePath)return {saved:false};
  const temporary=`${result.filePath}.${require('node:crypto').randomUUID()}.tmp`;
  try{await fs.promises.writeFile(temporary,data,'utf8');await fs.promises.rename(temporary,result.filePath);}catch(error){await fs.promises.rm(temporary,{force:true}).catch(()=>{});throw error;}
  return {saved:true,name:path.basename(result.filePath),path:result.filePath};
});

ipcMain.handle('files:save-gpx', async (_event, fileName, contents) => {
  ensureDataDirectories();
  const safeName = cleanFileName(fileName, '.gpx');
  const target=organized.uniqueFile(gpxDirectory,safeName);await fs.promises.writeFile(target,String(contents),'utf8');
  return path.join('Archivos GPX',path.basename(target));
});


ipcMain.handle('files:save-video', async (_event, fileName, bytes) => {
  ensureDataDirectories();
  const safeName = cleanFileName(fileName, '.mp4');
  const target=organized.uniqueFile(videoDirectory,safeName);await fs.promises.writeFile(target,Buffer.from(bytes));
  return path.join('Vídeos MP4',path.basename(target));
});

ipcMain.handle('files:open-data-folder', async () => {
  ensureDataDirectories();
  return shell.openPath(dataDirectory);
});
ipcMain.on('files:get-data-directory', event => { event.returnValue = dataDirectory; });


ipcMain.handle('movie:begin',async(_event,suggestedName)=>{const result=await dialog.showSaveDialog({title:'Guardar montaje MP4',defaultPath:path.join(videoDirectory,cleanFileName(suggestedName||'ElorrietaTrack-mapa-pip.mp4','.mp4')),filters:[{name:'MP4',extensions:['mp4']}]});if(result.canceled)return null;const id=require('node:crypto').randomUUID(),temporary=result.filePath+'.'+id+'.partial';const handle=await fs.promises.open(temporary,'wx');movieWrites.set(id,{handle,temporary,target:result.filePath});return {id,name:path.basename(result.filePath)};});
ipcMain.handle('movie:write',async(_event,id,bytes)=>{const entry=movieWrites.get(id);if(!entry)throw Error('La exportación no está abierta.');if(!(bytes instanceof ArrayBuffer)||bytes.byteLength>32*1024*1024)throw Error('Bloque de vídeo inválido.');await entry.handle.writeFile(Buffer.from(bytes));});
ipcMain.handle('movie:finish',async(_event,id)=>{const entry=movieWrites.get(id);if(!entry)throw Error('La exportación no está abierta.');await entry.handle.sync();await entry.handle.close();entry.closed=true;await fs.promises.rename(entry.temporary,entry.target);movieWrites.delete(id);return path.dirname(entry.target)===path.resolve(videoDirectory)?{url:`elorrietatrack://app/__recordings/${encodeURIComponent(path.basename(entry.target))}`} : {};});
ipcMain.handle('movie:abort',async(_event,id)=>{const entry=movieWrites.get(id);if(!entry)return;if(!entry.closed)await entry.handle.close().catch(()=>{});await fs.promises.unlink(entry.temporary).catch(()=>{});movieWrites.delete(id);});
app.on('will-quit',()=>{for(const entry of movieWrites.values()){void entry.handle.close().catch(()=>{});try{fs.unlinkSync(entry.temporary);}catch{}}movieWrites.clear();});

const distDirectory = path.join(app.getAppPath(), 'dist');

let quitting=false;
const closingWindows=new Map(),autosaveClients=new Set();
ipcMain.on('autosave:attached',event=>autosaveClients.add(event.sender.id));
app.on('before-quit',()=>{quitting=true;});
ipcMain.on('autosave:close-ready',(event,result)=>{
 const pending=closingWindows.get(event.sender.id);if(!pending||result?.id!==pending.id)return;
 if(result.ok===true){pending.ready=true;pending.window.close();if(quitting)app.quit();}
 else{closingWindows.delete(event.sender.id);quitting=false;void dialog.showMessageBox(pending.window,{type:'error',title:'No se pudo guardar',message:'RutasElorrieta sigue abierta para proteger tu trabajo.',detail:String(result?.error||'Revisa el espacio y los permisos de la carpeta e inténtalo de nuevo.').slice(0,1000)});}
});
async function createWindow() {
  ensureDataDirectories();
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1050,
    minHeight: 720,
    title: 'RutasElorrieta',
    backgroundColor: '#f5f6f3',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.on('context-menu',(_event,params)=>{if(params.isEditable)Menu.buildFromTemplate([{role:'cut'},{role:'copy'},{role:'paste'},{type:'separator'},{role:'selectAll'}]).popup({window});});
  window.on('close',event=>{if(!autosaveClients.has(window.webContents.id))return;const pending=closingWindows.get(window.webContents.id);if(pending?.ready)return;event.preventDefault();if(pending)return;const id=require('node:crypto').randomUUID();closingWindows.set(window.webContents.id,{window,id,ready:false});window.webContents.send('autosave:prepare-close',id);});
  require('./bluetooth.cjs')(window,()=>licensing.check().valid&&licensing.check().plan==='premium');
  const rendererId=window.webContents.id;window.on('closed',()=>closingWindows.delete(rendererId));
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)||url.startsWith('mailto:admobility26@gmail.com')) shell.openExternal(url);
    if(/^elorrietatrack:\/\/app\/(licencia\.html|THIRD-PARTY-NOTICES\.txt|LICENSE\.txt|runtime-licenses\.html)$/.test(url)){
      const child=new BrowserWindow({parent:window,width:1000,height:800,title:'RutasElorrieta · Créditos',webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false}});
      child.webContents.setWindowOpenHandler(({url:next})=>{if(/^https?:\/\//i.test(next)||next.startsWith('mailto:admobility26@gmail.com'))shell.openExternal(next);else if(/^elorrietatrack:\/\/app\/(runtime-licenses\.html|THIRD-PARTY-NOTICES\.txt|LICENSE\.txt)$/.test(next))child.loadURL(next);return {action:'deny'};});
      child.webContents.on('will-navigate',(event,next)=>{if(/^https?:\/\//i.test(next)||next.startsWith('mailto:')){event.preventDefault();if(/^https?:\/\//i.test(next)||next.startsWith('mailto:admobility26@gmail.com'))shell.openExternal(next);}});
      void child.loadURL(url);
    }
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('elorrietatrack://')){event.preventDefault();if(url.startsWith('mailto:admobility26@gmail.com'))void shell.openExternal(url);}
  });
  if (process.env.ELECTRON_START_URL) await window.loadURL(process.env.ELECTRON_START_URL);
  else await window.loadURL('elorrietatrack://app/index.html');
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([...(process.platform==='darwin'?[{role:'appMenu'}]:[{role:'fileMenu'}]),{label:'Edición',submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]},{role:'windowMenu'}]));
  // Identify the native app to OSM; Chromium's normal HTTP cache honors tile freshness.
  session.defaultSession.webRequest.onBeforeSendHeaders({urls:['https://tile.openstreetmap.org/*']},(details,callback)=>callback({requestHeaders:{...details.requestHeaders,'User-Agent':`ElorrietaTrack/${app.getVersion()} (+https://github.com/promociones7819-stack/elorrietaTrack; contact: admobility26@gmail.com)`}}));
  session.defaultSession.on('will-download',(_event,item)=>{const raw=item.getFilename(),directory=organized.downloadFolder(dataDirectory,raw);if(!directory)return;organized.ensure(dataDirectory);const extension=path.extname(raw).toLowerCase(),name=cleanFileName(raw,extension);item.setSavePath(organized.uniqueFile(directory,name));});
  const serveMapTile=require('./map-tiles.cjs')({directory:path.join(appDataDirectory,'cache-ortofoto'),fetchTile:(url,options)=>net.fetch(url,options)});
  const servePnoaTile=require('./map-tiles.cjs')({directory:path.join(appDataDirectory,'cache-ortofoto-pnoa'),fetchTile:(url,options)=>net.fetch(url,options),provider:'pnoa'});
  protocol.handle('elorrietatrack', async request => {
    if(new URL(request.url).hostname==='app'&&new URL(request.url).pathname==='/runtime-licenses.html'){const target=app.isPackaged?path.join(process.resourcesPath,'legal','Chromium-notices.html'):path.join(__dirname,'..','node_modules','electron','dist','LICENSES.chromium.html');return net.fetch(pathToFileURL(target).toString());}
    if((new URL(request.url).pathname.startsWith('/premium-ficha/')||new URL(request.url).pathname.includes('/premium-'))&&(!licensing.check().valid||licensing.check().plan!=='premium'))return new Response('Función Premium. Actualiza tu suscripción.',{status:403});
    if(new URL(request.url).pathname.startsWith('/__pnoa/'))return servePnoaTile(request);
    if(new URL(request.url).pathname.startsWith('/__geo/'))return serveMapTile(request);
    if(new URL(request.url).hostname==='app'&&(new URL(request.url).pathname.startsWith('/__recordings/')||new URL(request.url).pathname.startsWith('/__workspace/'))){
      try{
        const recording=new URL(request.url).pathname.startsWith('/__recordings/'),name=decodeURIComponent(new URL(request.url).pathname.slice(recording?'/__recordings/'.length:'/__workspace/'.length));if(recording&&(path.basename(name)!==name||!name.toLowerCase().endsWith('.mp4')))return new Response('Archivo no disponible',{status:404});if(!recording&&(!licensing.check().valid||licensing.check().plan!=='premium'))return new Response('Premium',{status:403});const file=recording?path.join(videoDirectory,name):workspaceFile(name);if(!recording&&!/\.(mp4|mov|m4v|webm)$/i.test(name))return new Response('No disponible',{status:403});const stat=await fs.promises.lstat(file);if(!stat.isFile())return new Response('Archivo no disponible',{status:404});
        const size=stat.size,range=request.headers.get('range');let start=0,end=size-1,status=200;const headers={'Accept-Ranges':'bytes','Content-Type':({'.mp4':'video/mp4','.m4v':'video/mp4','.mov':'video/quicktime','.webm':'video/webm'})[path.extname(file).toLowerCase()]||'application/octet-stream'};
        if(range){const match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}});start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));end=match[1]&&match[2]?Math.min(size-1,Number(match[2])):size-1;if(start>end||start>=size)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}});status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;}
        headers['Content-Length']=String(Math.max(0,end-start+1));const body=request.method==='HEAD'||!size?null:require('node:stream').Readable.toWeb(fs.createReadStream(file,{start,end}),{strategy:{highWaterMark:1024*1024,size:chunk=>chunk.byteLength}});return new Response(body,{status,headers});
      }catch{return new Response('Archivo no disponible',{status:404});}
    }
    let requestedPath;
    try { requestedPath = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Dirección no válida', { status: 400 }); }
    const filePath = path.resolve(distDirectory, `.${requestedPath === '/' ? '/index.html' : requestedPath}`);
    if (!filePath.startsWith(`${path.resolve(distDirectory)}${path.sep}`)) return new Response('No encontrado', { status: 404 });
    return net.fetch(pathToFileURL(filePath).toString());
  });
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    callback((permission === 'media' && details.mediaTypes?.includes('audio'))||(permission==='bluetooth'&&licensing.check().valid&&licensing.check().plan==='premium'&&_webContents.getURL().startsWith('elorrietatrack://app/')));
  });
  await createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
