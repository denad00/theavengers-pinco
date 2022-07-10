import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-analytics.js'

// Add Firebase products that you want to use
import { getMessaging , getToken, onMessage, deleteToken } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging.js'

import { getFirestore, doc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js';

    const firebaseConfig = {
        apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
        authDomain: "langara-wmdd4885-avengers.firebaseapp.com",
        databaseURL: "https://langara-wmdd4885-avengers-default-rtdb.firebaseio.com",
        projectId: "langara-wmdd4885-avengers",
        storageBucket: "langara-wmdd4885-avengers.appspot.com",
        messagingSenderId: "1078303270426",
        appId: "1:1078303270426:web:d7a2c3b43fd70e113053a3",
        measurementId: "G-F4KJKNQE5T"
    };
  // Retrieve Firebase init objects.
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const messaging = getMessaging(app);
  const db = getFirestore(app);

  // IDs of divs that display registration token UI or request permission UI.
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';


  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  const userId = queryParams.get("userId");
  console.log(`userId: ${userId}`);
  let userStatusDocId = null;
  // Retrieve userStatus document in Firestore with queryParams in URL
  const queryUserStatus = query(collection(db, "userStatus"), where("userID", "==", userId));
  const querySnapshot = await getDocs(queryUserStatus);
    querySnapshot.forEach((docRef) => {
    // doc.data() is never undefined for query doc snapshots
        console.log(docRef.id, " => ", docRef.data());
        userStatusDocId = docRef.id;
    });
  console.log(userStatusDocId);
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.onBackgroundMessage` handler.
  onMessage((payload) => {
    console.log('Message received. ', payload);
    // Update the UI to include the received message.
    appendMessage(payload);
  });

  function resetUI() {
    clearMessages();
    showToken('loading...');
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    getToken(messaging, {vapidKey: 'BHVN1l6afas-f6G-9UYH6-_ozo7UL9uXDEek2smA0yxRvB8WIADVK_G6KFfzPpomFsmC823q4PpF_-THvMZr5Qo'}).then((currentToken) => {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No registration token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving registration token. ', err);
      setTokenSentToServer(false);
    });
  }


  function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
  }

  // Send the registration token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
    const userStatusDocRef = doc(db, "userStatus", userStatusDocId);
    updateDoc(userStatusDocRef, {
        observerTokens: arrayUnion(currentToken)
      }).then(function() {
        setTokenSentToServer(true);
      });
      
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }

  function setTokenSentToServer(sent) {
    if (sent) {
      console.log('Token sent to server');
    }
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    
  }

  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = 'display: visible';
    } else {
      div.style = 'display: none';
    }
  }

  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve a registration token for use with FCM.
        // In many cases once an app has been granted notification permission,
        // it should update its UI reflecting this.
        resetUI();
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }

  function deleteTokenCustomScoped() {
    // Delete registration token.
    getToken(messaging, {vapidKey: 'BHVN1l6afas-f6G-9UYH6-_ozo7UL9uXDEek2smA0yxRvB8WIADVK_G6KFfzPpomFsmC823q4PpF_-THvMZr5Qo'}).then((currentToken) => {
      deleteToken(messaging).then(() => {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // Once token is deleted update UI.
        resetUI();
      }).catch((err) => {
        console.log('Unable to delete token. ', err);
      });
    }).catch((err) => {
      console.log('Error retrieving registration token. ', err);
      showToken('Error retrieving registration token. ', err);
    });
  }

  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderElement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;';
    dataHeaderElement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
  }

  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }

  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }

  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }

  resetUI();
  const deltokenbtn = document.getElementById('deltoken');
  deltokenbtn.addEventListener('click', function () {
      deleteTokenCustomScoped();
  })
