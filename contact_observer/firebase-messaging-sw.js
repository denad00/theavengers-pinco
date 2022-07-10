// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup


 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.

// default sw initialization in firebase-messaging doesn't provide module importing
importScripts('https://www.gstatic.com/firebasejs/9.8.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging-compat.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object


 firebase.initializeApp({
    apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
    authDomain: "langara-wmdd4885-avengers.firebaseapp.com",
    databaseURL: "https://langara-wmdd4885-avengers-default-rtdb.firebaseio.com",
    projectId: "langara-wmdd4885-avengers",
    storageBucket: "langara-wmdd4885-avengers.appspot.com",
    messagingSenderId: "1078303270426",
    appId: "1:1078303270426:web:d7a2c3b43fd70e113053a3",
    measurementId: "G-F4KJKNQE5T"
 });


 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
console.log(self.registration);
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
