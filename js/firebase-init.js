// js/firebase-init.js
const firebaseConfig = {
    apiKey:            "AIzaSyCeK5b2j4Ykzm6MqMR14fUKT726ckOR0wg",
    authDomain:        "kubo-e2c2d.firebaseapp.com",
    projectId:         "kubo-e2c2d",
    storageBucket:     "kubo-e2c2d.firebasestorage.app",
    messagingSenderId: "337746830157",
    appId:             "1:337746830157:web:67fce2fe11c2ce2464cd04",
    databaseURL:       "https://kubo-e2c2d-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
