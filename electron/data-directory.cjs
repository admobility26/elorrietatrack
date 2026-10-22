const fs=require('node:fs'),path=require('node:path');
module.exports=documents=>{const folder=path.join(documents,'elorrietatrac');fs.mkdirSync(folder,{recursive:true});return folder;};
