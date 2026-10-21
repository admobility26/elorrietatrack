import React,{useState} from 'react';
import './web-access.css';
export default function DesktopLicense({initial,onReady}){
 const [status,setStatus]=useState(initial),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function run(key){setBusy(true);setError('');try{const s=await(key?window.elorrietaDesktop.activateLicense(key):window.elorrietaDesktop.licenseStatus());setStatus(s);if(s.valid)onReady();else setError(s.error);}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <main className="access-page"><form className="access-card" onSubmit={e=>{e.preventDefault();run(new FormData(e.currentTarget).get('key'));}}><span className="access-brand"><img src="./elorrieta-logo.svg" alt="Elorrieta"/>ElorrietaTrack</span><h1>Lizentzia / Licencia</h1><p>Introduce la clave facilitada por el administrador. Cada clave activa un solo equipo y no se puede volver a utilizar.</p><label>Activación / Aktibazioa<input name="key" required placeholder="EEM-…" maxLength={100} autoComplete="off"/></label><button disabled={busy}>Activar este equipo</button><button type="button" disabled={busy} onClick={()=>run()}>Comprobar renovación</button><p>La renovación conserva el equipo activado. Necesitas Internet para activar y, como mínimo, cada 30 días.</p>{(error||status?.error)&&<p role="alert">{error||status.error}</p>}</form></main>;
}
