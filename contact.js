
// init database
const contactCollection = db.collection("contact")

const allFlows = document.querySelectorAll('div.contactFlow')
const otherContactsOutput = document.getElementById("otherContactsOutput");
const emergencyContactsOutput = document.getElementById("emergencyContactsOutput");
console.log(allFlows)
allFlows[0].style.display = 'block';
allFlows[1].style.display = 'none';
if (allFlows[0].style.display = 'block') {
  updateContactsListHTML("iristest0001");
}  //show current contact list

const createBtn = document.getElementById("createBtn");
createBtn.addEventListener ("click", navigationFlow);

function navigationFlow(event){
  allFlows[0].style.display = 'none';
  allFlows[1].style.display = 'block';
}

// get boolean data of "emergency contact"
const cb = document.querySelector('#emergencyAccept');
// console.log(cb.checked);

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
  console.log(contact);
    //get user id by firebase doc and add contact into firebase collection-contact by calling function getUserContactsList
  const outcome = contactCollection.add(contact)
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    updateContactsListHTML("iristest0001");
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
allFlows[0].style.display = 'block';
allFlows[1].style.display = 'none';
  
});

//define function to generate contact list by firestore library method
// userId: string, nextAction: function
function getUserContactsList (userId, isEmergency, nextAction) { 
    let contactsOfUser = [];
    const q = contactCollection.where("userID", "==", userId).where("emergencyContact", "==", isEmergency).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(doc.data());
                // console.log(doc.id);
                let contactObj = doc.data();
                contactObj["docID"] = doc.id
                contactsOfUser.push(contactObj); //.data is a firestore method to get query object data 
            });

            nextAction(contactsOfUser, isEmergency);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}


//define function to print out List of contact into html
// contactsList: array
function generateContactsListHTML (contactsList, isEmergency) {
  let contactListOutputElement = null;
  if (isEmergency) {
    contactListOutputElement = document.getElementById("emergencyContactsOutput");
  } else {
    contactListOutputElement = document.getElementById("otherContactsOutput");
  }
  contactListOutputElement.innerHTML = "";
  console.log("[contact.js updateContactsListHTML] listLength: " + contactsList.length);
  for (let i = 0; i < contactsList.length; i++) {
    
    let text = ""
    text += contactsList[i].name
    text += "\n"
    text += contactsList[i].phone
    let line = document.createElement('li');
    line.innerText += text
    contactListOutputElement.appendChild(line);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    line.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', (event) => {
      console.log('delete index: ' + i + "\ncontactList[i]: " + contactsList[i].docID);
      contactCollection.doc(contactsList[i].docID).delete().then(() => {    
        updateContactsListHTML(contactsList[i].userID);
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
      
		});
    // otherContactsOutput.innerHTML += text
 }
}

function updateContactsListHTML (userID) {
  getUserContactsList(userID, false, generateContactsListHTML);
  getUserContactsList(userID, true, generateContactsListHTML);
}
