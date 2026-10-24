import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getDatabase,ref,onValue,set,update,remove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// Pega aquí los valores que te da la consola de Firebase (Configuración del proyecto > Tus apps > SDK).
export const firebaseConfig={
  apiKey:"",
  authDomain:"",
  databaseURL:"",
  projectId:"",
  storageBucket:"",
  messagingSenderId:"",
  appId:""
};
// ID del canal: debe ser el MISMO que en database.rules.json. Ya viene generado al azar.
export const CH="ch_bb80061fabfd1369ebebb03eb13e";
export const missing=["apiKey","databaseURL","projectId","appId"].filter(k=>!String(firebaseConfig[k]||"").trim());
export const db=missing.length?null:getDatabase(initializeApp(firebaseConfig));
export const path=p=>`channels/${CH}/${p}`;
export {ref,onValue,set,update,remove};
