

const sosEvent = document.getElementById('sosButton');
let userStatus = db.collection("userStatus");
var userStatusRef = null
console.log(db.collection('userStatus'));

const sosUserJson = localStorage.getItem('user');
const sosUserObj = JSON.parse(sosUserJson);
const sosUserId = sosUserObj.uid;


sosEvent.addEventListener ("click", function(event) {
    userStatus.where("userID", "==", sosUserId).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            userStatusRef = userStatus.doc(doc.id);
            console.log(doc.data());
            console.log (userStatusRef);
        })
        userStatusRef.update(
            { sosEvent: true }
            ).then(() => {
            console.log("sosEvent updated");
            setTimeout(userStatusRef.update(
                { sosEvent: false }
                ), 1000).then(()=> {console.log("sosEvent revert to false")})
            }).catch((error) => {
            console.log("Error updating document");
            });
      })

   
    
    alert("SOS message has been sent to your emergency contacts!")
    });
  
