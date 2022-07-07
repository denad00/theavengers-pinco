
const db = firebase.firestore();
const sosEvent = document.getElementById('sosButton');
let userStatus = db.collection("userStatus");


sosEvent.addEventListener ('click', () => {
  userStatus.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    })
  }
  // new Notification('Danika has indicated she is in danger, please reach out to her');
  // db.collection('userStatus').doc(userStatus.uid).update({
  //   "sosEvent": true
  // })
  // console.log(db.collection('userStatus'));
  // console.log ('hello');
})