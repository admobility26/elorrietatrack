import {checkpointAutosave,finishAutosave,hasActiveWork,reportAutosave,REVISION_KEY} from './autosave.js';
// SPDX-FileCopyrightText: 2026 Aitor Delgado Martínez · AD Mobility
// SPDX-License-Identifier: LicenseRef-RutasAD-Educational-NonCommercial-1.0
import React from 'react';
import {watchDataFolder,saveDataFolder,reconnectDataFolder} from './dataFolder.js';

import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import './help.css';

const STORAGE_PREFIX = 'elorrietatrack-';
const librarySnapshot = () => Object.fromEntries(Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
  .filter(key => key?.startsWith(STORAGE_PREFIX)).map(key => [key, localStorage.getItem(key)]));

function connectDesktopLibrary() {
  const desktop = window.elorrietaDesktop;
  if (!desktop) return;
  let saveTimer;
  const scheduleSave = () => {
    clearTimeout(saveTimer);
    reportAutosave('saving');saveTimer = setTimeout(() => desktop.saveLibrary(librarySnapshot()).then(()=>reportAutosave('saved')).catch(error => reportAutosave('error',error.message)), 350);
  };
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (this===localStorage&&key.startsWith(STORAGE_PREFIX)){originalSetItem.call(localStorage,REVISION_KEY,String(Math.max(Date.now(),Number(localStorage.getItem(REVISION_KEY)||0)+1)));scheduleSave();}
  };
  Storage.prototype.removeItem = function (key) {
    originalRemoveItem.call(this, key);
    if (this===localStorage&&key.startsWith(STORAGE_PREFIX)){originalSetItem.call(localStorage,REVISION_KEY,String(Math.max(Date.now(),Number(localStorage.getItem(REVISION_KEY)||0)+1)));scheduleSave();}
  };
  window.addEventListener('beforeunload', () => {
    clearTimeout(saveTimer);
    checkpointAutosave();
    if(!desktop.saveLibraryBeforeClose(librarySnapshot()))reportAutosave('error','No se pudo guardar en el disco.');
  });
  desktop.onPrepareClose?.(async id=>{try{await finishAutosave();await saveDataFolder();clearTimeout(saveTimer);if(!desktop.saveLibraryBeforeClose(librarySnapshot()))throw Error('No se pudo guardar en el disco.');desktop.completeClose(id,true);}catch(e){reportAutosave('error',e.message);desktop.completeClose(id,false,e.message);}});
}

async function start() {
  const root = createRoot(document.getElementById('root'));
  if(window.elorrietaDesktop?.licenseStatus){
    const {default:DesktopLicense}=await import('./DesktopLicense.jsx');
    let status;try{status=await window.elorrietaDesktop.licenseStatus();}catch(e){status={valid:false,error:e.message};}
    if(!status.valid)await new Promise(resolve=>root.render(<DesktopLicense initial={status} onReady={resolve}/>));
    setInterval(async()=>{try{const state=await window.elorrietaDesktop.licenseStatus();if(!state.valid){await finishAutosave();root.render(<DesktopLicense initial={state} onReady={()=>location.reload()}/>);}}catch{}},600000);
  }
  if (import.meta.env.PROD && 'serviceWorker' in navigator && !window.elorrietaDesktop) navigator.serviceWorker.register('/sw.js').catch(() => {});

  if (import.meta.env.PROD && !window.elorrietaDesktop) {
    const {Login,accountRequest,monitorAccount}=await import('./WebAccess.jsx');
    let user;
    try { user=(await accountRequest('me')).user; } catch(error) {
      if(error.status!==401){root.render(<main className="access-page"><p>No se pudo comprobar el acceso. Comprueba tu conexión y recarga la página.</p></main>);return;}
      user=await new Promise(resolve=>root.render(<Login onLogin={(user,language)=>resolve({...user,loginLanguage:language})}/>));
    }
    await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/account-storage.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
    window.installRutasAccount(user);
    if(user.loginLanguage)localStorage.setItem('elorrietatrack-language',user.loginLanguage);
    monitorAccount(user);
  }
  watchDataFolder();
  if (window.elorrietaDesktop) {
    try {
      const library = await window.elorrietaDesktop.loadLibrary();
      const localRevision=Number(localStorage.getItem(REVISION_KEY)||0),diskRevision=Number(library[REVISION_KEY]||0);
      for (const [key, value] of Object.entries(localRevision>diskRevision?{}:library)) {
        if (key.startsWith(STORAGE_PREFIX) && typeof value === 'string') localStorage.setItem(key, value);
      }
    } catch (error) { console.error('No se pudo abrir la biblioteca local:', error); }
    connectDesktopLibrary();
  }
  window.addEventListener('elorrietatrack:retry-save',async()=>{try{await checkpointAutosave();if(window.elorrietaDesktop)await window.elorrietaDesktop.saveLibrary(librarySnapshot());await saveDataFolder();reportAutosave('saved');}catch(e){reportAutosave('error',e.message);}});
  window.addEventListener('pagehide',()=>{checkpointAutosave();saveDataFolder().catch(e=>reportAutosave('error',e.message));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){checkpointAutosave();saveDataFolder().catch(e=>reportAutosave('error',e.message));}});
  window.addEventListener('beforeunload',event=>{checkpointAutosave();if(!window.elorrietaDesktop&&hasActiveWork()){event.preventDefault();event.returnValue='';}});
  if(!window.elorrietaDesktop)reconnectDataFolder().catch(e=>reportAutosave('error',e.message));
  const openApp = async () => {
    if(window.elorrietaDesktop?.licenseStatus){const state=await window.elorrietaDesktop.licenseStatus();if(!state.valid){const {default:DesktopLicense}=await import('./DesktopLicense.jsx');root.render(<DesktopLicense initial={state} onReady={()=>window.dispatchEvent(new Event('elorrietatrack:home'))}/>);return;}}
    const { default: App } = await import('./App.jsx');
    root.render(<React.StrictMode><App /></React.StrictMode>);
  };
  let goingHome=false;
  const showHome=async()=>{if(goingHome)return;goingHome=true;try{await finishAutosave();await saveDataFolder();if(window.elorrietaDesktop)await window.elorrietaDesktop.saveLibrary(librarySnapshot());const {default:Welcome}=await import('./Welcome.jsx');root.render(<React.StrictMode><Welcome onEnter={openApp}/></React.StrictMode>);}catch(e){reportAutosave('error',e.message);}finally{goingHome=false;}};
  window.addEventListener('elorrietatrack:home',showHome);
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data==='elorrietatrack:home')window.dispatchEvent(new Event('elorrietatrack:home'));});
  await showHome();
}

start();
