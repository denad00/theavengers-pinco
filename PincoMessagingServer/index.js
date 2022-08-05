const express = require('express');

const { initializeApp: initializeAdminApp, applicationDefault } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, onSnapshot } = require("firebase/firestore");

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/runner/PincoMessagingServer/langara-wmdd4885-avengers-firebase-adminsdk-i2orb-6075dc7678.json';

initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: "https://langara-wmdd4885-avengers-default-rtdb.firebaseio.com"
});

const firebaseConfig = {
  apiKey: "AIzaSyBVj4R-W5RBtynjYHMZG1IkW35EjDueroo",
  authDomain: "pinco-f76a9.firebaseapp.com",
  projectId: "pinco-f76a9",
  storageBucket: "pinco-f76a9.appspot.com",
  messagingSenderId: "1051696252552",
  appId: "1:1051696252552:web:ab875fc585a1ba5086813d",
  measurementId: "G-MX3M605MJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const q = query(collection(db, "userStatus"), where("sosEvent", "==", true));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const sosUsers = [];
  querySnapshot.forEach((doc) => {
      sosUsers.push(doc.data());
      // console.log(doc.data());
  });
  sendCloudMessageToObservers(sosUsers);
});


function sendCloudMessageToObservers (sosUsers) {
    sosUsers.forEach((user) => {
        if (user.observerTokens && user.observerTokens.length) {
            const message = {
              // TODO: send userID in data object
                data: {text: "Your friend is in danger! Check this out"},
                tokens: user.observerTokens,
            };
            getMessaging().sendMulticast(message)
              .then((response) => {
                console.log(response.successCount + ' messages were sent successfully');
            });
        }
    })
}
// Create a list containing up to 500 registration tokens.
// These registration tokens come from the client FCM SDKs.
// const registrationTokens = [
// ];




// replit requires something to be served to '/' to keep alive
const expressApp = express();

expressApp.get('/', (req, res) => {
  res.send('Hello Express app!')
});

expressApp.listen(3000, () => {
  console.log('server started');
});
