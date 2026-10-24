// Only the server secret is used here; the site key is public configuration.
export const challengeEnabled=env=>!!(env.TURNSTILE_SITE_KEY||env.TURNSTILE_SECRET_KEY);
export async function verifyLoginChallenge(request,env,token){
 if(!challengeEnabled(env))return;
 const fail=(message,status)=>Object.assign(Error(message),{status});
 if(!env.TURNSTILE_SITE_KEY||!env.TURNSTILE_SECRET_KEY)throw fail('La verificación de acceso no está disponible. Contacta con el administrador.',503);
 if(typeof token!=='string'||!token||token.length>2048)throw fail('Completa la verificación de seguridad para entrar.',403);
 let result;
 try{
  const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
   method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(5000),
   body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token,...(request.headers.get('CF-Connecting-IP')?{remoteip:request.headers.get('CF-Connecting-IP')}:{})}),
  });
  if(!response.ok)throw Error();
  result=await response.json();
 }catch{throw fail('No se pudo comprobar la seguridad del acceso. Vuelve a intentarlo.',503);}
 // Siteverify enforces token expiry and single use; bind its result to this login and host.
 if(result.success!==true||result.action!=='login'||result.hostname!==new URL(request.url).hostname)throw fail('La verificación ha caducado o no es válida. Repítela para entrar.',403);
}
