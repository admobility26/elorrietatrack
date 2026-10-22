import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url)));
if(c.account_id!=='a42daa5d5844f10ca43694aaba7ff82b'||c.d1_databases?.[0]?.database_id!=='2c770bdc-780c-4dfe-b3a9-43a82991aac0'||!c.vars?.PUBLIC_ORIGIN?.startsWith('https://'))throw Error('Configuración de la instalación independiente incorrecta.');
