
const db = firebase.firestore();

const user = [];

signUp.addEventListener ("click", () => {
  const user = {
    name: fullName.value,
    phone: phone.value,
    email: email.value,
    emergencyContact: "",
    userID: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
    
  }
  console.log(user);
  const outcome = db.collection("user").add(user);
  
 Notification.requestPermission().then((result) => {
 if (result === 'granted') {
     randomNotification();
  }
 }
});
