// import { initializeApp } from "firebase/app";

// export const initializeFirebase = () => {
//  firebaseConfig.initializeApp = {
//     apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
//     authDomain: "langara-wmdd4885-avengers.firebaseapp.com",
//     databaseURL: "https://langara-wmdd4885-avengers-default-rtdb.firebaseio.com",
//     projectId: "langara-wmdd4885-avengers",
//     storageBucket: "langara-wmdd4885-avengers.appspot.com",
//     messagingSenderId: "1078303270426",
//     appId: "1:1078303270426:web:d7a2c3b43fd70e113053a3",
//     measurementId: "G-F4KJKNQE5T"
//   };
// }

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//       navigator.serviceWorker.register('/service-worker.js');
//     });
//   }


// signUp.addEventListener ('click', () => {
//     Notification.requestPermission().then((result) => {
//       if (result === 'granted') {
//         randomNotification();
//       }
//     });
//   })

//   function randomNotification() {
//     sosButton.addEventListener ('click', () => {
//         alert('help');
//     });
//     };




// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';
// import firebase from 'firebase';
// import { initializeFirebase } from './push-notification';
// ReactDOM.render(<App />, document.getElementById('root'));
// initializeFirebase();

const button = document.getElementById('notifications');
signUp.addEventListener('click', () => {
  Notification.requestPermission().then((result) => {
    if (result === 'granted') {
        randomNotification();
    }
  });
})


function randomNotification (){
    sosButton.addEventListener ('click', () =>{
        new Notification('Danika has indicated she is in danger, please reach out to her');
    })
}

