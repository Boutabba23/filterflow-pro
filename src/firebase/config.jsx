import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvYJz0Z5q6W7X8Y9Z0X5Y6Z7X8Y9Z0X5Y",
  authDomain: "filterflow-pro.firebaseapp.com",
  projectId: "filterflow-pro",
  storageBucket: "filterflow-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
