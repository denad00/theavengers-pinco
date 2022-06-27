
const db = firebase.firestore();

const messaging = firebase.messaging();

const button = document.getElementById('notifications');

document.getElementById('subscribe').addEventListener('click', () => {
    function subscribeUser(){
        Notification.requestPermission().then((result) =>{
            console.log(permission)
            if(permission === "granted"){
                messaging.getToken({vapidKey:"BHVN1l6afas-f6G-9UYH6-_ozo7UL9uXDEek2smA0yxRvB8WIADVK_G6KFfzPpomFsmC823q4PpF_-THvMZr5Qo"}.then(currentToken => {
                    console.log(currentToken)
                }));
            }
        })
    }
})

    document.getElementById('sosButton').addEventListener ('click', () =>{
        const sos = {
            sosEvent: true,

        }
        const outcome = db.collection("userStatus").add(sos)
        console.log (sos);
    });

    // exports.sosTrigger = functions.firestore.document('users/{userId}').onUpdate(async (snap, context) => {
    //     const newValues = snap.after.data();

    //     const previousValues = snap.before.data();

    //     if (newValues.sosEvent === true) {
    //         const snapshot = await db.collection('userStatus').where('sosEvent', '===', 'true').get();

    //         sosNotification();
    //     }
    // });

    // function sosNotification(){
    //     new Notification(`${db.collection('user').name} has indicated they are in danger`);
    // }