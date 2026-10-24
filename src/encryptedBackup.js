export async function readEncryptedBackup(value){
 if(value?.format!=='elorrietatrack-encrypted-backup')return value;
 if(window.rutasVault)return window.rutasVault.decodeBackup(value);
 // Desktop can import a web encrypted backup without changing its local storage format.
 if(!window.RutasLocalVault)await import('../public/account-vault.js');
 return window.RutasLocalVault.openBackup(value);
}
