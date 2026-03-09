import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3uhshLtIuQ71ck2OorMOJpub7wRI7UoA",
  authDomain: "zuhoor-website.firebaseapp.com",
  projectId: "zuhoor-website",
  storageBucket: "zuhoor-website.firebasestorage.app",
  messagingSenderId: "869277567851",
  appId: "1:869277567851:web:f97571dbc2cf73ba845a2e",
  measurementId: "G-D0WJZPYEJV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);