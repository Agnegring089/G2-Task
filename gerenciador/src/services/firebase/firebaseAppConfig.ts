import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseAppConfig = {
    apiKey: "AIzaSyBiHOi66f_lPMsIc85fLoQ9OGfxnF0-yOk",
    authDomain: "gerenciador-9958e.firebaseapp.com",
    databaseURL: "https://gerenciador-9958e-default-rtdb.firebaseio.com",
    projectId: "gerenciador-9958e",
    storageBucket: "gerenciador-9958e.appspot.com",
    messagingSenderId: "102521239733",
    appId: "1:102521239733:web:a26db4cc144ac2f576a6fc",
    measurementId: "G-ZJVKNBZMPN"
};

const app = initializeApp(firebaseAppConfig);
const db = getDatabase(app);
export { db, app };