import HomeLogo from './HomeLogo.jsx';
import HelpControls from './HelpControls.jsx';
import React,{useState} from 'react';
import './web-access.css';
export default function DesktopLicense({initial,onReady}){
 const [status,setStatus]=useState(initial),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function run(key){setBusy(true);setError('');try{const s=await(key?window.elorrietaDesktop.activateLicense(key):window.elorrietaDesktop.licenseStatus());setStatus(s);if(s.valid)onReady();else setError(s.error);}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <main className="access-page"><form className="access-card" onSubmit={e=>{e.preventDefault();run(new FormData(e.currentTarget).get('key'));}}><span className="access-brand"><HomeLogo language={"es"}/>ElorrietaTrack</span><HelpControls language="es"/><h1>Lizentzia / Licencia</h1><p>Introduce la clave facilitada por el administrador. Las claves Básica y Premium activan un solo equipo. ADMIN permite varios equipos y no caduca.</p><label>Activación / Aktibazioa<input name="key" required placeholder="EEM-… / PRE-… / ADMIN-…" maxLength={100} autoComplete="off"/></label><button disabled={busy}>Activar este equipo</button><button type="button" disabled={busy} onClick={()=>run()}>Comprobar renovación</button><p>La renovación conserva el equipo activado. Necesitas Internet para activar y, como mínimo, cada 30 días.</p>{(error||status?.error)&&<p role="alert">{error||status.error}</p>}</form></main>;
}
