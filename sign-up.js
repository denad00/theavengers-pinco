
const db = firebase.firestore();

const user = [];

signUp.addEventListener ("click", () => {
  const user = {
    name: fullName.value,
    phone: phone.value,
    email: email.value,
    emergencyContact: "",
    
  }
  console.log(user);
  const outcome = db.collection("user").add(user)
})
