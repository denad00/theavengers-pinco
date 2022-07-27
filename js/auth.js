(function() {
  const firebaseApp = firebase.initializeApp({ 
    apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
    authDomain: "langara-wmdd4885-avengers.firebaseapp.com",
    databaseURL: "https://langara-wmdd4885-avengers-default-rtdb.firebaseio.com",
    projectId: "langara-wmdd4885-avengers",
    storageBucket: "langara-wmdd4885-avengers.appspot.com",
    messagingSenderId: "1078303270426",
    appId: "1:1078303270426:web:d7a2c3b43fd70e113053a3",
    measurementId: "G-F4KJKNQE5T"
  });

  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();

  
  const register = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password).then((res) => {
      console.log(res);
    }).catch((error) => {
      console.log(error.message);
    });
  };

  const login = () => {
    if (firebaseApp.auth().currentUser) {
      firebaseApp.auth().signOut();
    } else {
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;

      auth.signInWithEmailAndPassword(email, password).then((res) => {
        console.log(firebaseApp.auth().currentUser)
        localStorage.setItem('user',res.user)
        //window.location.replace('index.html');
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });    
    }
  }

  const initializeApp = () => {
    firebaseApp.auth().onAuthStateChanged(function(user) {
      console.log(user)
      if (user) {
        //window.location.replace('index.html');
      }
      else{

      }
    })

    const signInFormButton = document.getElementById('signin');

    if(signInFormButton) {
      signInFormButton.addEventListener('click', login);
    }

    if(document.getElementById('signup')) {
      document.getElementById('signup').addEventListener('click', register, false);
    }

};

  window.onload = function() {
    initializeApp();
  };

})()

