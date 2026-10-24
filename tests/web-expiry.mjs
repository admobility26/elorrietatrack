import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {DatabaseSync} from 'node:sqlite';import {passwordHash,digest} from '../server/password.js';import {NO_EXPIRY} from '../server/accessPolicy.js';
const db=new DatabaseSync(':memory:');for(const f of ['schema.sql','licenses.sql','premium.sql','license-register.sql','admin-licenses.sql','license-pc.sql','web-expiry.sql'])db.exec(await fs.readFile('server/'+f,'utf8'));
function prepare(sql){const s=db.prepare(sql);const withArgs=args=>({first:async()=>s.get(...args),all:async()=>({results:s.all(...args)}),run:async()=>({meta:s.run(...args)})});return {...withArgs([]),bind:(...args)=>withArgs(args)};}
const env={AUTH:{prepare,batch:async statements=>{for(const s of statements)await s.run();}},ASSETS:{fetch:async()=>new Response('PRIVATE APP')}};
const token='admin-test';db.prepare("INSERT INTO users(id,email,password_hash,role,created_at) VALUES('admin','admin@example.invalid',?,'admin',?)").run(await passwordHash('test-password'),Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await digest(token),'admin',Date.now()+3600000);
let source=await fs.readFile('server/worker.js','utf8');source=source.replace("import manifest from '../dist/.vite/manifest.json';",`const manifest={'index.html':{file:'assets/index.js'},'web':{name:'WebAccess',file:'assets/web.js'},'app':{name:'App',file:'assets/app.js'}};`);for(const f of ['accessPolicy.js','licenses.js','password.js','request.js','security-policy.js','login-challenge.js'])source=source.replace("'./"+f+"'",JSON.stringify(new URL('../server/'+f,import.meta.url).href));await fs.mkdir('.tmp',{recursive:true});const file=new URL('../.tmp/expiry-worker.mjs',import.meta.url);await fs.writeFile(file,source);const worker=(await import(file.href+'?test='+Date.now())).default;
const origin='https://test.invalid';const request=(path,{body,method=body?'POST':'GET',cookie=token,ip='192.0.2.1'}={})=>worker.fetch(new Request(origin+path,{method,headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':ip,...(cookie?{Cookie:'__Host-elorrietatrack='+cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);
try{
 const future=Date.now()+86400000;let res=await request('/api/admin/users',{body:{email:'user@example.invalid',password:'test-password',plan:'premium',expiresAt:future}});assert.equal(res.status,201);const user=db.prepare("SELECT * FROM users WHERE email='user@example.invalid'").get();assert.equal(user.expires_at,future);
 res=await request('/api/admin/users',{body:{email:'bad@example.invalid',password:'test-password'}});assert.equal(res.status,400);
 res=await request('/api/login',{cookie:null,body:{email:user.email,password:'test-password'}});assert.equal(res.status,200);const sessionCookie=res.headers.get('set-cookie').match(/__Host-elorrietatrack=([^;]+)/)[1];const session=db.prepare('SELECT expires_at FROM sessions WHERE user_id=?').get(user.id);assert.equal(session.expires_at,future);
 db.prepare('UPDATE users SET expires_at=? WHERE id=?').run(Date.now()-1,user.id);assert.equal((await request('/api/me',{cookie:sessionCookie})).status,401);assert.equal((await request('/assets/app.js',{cookie:sessionCookie})).status,401);assert.equal((await request('/api/login',{cookie:null,body:{email:user.email,password:'test-password'}})).status,403);
 res=await request('/api/admin/users/'+user.id,{method:'PATCH',body:{expiresAt:'00-00-0000'}});assert.equal(res.status,200);assert.equal(db.prepare('SELECT expires_at FROM users WHERE id=?').get(user.id).expires_at,NO_EXPIRY);assert.equal(db.prepare('SELECT count(*) AS n FROM sessions WHERE user_id=?').get(user.id).n,0);
 assert.equal((await request('/api/login',{cookie:null,body:{email:user.email,password:'test-password'}})).status,200);assert.equal((await request('/api/admin/users/admin',{method:'PATCH',body:{expiresAt:future}})).status,400);db.prepare("UPDATE users SET expires_at=1 WHERE id='admin'").run();assert.equal((await request('/api/me')).status,200);
 const list=await(await request('/api/admin/users')).json();assert.equal(list.users.find(u=>u.id===user.id).expiresAt,NO_EXPIRY);console.log('PASS web expiry: required creation date, finite session limit, login/API/static denial after expiry, renewal invalidates sessions, permanent option, protected administrator and list dates.');
 const classroomHash=await passwordHash('classroom-password');for(let i=0;i<20;i++){db.prepare('INSERT INTO users(id,email,password_hash,created_at,expires_at) VALUES(?,?,?,?,?)').run('classroom-'+i,'classroom-'+i+'@example.invalid',classroomHash,Date.now(),NO_EXPIRY);assert.equal((await request('/api/login',{cookie:null,body:{email:'classroom-'+i+'@example.invalid',password:'classroom-password'}})).status,200);}console.log('PASS classroom: 20 separate student accounts can log in behind the same school IP.');
 const attack={cookie:null,ip:'192.0.2.90',body:{email:user.email,password:'wrong-password'}};
 for(let i=0;i<15;i++)assert.equal((await request('/api/login',attack)).status,401);
 const throttled=await request('/api/login',attack);assert.equal(throttled.status,429);assert.equal(throttled.headers.get('Retry-After'),'900');
 assert.equal((await request('/api/login',{cookie:null,ip:'192.0.2.91',body:{email:user.email,password:'test-password'}})).status,200);
 assert.equal((await request('/api/login',{cookie:null,ip:attack.ip,body:{email:user.email,password:'test-password'}})).status,429);
 for(let i=0;i<120;i++)assert.equal((await request('/api/login',{cookie:null,ip:'192.0.2.92',body:{email:'unknown-'+i+'@example.invalid',password:'wrong-password'}})).status,401);
 assert.equal((await request('/api/login',{cookie:null,ip:'192.0.2.92',body:{email:'another@example.invalid',password:'wrong-password'}})).status,429);
 console.log('PASS login throttling: targeted failures cannot lock another network; account/source and total/source limits remain enforced with Retry-After.');
 assert.equal((await request('/api/admin/users',{body:{email:123,password:'test-password',expiresAt:NO_EXPIRY}})).status,400);
 const passwordToken='password-test';db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await digest(passwordToken),user.id,Date.now()+3600000);
 assert.equal((await request('/api/password',{cookie:passwordToken,body:{currentPassword:{},password:'replacement-password'}})).status,400);
 for(let i=0;i<10;i++)assert.equal((await request('/api/password',{cookie:passwordToken,body:{currentPassword:'wrong-password',password:'replacement-password'}})).status,400);
 const lockedChange=await request('/api/password',{cookie:passwordToken,body:{currentPassword:'test-password',password:'replacement-password'}});assert.equal(lockedChange.status,429);assert.equal(lockedChange.headers.get('Retry-After'),'900');
 assert.equal(db.prepare('SELECT count(*) AS n FROM sessions WHERE token_hash=?').get(await digest(passwordToken)).n,1);
 db.prepare('UPDATE login_limits SET until_at=? WHERE bucket=?').run(Date.now()-1,await digest('password-change:'+user.id));
 assert.equal((await request('/api/password',{cookie:passwordToken,body:{currentPassword:'test-password',password:'replacement-password'}})).status,200);
 assert.equal((await request('/api/me',{cookie:passwordToken})).status,401);
 assert.equal((await request('/api/login',{cookie:null,ip:'192.0.2.93',body:{email:user.email,password:'test-password'}})).status,401);
 assert.equal((await request('/api/login',{cookie:null,ip:'192.0.2.93',body:{email:user.email,password:'replacement-password'}})).status,200);
 console.log('PASS password changes: malformed inputs rejected, account-wide attempt limit, expiry recovery, successful change revokes all old sessions and password.');
 env.TURNSTILE_SITE_KEY='test-public-key';env.TURNSTILE_SECRET_KEY='test-secret';
 const loginConfig=await(await request('/api/login-config',{cookie:null})).json();assert.deepEqual(loginConfig,{challengeRequired:true,sitekey:'test-public-key'});assert(!JSON.stringify(loginConfig).includes('test-secret'));
 for(let i=0;i<20;i++)assert.equal((await request('/api/login',{cookie:null,ip:'198.51.100.'+(i+1),body:{email:user.email,password:'replacement-password'}})).status,403);
 const realFetch=globalThis.fetch,used=new Set();let verifyCalls=0;
 try{
  globalThis.fetch=async(_url,options)=>{verifyCalls++;const b=JSON.parse(options.body);assert.equal(b.secret,'test-secret');const success=!used.has(b.response);used.add(b.response);return Response.json({success,action:'login',hostname:'test.invalid'});};
  const guarded={cookie:null,ip:'198.51.100.90',body:{email:user.email,password:'replacement-password',challengeToken:'test-single-use'}};
  assert.equal((await request('/api/login',guarded)).status,200);assert.equal((await request('/api/login',guarded)).status,403);assert.equal(verifyCalls,2);
 }finally{globalThis.fetch=realFetch;}
 console.log('PASS distributed login: 20 distinct IPs cannot skip challenge; real Worker enforces server verification, single-use result and public-only configuration.');
}finally{db.close();await fs.unlink(file);}
