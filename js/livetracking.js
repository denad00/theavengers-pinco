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

const liveLocationCollection = db.collection("liveLocationSharing");

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
  const initialPosition = { lat: 49.238093, lng: -123.189117 };
  const marker = createMarker(map, initialPosition)


  trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
    
      marker.setPosition({ lat , lng });
      map.panTo({ lat , lng });

    /*  liveLocationCollection.add({
        latitude: lat,
        longitude: lng,
        time: new Date(),
        userID: userData.multiFactor.user.uid
      })  */
    },
    onError: err => {

    }
  });
}

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




function createMarker(map, position) {
  return new google.maps.Marker({ map, position });
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

setTimeout(()=>{

  db.collection('liveLocationSharing').where('userID', '==', urlParams.get('id')).where('liveLocation','==', true).orderBy("time", "desc").limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const sosFriendData = doc.data();
      console.log(sosFriendData)
      const position = { lat: Number(sosFriendData.latitude), lng: Number(sosFriendData.longitude) };
        createMarker(map, position)
        lat = position.lat
        lang= position.lng
    })
  })


},1000)