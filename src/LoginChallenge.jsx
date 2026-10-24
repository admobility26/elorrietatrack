import React,{useEffect,useRef,useState} from 'react';
let loading;
function loadTurnstile(){
 if(window.turnstile)return Promise.resolve(window.turnstile);
 if(!loading)loading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
  const fail=()=>{clearTimeout(timer);script.remove();loading=null;reject(Error('No se pudo cargar la verificación. Comprueba tu conexión o bloqueador de contenido.'));};
  const timer=setTimeout(fail,15000);script.onerror=fail;script.onload=()=>{clearTimeout(timer);if(window.turnstile)resolve(window.turnstile);else fail();};document.head.append(script);
 });
 return loading;
}
export default function LoginChallenge({sitekey,onToken,onError,language,revision}){
 const container=useRef(null),[retry,setRetry]=useState(0),[failed,setFailed]=useState(false);
 useEffect(()=>{
  let cancelled=false,widget;setFailed(false);onToken('');
  const failure=()=>{if(cancelled)return;onToken('');setFailed(true);onError(language==='eu'?'Segurtasun-egiaztapena ezin izan da osatu. Saiatu berriro.':'No se pudo completar la verificación de seguridad. Vuelve a intentarlo.');};
  void loadTurnstile().then(api=>{if(cancelled)return;widget=api.render(container.current,{sitekey,action:'login',size:'flexible',language:language==='es'?'es':'auto',callback:token=>{if(!cancelled){onToken(token);setFailed(false);}},'expired-callback':()=>{if(!cancelled)onToken('');},'error-callback':failure});}).catch(failure);
  return()=>{cancelled=true;if(widget!==undefined)window.turnstile?.remove(widget);};
 },[sitekey,onToken,onError,language,revision,retry]);
 return <div className="login-challenge"><div ref={container}/>{failed&&<button type="button" onClick={()=>setRetry(n=>n+1)}>{language==='eu'?'Egiaztapena berriro saiatu':'Reintentar verificación'}</button>}</div>;
}
