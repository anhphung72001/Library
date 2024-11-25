import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwyNaWkJdo19-fZyt5bwlkr9E_ltVSHxM",
  authDomain: "controlling-esp32.firebaseapp.com",
  databaseURL: "https://controlling-esp32-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "controlling-esp32",
  storageBucket: "controlling-esp32.appspot.com",
  messagingSenderId: "484291112924",
  appId: "1:484291112924:web:250df3210e765359aa2919",
  measurementId: "G-KY61KY6MR3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app); 

export { database, storage };
