// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyB27xewA-2jTFHwRGKXVd6O3f8t1CqyKSE",
  authDomain: "well-done-59624.firebaseapp.com",
  projectId: "well-done-59624",
  storageBucket: "well-done-59624.appspot.com",
  messagingSenderId: "826280241911",
  appId: "1:826280241911:web:91e7e26bdc1224f67841f2",
  measurementId: "G-87R9H6EHGF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });