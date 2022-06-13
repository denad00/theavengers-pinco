const alarmAudio = document.getElementById("alarm-audio");
alarmAudio.src = "http://soundbible.com/grab.php?id=2197&type=mp3";
alarmAudio.load();
  
let checkInTime = null;

let alarmedCheck = false;

// Handle Create Alarm submit
const handleSubmit = (event) => {
    // Prevent default action of reloading the page
    event.preventDefault();
    const setTime = document.getElementById('timeinput');
    checkInTime = setTime.value.split(":");
    if (checkInTime.length < 2) {
        checkInTime = null;
    }
    timeOutput.innerHTML = setTime.value;
    console.log(checkInTime);

    // Reset form after submit
    document.forms[0].reset();
};

document.forms[0].addEventListener("submit", handleSubmit);

// TODO: cancel button only appears after a valid input is submitted
const handleCancel = () => {
    checkInTime = null;
    timeOutput.innerHTML = "";
};

// Trigger handleClear on button click
cancelButton.addEventListener("click", handleCancel);

function getCurrentTime() {
  const currentDate = new Date();
  const seconds = currentDate.getSeconds();
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours();
  
  return {
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id) {
  const clock = document.getElementById(id);
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getCurrentTime();
    
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    if (checkInTime && !alarmedCheck){
        if (t.hours == checkInTime[0] && t.minutes == checkInTime[1]) {
            alarmAudio.play();
            alarmedCheck = true;
        }
    }
    
    // option: clock keeps running after alarm
    // if (alarmedCheck) {
    //   clearInterval(timeinterval);
    // }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

initializeClock('clockdiv');