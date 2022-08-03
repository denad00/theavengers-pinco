'use strict';
let map,destinationLocation;
let destLat, destLng;

const firebaseApp = firebase.initializeApp({ 
  apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
  authDomain: "langara-wmdd4885-avengers.firebaseapp.com",
  databaseURL: "https://langara-wmdd4885-avengers-default-rtdb.firebaseio.com",
  projectId: "langara-wmdd4885-avengers",
  storageBucket: "langara-wmdd4885-avengers.appspot.com",
  messagingSenderId: "1078303270426",
  appId: "1:1078303270426:web:d7a2c3b43fd70e113053a3",
  measurementId: "G-F4KJKNQE5T"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
let userData = {}

let lat = 0,lang =0;


firebaseApp.auth().onAuthStateChanged(function(user) {
  if (user) {
    userData = user
    setInterval(() => {
      checkSosFriends()
    },2000);

  } else {
    window.location.replace('signin.html')
  }
});

const checkSosFriends = () => {
  db.collection('userStatus').where('uid','==',userData.multiFactor.user.uid).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const userMeta = doc.data()
      userData = {...userData, phone: userMeta.phoneNumber}
      initializeEmergencyLocationSharing()
    })
  })
}

const initializeEmergencyLocationSharing = () =>{
  db.collection('contact').where("phone", "==", userData.phone).where("emergencyContact", "==", true).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const sosFriend = doc.data();
        if(sosFriend) {
          db.collection('user').where("uid","==",sosFriend.userID).where("sosEvent", "==", true).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const contactdata =doc.data()
              if(contactdata){
                db.collection('liveLocationSharing').where('userID', '==', contactdata.uid).get().then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const sosFriendData = doc.data();
                    const position = { lat: Number(sosFriendData.latitude), lng: Number(sosFriendData.longitude) };
                      createMarker(map, position)
                      lat = position.lat
                      lang= position.lng
                
                  })
                })
              }
            })
          })
        }
      })
 });
}

/* ==================== SPA =======================*/

let backToPage1 = false;
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
  return;
}
  
navigateToPage();

window.addEventListener('hashchange', navigateToPage);
document.getElementById("menu_toggle").addEventListener("click", menuToggler);

function menuToggler() {
    document.getElementById("menu").classList.toggle("show_menu");
}

/* ============================== SPA END ===================================== */



/* ============================== CHECKIN ==================================== */


const checkInSessionCollection = db.collection("checkInSession");

// init alarm audio just for prototype
const alarmAudio = document.getElementById("alarm-audio");
alarmAudio.src = "http://soundbible.com/grab.php?id=2197&type=mp3";
alarmAudio.load();

let checkInTime = null;
let activeAlarm = false;
let currSessionRef = null;

// Handle Create Alarm submit function
const handleSubmit = (event) => {
    // Prevent default action of reloading the page
    event.preventDefault();
    const setTime = document.getElementById('timeinput');
    checkInTime = setTime.value.split(":");
    if (checkInTime.length < 2) {
        checkInTime = null;
    } else {
        let fullTime = new Date();
        fullTime.setHours(checkInTime[0]);
        fullTime.setMinutes(checkInTime[1]);
        fullTime.setSeconds(0);
        checkInTime = fullTime;
        createNewCheckInSession("ictestnotif01", checkInTime);
        document.getElementById("cancelButton").style.display = 'inline';
        document.getElementById("createTimer").style.display = 'none';
        document.getElementById("checkInAlarmStatus").innerText = 'Check-in alarm: on';
        setTime.disabled = true;
        activeAlarm = true;
    }

    // Reset form after submit
    // document.forms[0].reset();
};

