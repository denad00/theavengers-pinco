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

  
  const register =  (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value
    const error = document.getElementById('errorMessage');
  
    if (password !== confirmPassword) {
      error.innerHTML = "Passwords do not match, please try again";
      signupForm.reset();
    
    } else if (password.length < 6) {
      error.innerHTML = "Passwords must be at least six characters"
      signupForm.reset();
    
    } else {

      auth.createUserWithEmailAndPassword(email, password).then(res => {
        let user = auth.currentUser;
        if(user != null) {
          uid = user.uid;
        }
        const userName = document.getElementById('fullName').value
        const userPhone = document.getElementById('phone').value;
        const saveUser = {
          name: userName,
          phone: userPhone,
          email: email,
          password: password,
          userID: uid,
          emergencyContactID: "",
        }

        const userStatus = {
          email: email,
          userID: uid,
          time: new Date(),
          longitutde: "",
          latitude: "",
          sosEvent: false,
          tokenID: "",
        } 

        db.collection("user").add(saveUser)
        db.collection("userStatus").add(userStatus)
        swal('Your Account Created','Your account was created successfully, you can log in now.',
        ).then((value) => {
            setTimeout(function(){
                window.location.replace("../index.html");
            }, 1000)
        });
      });
    };
  }

  const login = (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      auth.signOut();
    } else {
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      const errorBox = document.getElementById("error")
      auth.signInWithEmailAndPassword(email, password).then((res) => {
        if(errorBox)
        error.style.display = "none";
        localStorage.setItem('user',JSON.stringify(res.user));
        window.location.replace('index.html');
      }).catch((error) => {

        errorBox.style.display = "block";
        errorBox.innerText = 'Invalid Email/Password';
        errorBox.style.padding = '1.5%';
      });    
    }
  }

  const validatePassword = (e) => {
    let confirmPassword = e.target.value
    let password = document.getElementById('password').value
    const errorPasswordBox = document.getElementById("errorPassword")
    const signUpButton = document.getElementById('signUp')

    if(confirmPassword != password) {
      errorPasswordBox.style.display = "block";
      errorPasswordBox.innerText = 'Password do not match';
      errorPasswordBox.style.padding = '1.5%';
      signUpButton.disabled = true;
    }
    else {
      errorPasswordBox.style.display = "none";
      signUpButton.disabled = false;
    }
  }

  const initializeApp = () => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
         window.location.replace('index.html');
      }
    })

    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    const confirmPassword = document.getElementById('confirmPassword');

    if(signInForm) {
      signInForm.addEventListener('submit', login, false);
    }

    if(signUpForm) {
      signUpForm.addEventListener('submit', register, false);
    }

    if(confirmPassword) {
      confirmPassword.addEventListener('keyup', validatePassword, false)
    }

};

  window.onload = function() {
    initializeApp();
  };

})()

