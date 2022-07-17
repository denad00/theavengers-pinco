const firebaseApp = firebase.initializeApp({ 
  apiKey: "AIzaSyBybnwAFnoIbIbxbOQMLEHOaiO796YviRY",
  projectId: "langara-wmdd4885-avengers"
});

const db = firebaseApp.firestore();

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
  const $info = document.getElementById('info');

  trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
      $info.textContent = `Lat: ${lat} Lng: ${lng}`;
      $info.classList.remove('error');

      console.log(lng);
      console.log(lat);
      liveLocationCollection.add({
        active: true,
        latitude: lat,
        longitude: lng,
        time: new Date(),
        userID: 'harshit'
      })
    },
    onError: err => {
      // Print out the error message.
      $info.textContent = `Error: ${getPositionErrorMessage(err.code) || err.message}`;
      // Add error class name.
      $info.classList.add('error');
    }
  });
}