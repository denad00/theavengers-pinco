
// init database
const contactCollection = db.collection("contact");

const contactPageUserJson = localStorage.getItem('user');
const contactPageUserObj = JSON.parse(contactPageUserJson);
const contactPageUserId = contactPageUserObj.uid;

const allFlows = document.querySelectorAll('div.contactFlow')
const otherContactsOutput = document.getElementById("otherContactsOutput");
const emergencyContactsOutput = document.getElementById("emergencyContactsOutput");
console.log(allFlows)
allFlows[0].style.display = 'block';
allFlows[1].style.display = 'none';
if (allFlows[0].style.display = 'block') {
  updateContactsListHTML(contactPageUserId);
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
    userID: contactPageUserId,  // get userID after log in, this is just a text id
    contactID: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))  //generate contact id
  }
    //get user id by firebase doc and add contact into firebase collection-contact by calling function getUserContactsList
  const outcome = contactCollection.add(contact)
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    updateContactsListHTML(contactPageUserId);
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
    text += " - "
    text += contactsList[i].phone
    let line = document.createElement('li');
    line.innerHTML += `<div> ${text} </div>`
    contactListOutputElement.appendChild(line);
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "<svg class='trash'id='Camada_2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30.67 47.65'><g id='NEW_ICONS'><g id='draft_trash'><g id='trash'><path d='M24.2,21.88c1.65,0,3,1.35,3,3v16.3c0,1.65-1.35,3-3,3H6.47c-1.65,0-3-1.35-3-3V24.88c0-1.65,1.35-3,3-3H24.2m0-3.47H6.47c-3.57,0-6.47,2.9-6.47,6.47v16.3c0,3.57,2.9,6.47,6.47,6.47H24.2c3.57,0,6.47-2.9,6.47-6.47V24.88c0-3.57-2.9-6.47-6.47-6.47h0Z'/><path d='M24.68,12.81c1.38,0,2.52,1.13,2.52,2.52s-1.13,2.52-2.52,2.52H5.99c-1.38,0-2.52-1.13-2.52-2.52s1.13-2.52,2.52-2.52H24.68m0-3.47H5.99c-3.3,0-5.99,2.69-5.99,5.99s2.69,5.99,5.99,5.99H24.68c3.3,0,5.99-2.69,5.99-5.99s-2.69-5.99-5.99-5.99h0Z'/><g><path d='M10.09,39.86c-.4,0-.72-.32-.72-.72v-12.22c0-.4,.32-.72,.72-.72s.72,.32,.72,.72v12.22c0,.4-.32,.72-.72,.72Z'/><path d='M10.09,41.6c-1.35,0-2.45-1.1-2.45-2.45v-12.22c0-1.35,1.1-2.45,2.45-2.45s2.46,1.1,2.46,2.45v12.22c0,1.35-1.1,2.45-2.46,2.45Z'/></g><g><path d='M20.58,39.86c-.4,0-.72-.32-.72-.72v-12.22c0-.4,.32-.72,.72-.72s.72,.32,.72,.72v12.22c0,.4-.32,.72-.72,.72Z'/><path d='M20.58,41.6c-1.35,0-2.46-1.1-2.46-2.45v-12.22c0-1.35,1.1-2.45,2.46-2.45s2.45,1.1,2.45,2.45v12.22c0,1.35-1.1,2.45-2.45,2.45Z'/></g></g><path d='M15.34,3.47c2.25,0,4.13,1.55,4.63,3.64H10.7c.51-2.09,2.39-3.64,4.63-3.64m0-3.47c-3.81,0-7.11,2.59-8.01,6.3l-1.04,4.29H24.38l-1.04-4.29c-.9-3.71-4.19-6.3-8.01-6.3h0Z'/></g></g></svg>";
    line.appendChild(deleteBtn);

    contactListOutputElement.appendChild(line);
    const starBtn = document.createElement("button");
    starBtn.innerHTML = "<svg class='star' id='Camada_2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 43.76 42'><g id='NEW_ICONS'><g id='star-holow'><path d='M10.8,42c-.82,0-1.63-.26-2.32-.76-1.23-.89-1.83-2.37-1.57-3.87l1.76-10.28L1.2,19.81C.11,18.75-.27,17.19,.2,15.75c.47-1.44,1.69-2.47,3.19-2.69l10.33-1.5L18.33,2.2c.67-1.36,2.03-2.2,3.55-2.2s2.88,.84,3.55,2.2h0l4.62,9.36,10.33,1.5c1.5,.22,2.72,1.25,3.19,2.69,.47,1.44,.08,3-1,4.05l-7.47,7.28,1.76,10.28c.26,1.5-.35,2.98-1.57,3.87-1.23,.89-2.83,1-4.16,.3l-9.24-4.86-9.24,4.86c-.58,.31-1.22,.46-1.84,.46ZM21.83,3.97l-5,10.31c-.29,.59-.85,1-1.51,1.09l-11.37,1.65,8.25,7.94c.47,.46,.69,1.12,.58,1.77l-1.94,11.32,10.1-5.39c.58-.31,1.28-.31,1.86,0l10.17,5.34-2.01-11.27c-.11-.65,.1-1.31,.58-1.77l8.23-8.02-11.34-1.57c-.65-.09-1.21-.5-1.51-1.09L21.83,3.97Z'/></g></g></svg>";
    line.prepend(starBtn);

    deleteBtn.addEventListener('click', (event) => {
      // console.log('delete index: ' + i + "\ncontactList[i]: " + contactsList[i].docID);
      contactCollection.doc(contactsList[i].docID).delete().then(() => {    
        updateContactsListHTML(contactsList[i].userID);
        console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
      });
		});

    starBtn.addEventListener('click', (event) => {
      console.log({ emergencyContact: !contactsList[i].emergencyContact });
      contactCollection.doc(contactsList[i].docID).update({ emergencyContact: !contactsList[i].emergencyContact }).then(() => {    
        updateContactsListHTML(contactsList[i].userID);
        console.log("Emergency contacts update successfully!");
       }).catch((error) => {
        console.error("Error updating emergency contacts: ", error);
    });

    
      
		});

   
    // otherContactsOutput.innerHTML += text
 }
}

function changeEmergencyContactList() {

  const q = contactCollection.where("emergencyContact", "==", false).get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.data());
          // console.log(doc.id);
          let emergencyStatus = emergencyContact;
          // emergencyStatus = true;
          console.log(emergencyStatus);
      });
  // let emergencyContact = 'emergencyContact';
  // if (emergencyContact)
  // emergencyContact = false;
  // else {
  //   emergencyContact = true
  })
    
}

function updateContactsListHTML (userID) {
  getUserContactsList(userID, false, generateContactsListHTML);
  getUserContactsList(userID, true, generateContactsListHTML);
}
