//  ====== subtasks ======
// 1. (done)enable user to input contact data
// 2. (done)when user click submit:
//    - write user input contact data into firebase
//    - get contact data by user id
//    - send user to “contact”page and print contact data(name+phone) into #contact-emergencyContacts if “emergency contact” is checked by user, print contact data into #contact-otherContacts if “emergency contact” isn’t checked by user
// 3. (todo)enable users to put “emergency contact” into “other contact” by click star button in front of each contact
// 4. (todo)enable users to delete contacts
//    - when users click edit button, checkboxes appear behind each contact
//    - enable users to click checkboxes behind each contact and click “delete” to delete certain contact


const firebaseConfig = {
    apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
    projectId: "langara-wmdd4885-avengers"
    };
firebase.initializeApp( firebaseConfig ); // Initialize Firebase w. your project settings

// init database
const db = firebase.firestore();
const contactCollection = db.collection("contact")

var backToPage1 = false;
const allPages = document.querySelectorAll('div.page');
allPages[0].style.display = 'block';

function navigateToPage(event) {
  let pageId = null;
  pageId = location.hash ? location.hash : '#page1';

  for (let page of allPages) {
    if (pageId === '#' + page.id) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }
  if (pageId == '#page1') {
    getUserContactsList("iristest0001", updateContactsListHTML);
    getUserEmergencyContactsList("iristest0001", updateEmergencyContactsListHTML);
  }
  return;
}
navigateToPage();

// init handler for hash navigation
window.addEventListener('hashchange', navigateToPage);


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
    // getUserContactsList("iristest0001", updateContactsListHTML);
    // getUserEmergencyContactsList("iristest0001", updateEmergencyContactsListHTML);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
 location.href = '#page1'; // route user back to page1
  
});

//define function to generate contact list by firestore library method
// userId: string, nextAction: function
function getUserContactsList (userId, nextAction) { 
    let contactsOfUser = [];
    const q = contactCollection.where("userID", "==", userId).where("emergencyContact", "==", false).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(doc.data());
                // console.log(doc.id);
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
                // console.log(doc.data());
                // console.log(doc.id);
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
    otherContactsOutput.innerHTML = ""
  for (let i = 0; i < contactsList.length; i++) {
    let text = ""
    text += contactsList[i].name
    text += contactsList[i].phone
  otherContactsOutput.innerHTML += text
 }
}

function updateEmergencyContactsListHTML (contactsList) {
    emergencyContactsOutput.innerHTML = ""
  for (let i = 0; i < contactsList.length; i++) {
    let text = ""
    text += contactsList[i].name
    text += contactsList[i].phone
  emergencyContactsOutput.innerHTML += text
 }
}



