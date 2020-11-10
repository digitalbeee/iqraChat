import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAs1ElGXlwml7OO8rGmJxgxskuePXFpJVI",
    authDomain: "telegram-clone-4b377.firebaseapp.com",
    databaseURL: "https://telegram-clone-4b377.firebaseio.com",
    projectId: "telegram-clone-4b377",
    storageBucket: "telegram-clone-4b377.appspot.com",
    messagingSenderId: "128000503441",
    appId: "1:128000503441:web:57608aa28dc182b7165930"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {auth, provider};
  export default db;