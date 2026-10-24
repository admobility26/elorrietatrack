export async function readJSON(request,maxBytes=4096){
 const fail=(message,status)=>Object.assign(Error(message),{status});
 if(Number(request.headers.get('content-length'))>maxBytes)throw fail('Solicitud demasiado grande.',413);
 const reader=request.body?.getReader();if(!reader)throw fail('Solicitud JSON vacía.',400);
 const parts=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw fail('Solicitud demasiado grande.',413);}parts.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
 try{const value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{throw fail('Solicitud JSON inválida.',400);}
}
