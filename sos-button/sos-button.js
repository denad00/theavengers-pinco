
const db = firebase.firestore();


    sosButton.addEventListener ('click', () =>{
        // new Notification('Danika has indicated she is in danger, please reach out to her');
        const sos = {
            sosEvent: true,
        }
        const outcome = db.collection("userStatus").add(sos)
        console.log (sos);
    })