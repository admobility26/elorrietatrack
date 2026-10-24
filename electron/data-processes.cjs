const {execFileSync}=require('node:child_process');
module.exports=()=>{
 const platform=process.platform;
 if(platform==='darwin')return execFileSync('/bin/ps',['-axo','pid=,comm='],{encoding:'utf8'}).split('\n').some(line=>{const m=line.trim().match(/^(\d+)\s+(.+)$/);return m&&Number(m[1])!==process.pid&&/\/Contents\/MacOS\/(RutasElorrieta|ElorrietaTrack Estable)$/.test(m[2]);});
 if(platform==='win32')return execFileSync('tasklist',['/FO','CSV','/NH'],{encoding:'utf8',windowsHide:true}).split('\n').some(line=>{const m=line.match(/^"([^"]+)","(\d+)"/);return m&&Number(m[2])!==process.pid&&/^(RutasElorrieta|ElorrietaTrack Estable)\.exe$/i.test(m[1]);});
 return false;
};
