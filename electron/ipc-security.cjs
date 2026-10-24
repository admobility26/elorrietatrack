// Only the registered main window may use the native bridge. Subframes never inherit it.
module.exports=function createSecurity({app,check}){
 const windows=new Map(),recoveryWriters=new Set();
 function trustedURL(value){try{const u=new URL(value);if(u.protocol==='elorrietatrack:'&&u.hostname==='app'&&!u.username&&!u.password&&!u.port)return true;if(!app.isPackaged&&process.env.ELECTRON_START_URL){const dev=new URL(process.env.ELECTRON_START_URL);return ['http:','https:'].includes(dev.protocol)&&['127.0.0.1','localhost','[::1]'].includes(dev.hostname)&&u.origin===dev.origin&&!u.username&&!u.password;}return false;}catch{return false;}}
 function trustedSender(event){const sender=event?.sender;return !!sender&&windows.get(sender.id)===sender&&!!event.senderFrame&&event.senderFrame===sender.mainFrame&&trustedURL(event.senderFrame.url);}
 const setup=new Set(['license:status','license:activate','license:paste','files:get-data-directory','autosave:attached','autosave:close-ready']);
 const recovery=new Set(['library:save','library:save-sync']);
 const finishing=new Set(['movie:write','movie:finish','movie:abort']);
 function authorize(channel,event){
  if(!trustedSender(event))throw Error('Origen de la operación no permitido.');
  if(setup.has(channel))return;
  // An export opened with a valid licence may finish; each handle checks its owner.
  if(finishing.has(channel))return;
  const state=check();if(state.valid)recoveryWriters.add(event.sender.id);
  // Preserve pending work if a licence expires during a class. No reads or new exports.
  if(!state.valid&&!(recovery.has(channel)&&recoveryWriters.has(event.sender.id)))throw Error('Licencia no activa.');
  if((channel.startsWith('workspace:')||channel.startsWith('bluetooth:')||channel==='files:save-gpx')&&state.plan!=='premium')throw Error('Función Premium. Actualiza tu suscripción.');
 }
 function register(contents){windows.set(contents.id,contents);contents.once('destroyed',()=>{windows.delete(contents.id);recoveryWriters.delete(contents.id);});}
 function allowPermission(contents,permission,details){
  if(!contents||windows.get(contents.id)!==contents||!details?.isMainFrame||!trustedURL(details.requestingUrl))return false;
  const state=check();if(!state.valid)return false;
  if(permission==='bluetooth')return state.plan==='premium';
  if(permission!=='media')return false;
  return Array.isArray(details.mediaTypes)?details.mediaTypes.length===1&&details.mediaTypes[0]==='audio':details.mediaType==='audio';
 }
 return {authorize,register,trustedSender,trustedURL,allowPermission};
};
