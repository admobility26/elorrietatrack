// SPDX-FileCopyrightText: 2026 Aitor Delgado Martínez · AD Mobility
// SPDX-License-Identifier: LicenseRef-RutasAD-Educational-NonCommercial-1.0
import React from 'react';
import './legal-notice.css';
export default function LegalNotice({language='eu'}){
 const t=(eu,es)=>language==='eu'?eu:es;
 return <aside className="rutas-legal-notice" aria-label={t('Egiletza eta lizentziak','Autoría y licencias')}>
 <strong>© 2026 Aitor Delgado Martínez · AD Mobility</strong><span>{t('Jatorrizko ekarpenen eskubideak erreserbatuta.','Derechos reservados sobre las aportaciones originales.')}</span>
 <p>{t('Aplikazioa lanean eta irakaskuntza ordainduan erabil daiteke, titularrak emandako erabilera-lizentziarekin. Kodea berrerabiltzeko baldintzak bereiziak dira; egiletza mantendu behar da.','Uso profesional y docente remunerado permitido con la licencia de uso concedida por el titular. La reutilización del código tiene condiciones distintas y exige conservar la autoría.')}</p>
 <p>{t('Baimenik gabeko erabileretan dagozkion legezko ekintzak baliatu ahal izango dira.','Frente a usos no autorizados se podrán ejercer las acciones legales correspondientes.')}</p>
 <details><summary>{t('Mapak eta hirugarrenen kredituak','Mapas y créditos de terceros')}</summary><p>geoEuskadi: Eusko Jaurlaritza / Gobierno Vasco. geoEuskadi. · PNOA: IGN / Sistema Cartográfico Nacional, CC BY 4.0 scne.es. · © OpenStreetMap contributors, ODbL.</p><p>React / React DOM (Meta, MIT) · MapLibre GL JS (MapLibre / Mapbox et al., BSD/MIT/ISC) · pdf-lib (Andrew Dillon, MIT) · Electron (Electron contributors / GitHub, MIT) · Chromium et al. · DM Sans, DM Mono, Manrope (SIL OFL 1.1).</p><p>{t('Hirugarrenen eskubideak eta lizentziak mantentzen dira. Mapen zerbitzuek ez dute erabilgarritasuna bermatzen; OSMk ez du deskarga masiborik edo offline aurrekargarik onartzen. Elorrietaren logoak bere titularraren eskubideak mantentzen ditu; ez du babes instituzionalik adierazten.','Se respetan los derechos y licencias de terceros. Los servicios cartográficos no garantizan disponibilidad; OSM no permite descarga masiva ni precarga offline. El logo de Elorrieta mantiene los derechos de su titular y no implica respaldo institucional.')}</p></details>
 <a href="./licencia.html" target="_blank" rel="noopener noreferrer">{t('Kreditu osoak, iturriak eta lizentziak','Créditos completos, fuentes y licencias')}</a>
 </aside>;
}
