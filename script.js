// 'use strict';
// let map,destinationLocation;
// let destLat, destLng;
// let markers = [];


// let userData = {}

// let lat = 0,lang =0;

// window.onload = function() {
//   initializeApp();
// };


// function initializeApp () {
//   firebaseApp.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       userData = user
//       setInterval(() => {
//         checkSosFriends()
//       },3000);
  
//     } else {
//       window.location.replace('signin.html')
//     }
//   });
// }

// const checkSosFriends = () => {
//   db.collection('user').where('uid','==',userData.multiFactor.user.uid).get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       const userMeta = doc.data()
//       userData = {...userData, phone: userMeta.phoneNumber}
//       document.getElementById('accountdisplayName').value =  userData.multiFactor.user.displayName
//       document.getElementById('accountemail').value = userData.multiFactor.user.email
//       document.getElementById('phone').value = userData.phone
//       initializeEmergencyLocationSharing()
//     })
//   })
// }

// const initializeEmergencyLocationSharing = () =>{
//   db.collection('contact').where("phone", "==", userData.phone).where("emergencyContact", "==", true).get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const sosFriend = doc.data();
//         if(sosFriend) {
//           db.collection('userStatus').where('userID',"==",sosFriend.userID).where("sosEvent", "==", true).get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//               const contactdata =doc.data()
//               if(contactdata){
//                 db.collection('liveLocationSharing').where('userID', '==', contactdata.userID).orderBy("time", "desc").limit(1).get().then((querySnapshot) => {
//                   querySnapshot.forEach((doc) => {
//                     const sosFriendData = doc.data();
//                     const position = { lat: Number(sosFriendData.latitude), lng: Number(sosFriendData.longitude) };
//                       createMarker(map, position)
//                       lat = position.lat
//                       lang= position.lng
                
//                   })
//                 })
//               }
//             })
//           })
//         }
//       })
//  });
// }

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

const checkinUserJson = localStorage.getItem('user');
const checkinUserObj = JSON.parse(checkinUserJson);
const checkinUserId = checkinUserObj.uid;

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
        createNewCheckInSession(checkinUserId, checkInTime);
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


/* ========================= CONTACT END =======================*/


/* =========================== SOS END ==================================== */


/* =========================== PRERECORDED ================================ */


/* =========================== PRERECORDED END =========================== */

const liveLocationCollection = db.collection("liveLocationSharing");


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

function CenterControl(controlDiv, map) {
  const controlUI = document.createElement("div");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginBottom = "22px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to recenter the map";
  controlDiv.appendChild(controlUI);

  const controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "SHARE LOCATION";
  controlUI.appendChild(controlText);
  let modal = document.getElementById("myModal")
  let span = document.getElementsByClassName("close")[0];
  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener("click", () => {
    modal.style.display = "block"
    document.getElementById("shareableLink").innerText = window.location.hostname+'/livetracking.html?id='+userData.multiFactor.user.uid
  });

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }  
  
}

function init () {
  destLat = 49.238093;
  destLng = -123.189117;
  destinationLocation = new google.maps.LatLng(destLat, destLng);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: destinationLocation
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    map.setZoom(12); // call initCoords()
  });

  const centerControlDiv = document.createElement("div");

  CenterControl(centerControlDiv, map);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  const initialPosition = { lat: 49.238093, lng: -123.189117 };
  const marker = createMarker(map, initialPosition)


  trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
    
      marker.setPosition({ lat , lng });
      map.panTo({ lat , lng });

      liveLocationCollection.add({
        latitude: lat,
        longitude: lng,
        time: new Date(),
        userID: userData.multiFactor.user.uid
      })  
    },
    onError: err => {

    }
  });
}

function createMarker(map, position) {
  return new google.maps.Marker({ map, position });
};




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