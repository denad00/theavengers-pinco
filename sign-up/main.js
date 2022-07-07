
const db = firebase.firestore();

const signUp = document.getElementById('signUp');
const error = document.getElementById('errorMessage');
const userFirebase = db.collection("user");
const statusFirebase = db.collection("userStatus");

const user = [];
const userStatus = [];

signUp.addEventListener ("click", () => {
  if (password.value !== confirmPassword.value){
    error.innerHTML = "Passwords do not match, please try again";

  } else {
    
    const user = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      userID: Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
      emergencyContactID: "",
      
    }

    const userStatus = {
      email: user.email,
      userID: user.userID,
      time: new Date(),
      longitutde: "",
      latitude: "",
      sosEvent: false,
      tokenID: "",
    }

    console.log(user);
    console.log(userStatus);
    const outcome = userFirebase.add(user);
    const outcome2 = statusFirebase.add(userStatus);

    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
       }
      });

    setTimeout(function(){
      location.href = "homepage.html";
      }, 2000); 
  }
});

