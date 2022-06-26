
const db = firebase.firestore();

const user = [];

document.getElementById('signUp').addEventListener ("click", () => {

  if (password.value !== confirmPassword.value){
    document.getElementById('errorMessage').innerHTML = "Passwords do not match, please try again";

  } else {
    
    const user = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      userID: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
      
    }

    console.log(user);
    const outcome = db.collection("user").add(user);

    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
          randomNotification();
       }
      });
  }
});
