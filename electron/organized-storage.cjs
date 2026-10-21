const fs=require('node:fs'),path=require('node:path');
function folders(root){return {root,gpx:path.join(root,'Archivos GPX'),videos:path.join(root,'Vídeos MP4'),app:path.join(root,'App'),backups:path.join(root,'App','Copias de seguridad'),exports:path.join(root,'Exportaciones')};}
function ensure(root){const dirs=folders(root);for(const dir of Object.values(dirs))fs.mkdirSync(dir,{recursive:true});return dirs;}
function writeLibrary(root,storage){ensure(root);const file=path.join(root,'Biblioteca de recorridos.json'),tmp=file+'.'+require('node:crypto').randomUUID()+'.tmp';try{fs.writeFileSync(tmp,JSON.stringify({version:1,updatedAt:new Date().toISOString(),storage},null,2));fs.renameSync(tmp,file);}finally{fs.rmSync(tmp,{force:true});}}
function uniqueFile(directory,name){const ext=path.extname(name),stem=path.basename(name,ext);let file=path.join(directory,name);for(let i=2;fs.existsSync(file);i++)file=path.join(directory,`${stem}-${i}${ext}`);return file;}
function downloadFolder(root,name){const dirs=folders(root),ext=path.extname(name).toLowerCase();if(ext==='.gpx')return dirs.gpx;if(ext==='.mp4')return dirs.videos;if(ext==='.json')return dirs.backups;if(['.pdf','.png'].includes(ext))return dirs.exports;return null;}
module.exports={folders,ensure,writeLibrary,uniqueFile,downloadFolder,libraryStorage:(_root,storage)=>storage};
