
const db = firebase.firestore();

// class User {
//     constructor (name, phone, email) {
//        this.fullName = name;
//        this.phone = phone;
//        this.email = email;
//      }
// }

// let userArray = [];


// signUp.addEventListener ("click", () => {
//     let user = new User (fullName.value, phone.value, email.value)
//     userArray.push(user);
//     console.log(userArray)
//     const outcome = db.collection("user").add(user)
// })

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
