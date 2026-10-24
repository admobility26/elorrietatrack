import HomeLogo from './HomeLogo.jsx';
import HelpControls from './HelpControls.jsx';
// SPDX-FileCopyrightText: 2026 Aitor Delgado Martínez · AD Mobility
// SPDX-License-Identifier: LicenseRef-RutasAD-Educational-NonCommercial-1.0
import LegalNotice from './LegalNotice.jsx';
import React,{useState} from 'react';
import './welcome.css';

export default function Welcome({ onEnter }) {
 const [language,setLanguage]=useState(()=>localStorage.getItem('elorrietatrack-language')==='es'?'es':'eu');const t=(eu,es)=>language==='eu'?eu:es;
  return (
    <main className="welcome-page">
      <div className="welcome-card">
        <section className="welcome-copy">
          <div className="welcome-brand"><HomeLogo className="welcome-institution-logo" language={language}/><span>RutasElorrieta</span></div>
          <label>Hizkuntza / Idioma <select value={language} onChange={e=>{setLanguage(e.target.value);localStorage.setItem('elorrietatrack-language',e.target.value);}}><option value="eu">Euskara</option><option value="es">Castellano</option></select></label><div className="welcome-heading">
            <span className="welcome-eyebrow">{t('PRESTAKUNTZA ETA BIDE SEGURTASUNA','FORMACIÓN Y SEGURIDAD VIAL')}</span>
            <h1>{t('Ikasten laguntzen duten ibilbideak.','Recorridos que ayudan a aprender.')}</h1>
            <p>{t('Sortu ibilbideak, azaldu egoerak arbelean eta prestatu bideoak klaseetarako.','Crea trayectorias, explica situaciones en la pizarra y prepara vídeos para tus clases.')}</p>
          </div>
          <button className="welcome-enter" onClick={onEnter}>{t('Aplikazioan sartu','Entrar en la aplicación')} <span aria-hidden="true">→</span></button>
          <HelpControls language={language}/><LegalNotice language={language}/>
        </section>
        <aside className="welcome-art" aria-label="Elorrieta-Erreka Mari">
          <HomeLogo language={language}/>
          <div className="welcome-art-caption"><span>{t('PRESTAKUNTZA','FORMACIÓN')}</span><span>·</span><span>{t('BIDE AUDITORIA','AUDITORÍA VIAL')}</span></div>
        </aside>
      </div>
      <footer className="welcome-footer"><span>RutasElorrieta</span><span>GeoEuskadi · PNOA · OpenStreetMap</span></footer>
    </main>
  );
}
