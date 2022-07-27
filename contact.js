
// init database
const contactCollection = db.collection("contact")

const allFlows = document.querySelectorAll('div.contactFlow')
allFlows[0].style.display = 'block';
allFlows[1].style.display = 'none';
if (allFlows[0].style.display = 'block') {
  getUserContactsList("iristest0001", updateContactsListHTML);
  getUserEmergencyContactsList("iristest0001", updateEmergencyContactsListHTML);
}  //show current contact list

const createBtn = document.getElementById("createBtn");
createBtn.addEventListener ("click", navigationFlow);

function navigationFlow(event){
  allFlows[0].style.display = 'none';
  allFlows[1].style.display = 'block';
}

// get boolean data of "emergency contact"
const cb = document.querySelector('#emergencyAccept');

// define submit function
contactSubmit.addEventListener ("click", function(event) {
  event.preventDefault();
  const contact = {
    name: contactName.value, //from html id
    phone: contactPhone.value, //from html id
    emergencyContact: cb.checked, //from html checkbox
    userID: "iristest0001",  // get userID after log in, this is just a text id
    contactID: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))  //generate contact id
  }
    //get user id by firebase doc and add contact into firebase collection-contact by calling function getUserContactsList
  const outcome = contactCollection.add(contact)
.then((docRef) => {
    getUserContactsList("iristest0001", updateContactsListHTML);
    getUserEmergencyContactsList("iristest0001", updateEmergencyContactsListHTML);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
allFlows[0].style.display = 'block';
allFlows[1].style.display = 'none';
  
});

//define function to generate contact list by firestore library method
// userId: string, nextAction: function
function getUserContactsList (userId, nextAction) { 
    let contactsOfUser = [];
    const q = contactCollection.where("userID", "==", userId).where("emergencyContact", "==", false).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                contactsOfUser.push(doc.data()); //.data is a firestore method to get query object data 
            });

            nextAction(contactsOfUser);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function getUserEmergencyContactsList (userId, nextAction) { 
    let contactsOfUser = [];
    const q = contactCollection.where("userID", "==", userId).where("emergencyContact", "==", true).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                contactsOfUser.push(doc.data()); //.data is a firestore method to get query object data 
            });

            nextAction(contactsOfUser);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}


//define function to print out List of contact into html
// contactsList: array
function updateContactsListHTML (contactsList) {
  for (let i = 0; i < contactsList.length; i++) {
    let text = ""
    text += contactsList[i].name
    text += contactsList[i].phone
  otherContactsOutput.innerHTML += text
 }
}

function updateEmergencyContactsListHTML (contactsList) {
  for (let i = 0; i < contactsList.length; i++) {
    let text = ""
    text += contactsList[i].name
    text += contactsList[i].phone
  emergencyContactsOutput.innerHTML += text
 }
}



