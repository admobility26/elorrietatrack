import assert from 'node:assert/strict';
import {chromium,webkit,expect} from '@playwright/test';
import contentSecurity from '../server/security-policy.js';
import {preview} from 'vite';
const server=process.env.TEST_URL?null:await preview({preview:{host:'127.0.0.1',port:0}});
const testURL=process.env.TEST_URL||'http://127.0.0.1:'+server.httpServer.address().port;
try{
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await engine.launch({headless:true});
 try{
  const context=await browser.newContext({serviceWorkers:'block'});let submissions=0;
  await context.route('**/*',async route=>{if(route.request().resourceType()==='document'){const r=await route.fetch();await route.fulfill({response:r,headers:{...r.headers(),'content-security-policy':contentSecurity}});}else await route.continue();});
  await context.route('**/api/me',r=>r.fulfill({status:401,json:{error:'Login required'}}));
  await context.route('**/api/login-config',r=>r.fulfill({json:{challengeRequired:true,sitekey:'test-key'}}));
  await context.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',r=>r.fulfill({contentType:'text/javascript',body:`window.turnstile={render(node,options){const b=document.createElement('button');b.type='button';b.textContent='Test security check';b.onclick=()=>options.callback('test-token');node.append(b);window.testExpire=()=>options['expired-callback']();return node;},remove(node){node.replaceChildren();}};`}));
  await context.route('**/api/login',r=>{submissions++;assert.equal(r.request().postDataJSON().challengeToken,'test-token');return r.fulfill({status:401,json:{error:'Test wrong password'}});});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(testURL);await page.locator('.access-language select').selectOption('es');
  const submit=page.locator('.access-card button[type=submit]');await page.getByRole('button',{name:'Test security check'}).waitFor();await expect(submit).toBeDisabled();
  await page.locator('input[name=email]').fill('test@example.invalid');await page.locator('input[name=password]').fill('test-password');
  await page.getByRole('button',{name:'Test security check'}).click();await expect(submit).toBeEnabled();await page.evaluate(()=>window.testExpire());await expect(submit).toBeDisabled();
  await page.getByRole('button',{name:'Test security check'}).click();await submit.click();await expect(page.getByRole('alert')).toHaveText('Test wrong password');await expect(submit).toBeDisabled();assert.equal(submissions,1);
  await page.getByRole('button',{name:'Test security check'}).click();await expect(submit).toBeEnabled();assert.deepEqual(errors,[]);
  console.log('PASS '+name+' login UI: CSP permits widget, submit waits for challenge, expiry clears token and wrong password resets challenge.');
 }finally{await browser.close();}
}

}finally{await new Promise(resolve=>server?server.httpServer.close(resolve):resolve());}
