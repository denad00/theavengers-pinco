
const sosEvent = document.getElementById('sosButton');
let userStatus = db.collection("userStatus");
let userStatusRef = null
console.log(db.collection('userStatus'));




sosEvent.addEventListener ("click", function(event) {
    userStatus.where("userID", "==", "ictestnotif01").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            userStatusRef = userStatus.doc(doc.id);
            console.log(doc.data());
            console.log (userStatusRef);
        //   console.log(`${doc.id} => ${doc.data()}`);
        })
        userStatusRef.update(
            // "sosEvent", "==", "true"
            { sosEvent: true }
            ).then(() => {
            console.log("sosEvent updated");
            }).catch((error) => {
            console.log("Error updating document");
            });
      })


    });
    //   new Notification('Danika has indicated she is in danger, please reach out to her');