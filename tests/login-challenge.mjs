import assert from 'node:assert/strict';
import {challengeEnabled,verifyLoginChallenge} from '../server/login-challenge.js';
const request=new Request('https://login.example.invalid/api/login',{headers:{'CF-Connecting-IP':'192.0.2.1'}});
const env={TURNSTILE_SITE_KEY:'test-site-key',TURNSTILE_SECRET_KEY:'test-only-secret'};
const originalFetch=globalThis.fetch;
let calls=0,seen;
try{
 assert.equal(challengeEnabled({}),false);await verifyLoginChallenge(request,{},undefined);
 for(const incomplete of [{TURNSTILE_SITE_KEY:'key'},{TURNSTILE_SECRET_KEY:'secret'}])await assert.rejects(verifyLoginChallenge(request,incomplete,'token'),e=>e.status===503);
 globalThis.fetch=async(url,options)=>{calls++;seen=JSON.parse(options.body);assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');return Response.json({success:true,action:'login',hostname:'login.example.invalid'});};
 for(const token of [undefined,'',{},'x'.repeat(2049)])await assert.rejects(verifyLoginChallenge(request,env,token),e=>e.status===403);
 assert.equal(calls,0);await verifyLoginChallenge(request,env,'single-use-token');assert.deepEqual(seen,{secret:'test-only-secret',response:'single-use-token',remoteip:'192.0.2.1'});
 for(const result of [{success:false,'error-codes':['timeout-or-duplicate']},{success:true,action:'other',hostname:'login.example.invalid'},{success:true,action:'login',hostname:'attacker.invalid'},{success:true},{}]){
  globalThis.fetch=async()=>Response.json(result);await assert.rejects(verifyLoginChallenge(request,env,'token'),e=>e.status===403);
 }
 for(const implementation of [async()=>{throw Error('network');},async()=>new Response('unavailable',{status:503}),async()=>new Response('not JSON')]){globalThis.fetch=implementation;await assert.rejects(verifyLoginChallenge(request,env,'token'),e=>e.status===503);}
 console.log('PASS Turnstile server: missing, malformed, reused/expired, wrong-action and wrong-host tokens rejected; network failure and partial configuration fail closed.');
}finally{globalThis.fetch=originalFetch;}
