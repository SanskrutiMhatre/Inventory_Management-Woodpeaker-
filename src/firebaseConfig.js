import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfvWrOS1iLpG7mgSnkNJGhxB4XhZV-HY8",
  authDomain: "registration-e58be.firebaseapp.com",
  databaseURL: "https://registration-e58be-default-rtdb.firebaseio.com",
  projectId: "registration-e58be",
  storageBucket: "registration-e58be.appspot.com",
  messagingSenderId: "641780202964",
  appId: "1:641780202964:web:29d004087991719fd8aa41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc, getDoc };
