const fs=require('node:fs'),path=require('node:path');
// The legacy root also contains source code, installers and private administration
// files on the developer's Mac. Move ONLY runtime data, never the whole root.
const entries=['.datos-de-la-aplicacion','Biblioteca de recorridos.json','Archivos GPX','Vídeos MP4','App','Exportaciones','Alumnos'];
const journalName='.migracion-RutasElorrieta.json';
function write(file,value){const temporary=file+'.tmp';fs.writeFileSync(temporary,JSON.stringify(value,null,2),{mode:0o600});fs.renameSync(temporary,file);}
function exists(file){try{fs.lstatSync(file);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}}
function assertDirectory(file){if(exists(file)&&(!fs.lstatSync(file).isDirectory()||fs.lstatSync(file).isSymbolicLink()))throw Error('La carpeta de datos no es un directorio local: '+file);}
function needsMigration(documents){const old=path.join(documents,'elorrietatrac');return entries.some(name=>exists(path.join(old,name)));}
function dataDirectory(documents,{beforeMove=()=>{}}={}){
 const old=path.join(documents,'elorrietatrac'),target=path.join(documents,'RutasElorrieta'),journal=path.join(target,journalName);
 assertDirectory(old);assertDirectory(target);
 const pending=entries.filter(name=>exists(path.join(old,name)));
 let state=null;if(exists(journal)){try{state=JSON.parse(fs.readFileSync(journal,'utf8'));}catch{throw Error('No se puede leer el registro de migración. No se han movido más datos.');}if(state.version!==1||!['moving','complete'].includes(state.status))throw Error('Registro de migración desconocido.');}
 if(!pending.length){if(state?.status==='moving'){state.status='complete';write(journal,state);}fs.mkdirSync(target,{recursive:true});return target;}
 beforeMove();
 // Never silently choose or merge two profiles/libraries. Interrupted moves can
 // resume because every item has exactly one owner and the journal is retained.
 if(state?.status==='complete')throw Error('La versión antigua ha vuelto a guardar datos en Documentos/elorrietatrac. Cierra las versiones antiguas y revisa ambas carpetas antes de continuar. No se ha sobrescrito nada.');
 for(const name of pending)if(exists(path.join(target,name)))throw Error('Hay datos en ambas carpetas ('+name+'). No se han mezclado ni sobrescrito. Revisa Documentos/elorrietatrac y Documentos/RutasElorrieta.');
 if(!state&&entries.some(name=>exists(path.join(target,name))))throw Error('Ya existen datos en Documentos/RutasElorrieta. No se ha modificado ninguna biblioteca.');
 fs.mkdirSync(target,{recursive:true});state=state||{version:1,status:'moving',startedAt:new Date().toISOString()};write(journal,state);
 for(const name of pending)fs.renameSync(path.join(old,name),path.join(target,name));
 state.status='complete';state.completedAt=new Date().toISOString();write(journal,state);
 return target;
}
module.exports=dataDirectory;module.exports.entries=entries;module.exports.needsMigration=needsMigration;
