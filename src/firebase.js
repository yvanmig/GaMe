import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
    apiKey: process.env["VUE_APP_API_KEY"],
    authDomain: process.env["AUTH_DOMAIN"],
    projectId: process.env["PROJECT_ID"],
    storageBucket: process.env["STORAGE_BUCKET"],
    messagingSenderId: process.env["MESSAGING_SENDER_ID"],
    appId: process.env["APP_ID"]

});

var db = firebase.firestore();

const gamesCollection = db.collection('games')
const gamesReferenceCollection = db.collection('game_name')
const personalTags = db.collection('personal_tags')

export {
    db,
    gamesCollection,
    gamesReferenceCollection,
    personalTags
}
