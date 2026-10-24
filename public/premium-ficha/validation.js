// Shared by the embedded editor and the main import paths. No HTML is trusted.
(() => {
const PERMITS=['AM','A1/A2','B','C1/C','D1/D'];
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const safeId=id=>typeof id==='string'&&id.length>0&&id.length<=200&&!['__proto__','constructor','prototype'].includes(id);
const validRouteLinks=links=>links==null||(Array.isArray(links)&&links.length<=1000&&links.every(r=>object(r)&&typeof r.key==='string'&&typeof r.name==='string'&&['routes','reviews'].includes(r.kind)&&safeId(r.projectId)));
function validateStudents(db){
 if(!object(db)||!object(db.students)||Object.keys(db.students).length>10000)throw Error('Copia de alumnos no válida.');
 for(const [id,s] of Object.entries(db.students)){
  if(!safeId(id)||!s||s.id!==id||typeof s.name!=='string'||!s.name.trim()||s.name.length>500||!object(s.permits))throw Error('Datos del alumno no válidos.');
  if(s.absences!=null&&(!Array.isArray(s.absences)||s.absences.length>10000||s.absences.some(d=>typeof d!=='string'||!/^\d{4}-\d\d-\d\d$/.test(d))))throw Error('Fechas de ausencias no válidas.');
  if(!validRouteLinks(s.rutas))throw Error('Vínculos de recorridos no válidos.');
  if(s.rutasadPreviousIds!=null&&(!Array.isArray(s.rutasadPreviousIds)||s.rutasadPreviousIds.some(id=>!safeId(id)||id===s.id)))throw Error('Vínculos de alumnos no válidos.');
  for(const [key,p] of Object.entries(s.permits)){
   if(!PERMITS.includes(key)||!object(p)||!Array.isArray(p.history)||p.history.length>10000||!object(p.theory)||!object(p.practical))throw Error('Permiso no válido.');
   if(p.history.some(e=>!object(e)||!safeId(e.id)||typeof e.date!=='string'||!/^\d{4}-\d\d-\d\d$/.test(e.date)||!Number.isFinite(Number(e.minutes))||Number(e.minutes)<0))throw Error('Clase no válida.');
   for(const entry of p.history)if(entry.rutas!=null&&(!Array.isArray(entry.rutas)||entry.rutas.length>1000||entry.rutas.some(r=>!object(r)||typeof r.key!=='string'||typeof r.name!=='string'||!['routes','reviews'].includes(r.kind)||!safeId(r.projectId))))throw Error('Vínculos de recorridos no válidos.');
   if(new Set(p.history.map(e=>e.id)).size!==p.history.length)throw Error('Clases duplicadas.');
  }
 }
 return db;
}
globalThis.RutasValidateStudents=validateStudents;
})();
