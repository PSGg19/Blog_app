
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "myblog-1349b.firebaseapp.com",
  projectId: "myblog-1349b",
  storageBucket: "myblog-1349b.appspot.com",
  messagingSenderId: "771176492443",
  appId: "1:771176492443:web:7aa477c39bc5c06544053e",
  measurementId: "G-GD66G1WK6S"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