//create checkin session
function createNewCheckInSession (userId, checkInTime) {
    const session = {
        active: true,
        checkInOnTime: true,
        remindTime: checkInTime,
        startTime: new Date(),
        supposedCheckInTime: checkInTime,
        userID: userId
    }

    //put checkin session object into firestore
    const outcome = checkInSessionCollection.add(session)
    .then((docRef) => {   //docRef: firestore method to get the doc location
        currSessionRef = docRef; //remember the firestore reference of current session
        // do something else: getUserContactsList("iristest0001", updateContactsListHTML);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

function updateCheckInSession (docRef, sessionObj) {
    docRef.update(sessionObj)
    .then(() => {
    })
    .catch((error) => {
        // The document probably doesn't exist.
    });
}

const checkinForm = document.getElementById("checkinform");
checkinForm.addEventListener("submit", handleSubmit);

//function of disable timer
const handleCancel = (event) => {
    event.preventDefault();
    checkInTime = null;
    updateCheckInSession(currSessionRef, { active: false });
    currSessionRef = null;
    document.getElementById("cancelButton").style.display = 'none';
    document.getElementById("createTimer").style.display = 'inline';
    document.getElementById("checkInAlarmStatus").innerText = 'Check-in alarm: off';
    
    document.getElementById('timeinput').disabled = false;
    activeAlarm = false;
};

// Trigger handleCancel on button click
cancelButton.addEventListener("click", handleCancel);


function getCurrentTime() {
  const currentDate = new Date();//date: built in function
  const seconds = currentDate.getSeconds();
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours();
  
  return {
    hours,
    minutes,
    seconds,
  };
}


function checkInHelper () {
    const t = getCurrentTime();
    if (checkInTime && activeAlarm){
        if (t.hours == checkInTime.getHours() && t.minutes == checkInTime.getMinutes()) {
            alarmAudio.play();
            activeAlarm = false;
            updateCheckInSession(currSessionRef, { checkInOnTime: false });
            setTimeout(alert("Last check-in time overdue!"), 5000);
        }
    }
}

const updateCheckInInterval = setInterval(checkInHelper, 1000);


/* ============================== CHECKIN END ================================ */


/* ============================== CONTACT ==================================== */


// init database
const contactCollection = db.collection("contact")

const allFlows = document.querySelectorAll('div.contactFlow')
const otherContactsOutput = document.getElementById("otherContactsOutput");
const emergencyContactsOutput = document.getElementById("emergencyContactsOutput");
allFlows[0].style.display = 'block';
allFlows[1].style.display = 'none';
if (allFlows[0].style.display = 'block') {
  updateContactsListHTML("ictestnotif01");
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
    userID: userData.multiFactor.user.uid, 
    contactID: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))  //generate contact id
  }
    //get user id by firebase doc and add contact into firebase collection-contact by calling function getUserContactsList
  const outcome = contactCollection.add(contact)
.then((docRef) => {
    updateContactsListHTML("ictestnotif01");
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

    contactListOutputElement.appendChild(line);
    const starBtn = document.createElement("button");
    starBtn.textContent = "star";
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

/* ========================= CONTACT END =======================*/


/* ========================= SOS ============================ */


const sosEvent = document.getElementById('sosButton');
let userStatus = db.collection("userStatus");
let userStatusRef = null

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

/* =========================== SOS END ==================================== */


/* =========================== PRERECORDED ================================ */


/* =========================== PRERECORDED END =========================== */


function init () {
  destLat = 49.238093;
  destLng = -123.189117;
  destinationLocation = new google.maps.LatLng(destLat, destLng);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: destinationLocation
  });
  const initialPosition = { lat: 49.238093, lng: -123.189117 };
  createMarker(map, initialPosition)
}

function createMarker(map, position) {
  return new google.maps.Marker({ map, position });
};


/*
const liveLocationCollection = db.collection("liveLocationSharing");

const createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng },
    zoom: 15
  });
};

const createMarker = ({ map, position }) => {
  return new google.maps.Marker({ map, position });
};

const getCurrentPosition = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  return navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

const getPositionErrorMessage = code => {
  switch (code) {
    case 1:
      return 'Permission denied.';
    case 2:
      return 'Position unavailable.';
    case 3:
      return 'Timeout reached.';
    default:
      return null;
  }
}

const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  return navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
  });
};


function init() {
  const initialPosition = { lat: 59.325, lng: 18.069 };
  const map = createMap(initialPosition);
  const marker = createMarker({ map, position: initialPosition });


  trackLocation({
    onSuccess: (data) => {
      console.log(data);
      //{ coords: { latitude: lat, longitude: lng } }
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });

      liveLocationCollection.add({
        active: true,
        latitude: lat,
        longitude: lng,
        time: new Date(),
        userID: userData.multiFactor.user.uid
      }) 
    },
    onError: err => {

    }
  });
}*/

/* ========================= ACCOUNT =======================*/

let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let stop_camera = document.querySelector("#camera_stop");
let upload_photo = document.querySelector("#upload_photo");
let stream;
let image;

camera_button.addEventListener('click', async function() {
  canvas.style.display="none"
  video.style.display = "inline";
  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream; 
  camera_stop.style.display="inline"
  camera_button.style.display= "none"
  click_button.style.display = "inline"
});

click_button.addEventListener('click', function() {
  camera_stop.style.display="none"
  camera_button.style.display= "inline"
  upload_photo.style.display = "inline"
   	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
   	let image_data_url = canvas.toDataURL('image/jpeg');
     fetch(image_data_url)
     .then(res => res.blob())
     .then(data =>{ 
        image = data
    })
     stream.getTracks().forEach(function(track) {
      track.stop();
    }); 
    video.style.display = "none"
    canvas.style.display="inline"
});

stop_camera.addEventListener('click', function() { 
  stream.getTracks().forEach(function(track) {
    track.stop();
    camera_stop.style.display="none"
    camera_button.style.display= "inline"
    canvas.style.display="none"
    video.style.display="none"
    click_button.style.display = "none"
  }); 
})

upload_photo.addEventListener('click', function() { 
  firebaseApp.storage().ref('users/'+userData.multiFactor.user.uid+'/profile.jpg').put(image).then((snapshot)=>{
    snapshot.ref.getDownloadURL().then(function(downloadURL) {
      auth.currentUser.updateProfile({
        photoURL: downloadURL,
      }).then(() => {
        upload_photo.style.display ="none"
        click_button.style.display = "none"
      })
    });

  }).catch(error => {
    console.log(error)
  })
});

let account = document.getElementById("account")

account.addEventListener('submit',(e) =>{
  e.preventDefault();
  let displayName = document.getElementById('accountdisplayName').value
  let email = document.getElementById('accountemail').value
  let password = document.getElementById('accountpassword').value
  let phone = document.getElementById('phone').value

  db.collection("user").doc(userData.multiFactor.user.uid).update({uid: userData.multiFactor.user.uid, phoneNumber: phone, email: email}).then(() =>{
    auth.currentUser.updateProfile({
      displayName: displayName
    }).then(() =>{
      auth.updatePassword(password).then(() => {
        // Update successful.
      }, (error) => {
        // An error happened.
      });
    })
  })

})