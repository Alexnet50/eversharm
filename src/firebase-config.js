import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB_vrFaBi6xp3_Kv_9CKD6AyfzlKOrFF3g",  
    authDomain: "sharm-base.firebaseapp.com",  
    projectId: "sharm-base",  
    storageBucket: "sharm-base.appspot.com",  
    messagingSenderId: "1085814914671",  
    appId: "1:1085814914671:web:85ae52bbc6cedc95c9d79a"  
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);


  