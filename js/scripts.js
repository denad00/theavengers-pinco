(function () {

  const firebaseApp = firebase.initializeApp({ 
    apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
    projectId: "langara-wmdd4885-avengers"
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
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password).then((res) => {
        window.location.replace('index.html');
        console.log(res);
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });    
    }
  }

  const saveUser = () => {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    db.collection('user').add({
      email: email,
      password: password
    })
    .then((docRef) => {
      console.log("Document ID", docRef.id)
    }).catch((error) => {
      console.error("Error",error);
    })
   
  };

  const readData = () => {
    db.collection('users').get().then((data) => {
      console.log(data.docs.map((item) => {
        return {...item.data(), id: item.id };
      }));
    })
  }

  const initializeApp = () => {
    firebaseApp.auth().onAuthStateChanged(function(user) {
      if (user) {

      }
      else{
        
      }
    document.getElementById('sign-in').addEventListener('click', login, false);
    //document.getElementById('sign-up').addEventListener('click', register, false);
  })};

  window.onload = function() {
    initializeApp();
  };

  
})();


