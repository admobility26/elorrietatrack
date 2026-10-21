// Run only after registering the domain and adding its DNS zone to this Cloudflare account.
import fs from 'node:fs/promises';import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2),input=args.find(a=>!a.startsWith('--'));if(!input)throw Error('Uso: npm run domain -- app.tudominio.com [--apply]');
const url=new URL(input.includes('://')?input:'https://'+input);if(url.protocol!=='https:'||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash||!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(url.hostname)||url.hostname.endsWith('workers.dev'))throw Error('Introduce únicamente un dominio propio o subdominio válido.');
const file=new URL('../wrangler.jsonc',import.meta.url),original=await fs.readFile(file,'utf8'),config=JSON.parse(original),origin=url.origin;
config.workers_dev=true;config.vars={...config.vars,PUBLIC_ORIGIN:origin};config.routes=[...(config.routes||[]).filter(r=>r.pattern!==url.hostname),{pattern:url.hostname,custom_domain:true}];
console.log('Dominio propuesto: '+origin+'\nSe conserva workers.dev para los instaladores antiguos.\nLa zona DNS debe existir en esta cuenta; Cloudflare debe poder emitir el certificado.\nLas bibliotecas del navegador no cambian de origen automáticamente: exportar copia en la dirección antigua e importarla en la nueva.');
if(!args.includes('--apply')){console.log('Vista previa; no se ha modificado ni publicado nada. Añade --apply para conectar y publicar.');process.exit(0);}
await fs.writeFile(file,JSON.stringify(config,null,2)+'\n');const result=spawnSync('npx',['wrangler','deploy'],{cwd:new URL('..',import.meta.url),stdio:'inherit'});if(result.status!==0){await fs.writeFile(file,original);throw Error('No se pudo conectar el dominio. Se ha restaurado la configuración local; comprueba DNS, acceso y la publicación en Cloudflare.');}
console.log('Dominio conectado. Verifica login, licencias y biblioteca antes de retirar direcciones antiguas. No cambies el secreto de firma ni la base D1.');
