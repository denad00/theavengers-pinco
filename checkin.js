
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
