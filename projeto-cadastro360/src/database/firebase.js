
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCGy77uUS4ENb_Rj3gjCmoEG7bhCRjchOw",
  authDomain: "projeto-cadastro360.firebaseapp.com",
  projectId: "projeto-cadastro360",
  storageBucket: "projeto-cadastro360.firebasestorage.app",
  messagingSenderId: "716154513413",
  appId: "1:716154513413:web:8ae3057566ff70fcb2546c",
  measurementId: "G-72ZPNKVP66"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics, database };
