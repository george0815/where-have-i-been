import { initializeApp } from "firebase/app";
import {getFirestore, collection} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBucVjsiWZ-XqGr7oXPCIakgsIN55xysoA",
  authDomain: "where-have-i-been-54fff.firebaseapp.com",
  projectId: "where-have-i-been-54fff",
  storageBucket: "where-have-i-been-54fff.appspot.com",
  messagingSenderId: "176207050017",
  appId: "1:176207050017:web:605d90da0da4dd25237a60"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const dataCollection = collection(db, "data");