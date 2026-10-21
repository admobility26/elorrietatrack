const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('elorrietaDesktop', Object.freeze({
  licenseStatus:()=>ipcRenderer.invoke('license:status'),
  activateLicense:key=>ipcRenderer.invoke('license:activate',key),
  onPrepareClose:callback=>{const listener=(_event,id)=>callback(id);ipcRenderer.on('autosave:prepare-close',listener);return ()=>ipcRenderer.removeListener('autosave:prepare-close',listener);},
  completeClose:(id,ok,error)=>ipcRenderer.send('autosave:close-ready',{id,ok,error}),
  beginMovie:name=>ipcRenderer.invoke('movie:begin',name),
  writeMovie:(id,bytes)=>ipcRenderer.invoke('movie:write',id,bytes),
  finishMovie:id=>ipcRenderer.invoke('movie:finish',id),
  abortMovie:id=>ipcRenderer.invoke('movie:abort',id),
  dataDirectory: ipcRenderer.sendSync('files:get-data-directory'),
  loadLibrary: () => ipcRenderer.invoke('library:load'),
  saveLibrary: storage => ipcRenderer.invoke('library:save', storage),
  saveLibraryBeforeClose: storage => ipcRenderer.sendSync('library:save-sync', storage),
  saveBackup:(name,data)=>ipcRenderer.invoke('backup:save',{name,data}),
  saveVideo: (name, bytes) => ipcRenderer.invoke('files:save-video', name, bytes),
  openDataFolder: () => ipcRenderer.invoke('files:open-data-folder'),
}));
