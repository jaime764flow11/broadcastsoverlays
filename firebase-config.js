import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getDatabase,ref,onValue,set,update,remove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// Pega aquí los valores que te da la consola de Firebase (Configuración del proyecto > Tus apps > SDK).
export const firebaseConfig={
  apiKey:"AIzaSyAv0ZvDPxO9CJQwWRUj-yr-boxUANLzKk8",
  authDomain:"overlaysbroadcast.firebaseapp.com",
  databaseURL:"https://overlaysbroadcast-default-rtdb.europe-west1.firebasedatabase.app/", // <-- PEGA AQUÍ la URL de Realtime Database (empieza por https://overlaysbroadcast-default-rtdb...)
  projectId:"overlaysbroadcast",
  storageBucket:"overlaysbroadcast.firebasestorage.app",
  messagingSenderId:"499040630007",
  appId:"1:499040630007:web:0fa689d69da2bcf9388ff2"
};
// ID del canal: debe ser el MISMO que en database.rules.json. Ya viene generado al azar.
export const CH="ch_bb80061fabfd1369ebebb03eb13e";
export const missing=["apiKey","databaseURL","projectId","appId"].filter(k=>!String(firebaseConfig[k]||"").trim());
export const db=missing.length?null:getDatabase(initializeApp(firebaseConfig));
export const path=p=>`channels/${CH}/${p}`;
export {ref,onValue,set,update,remove};
