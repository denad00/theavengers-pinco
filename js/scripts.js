
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// LISTEN FOR AUTH STATUS CHANGES ========
auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user logged in: ', user);
    console.log('user id: ' + auth.currentUser.uid);
  } else {
      console.log('user is logged out');
  }
})


signUpBtn.addEventListener('click', () => {
  // get registration information
  const email = signupForm['email'].value;
  const password = signupForm['password'].value;
  const confirmPassword = signupForm['confirmPassword'].value
  const error = document.getElementById('errorMessage');
  console.log(email, password, confirmPassword);

 if (password !== confirmPassword) {
  error.innerHTML = "Passwords do not match, please try again";
  signupForm.reset();

 } else if (password.length < 6) {
  error.innerHTML = "Passwords must be at least six characters"
  signupForm.reset();

 } else {

  // create new user
  auth.createUserWithEmailAndPassword(email, password).then(res => {
    signupForm.reset();
  });

  // save user data
  const userName = document.getElementById('fullName').value
  const userEmail = document.getElementById('email').value;
  const userPassword = document.getElementById('password').value;
  const userPhone = document.getElementById('phone').value;

  const saveUser = {
    name: userName,
    phone: userPhone,
    email: userEmail,
    password: userPassword,
    userID: auth.currentUser.uid,
    emergencyContactID: "",
    
  }

  const userStatus = {
    email: userEmail,
    userID: auth.currentUser.uid,
    time: new Date(),
    longitutde: "",
    latitude: "",
    sosEvent: false,
    tokenID: "",
  }

  console.log(saveUser);
  console.log(userStatus);
  const outcome = db.collection("user").add(saveUser);
  const outcome2 = db.collection("userStatus").add(userStatus);

  };

  setTimeout(function(){
    location.href = "index.html";
    }, 2000); 
  
   Notification.requestPermission().then((result) => {
      if (result === 'granted') {
       }
      });
 });

  // LOGOUT USER ======================
  // const logout = document.getElementById('logout');

  // logout.addEventListener('click', () => {
  //   auth.signOut();
  //   setTimeout(function(){
  //     location.href = "signin.html";
  //   }, 2000); 
      
  //   });

// LOGIN USER ======================
  // const signinForm = document.querySelector('#signin-form');
  // const signinBtn = document.getElementById('signin');

  // signinBtn.addEventListener('click', () => {
  //   if (auth.currentUser) {
  //     auth.signOut();
  //   } else {
  //     const email = signinForm['signin-email'].value;
  //     const password = signinForm['signin-password'].value;
  //     console.log(email, password);

  //     auth.signInWithEmailAndPassword(email, password).then(res => {
  //     console.log(res.user);
  //     setTimeout(function(){
  //       location.href = "index.html";
  //       }, 2000); 
  //   })
  // }});




  