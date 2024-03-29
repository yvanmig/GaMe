import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""

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
