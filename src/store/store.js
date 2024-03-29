import Vuex from 'vuex'

// Testing purposes, replace with "firebase"
import * as db from '../firebase_local'

import firebase from "firebase";


db.gamesCollection.onSnapshot(snapshot => {
        let gamesArray = []
        snapshot.forEach(doc => {
            console.log(doc)
            let post = doc.data()
            post.id = doc.id
            gamesArray.push(post)
        })

        store.commit('setGames', gamesArray)
    })
db.gamesReferenceCollection.onSnapshot(snapshot => {
        let gamesArray = []
        snapshot.forEach(doc => {
            let post = doc.data()
            if(post.fetched) {
               return
            }
            post.id = doc.id
            gamesArray.push(post)
        })

        store.commit('setGamesReference', gamesArray)
    })
db.personalTags.onSnapshot(snapshot => {
        let personalTagsArray = []
        snapshot.forEach(doc => {
            let post = doc.data()
            if(post.fetched) {
               return
            }
            post.id = doc.id
            personalTagsArray.push(post)
        })
        personalTagsArray.sort((a,b) => (a[name] > b[name]) ? -1 : 1)

        store.commit('setPersonalTags', personalTagsArray)
    })

const store = new Vuex.Store({
    state: {
        count: 0,
        games: [],
        gamesReferences: [],
        personalTags: [],
        fullGame: [],
        displayFullGame: false,
        displayOnlyFavorite: false,
        filterPersonalTags: [],
        filterPersonalTag: "",
        filterDirection: '',
        filterType: '',
        newGameName: '',
        newGamePersonalRating: -1,
        newGamePersonalTags: [],
        displayCreationModal: false,
    },
    mutations: {
        hello(state) {
            state.count++
        },
        setGames(state,val) {
            state.games = val
        },
        setGamesReference(state,val) {
            state.gamesReferences = val
        },
        setPersonalTags(state,val) {
            state.personalTags = val
        },
        setFullGame(state,val) {
            state.fullGame = val
        },
        setFullGameFavoriteState(state,val) {
            state.fullGame.favorite = val
        },
        setDisplayFullGame(state,val) {
            state.displayFullGame = val
        },
        setDisplayOnlyFavorite(state,val) {
            state.displayOnlyFavorite = val
        },
        setFilterDirection(state,val) {
            state.filterDirection = val
        },
        setFilterType(state,val) {
            state.filterType = val
        },
        setNewGameName(state,val) {
            state.newGameName = val
        },
        setNewGamePersonalRating(state,val) {
            state.newGamePersonalRating = val
        },
        setNewGamePersonalTags(state,val) {
            state.newGamePersonalTags = val
        },
        setDisplayCreationModal(state,val) {
            state.displayCreationModal = !val
        },
        setFilterPersonalTags(state,val) {
            state.filterPersonalTags = val
        },
        setFilterPersonalTag(state,val) {
            state.filterPersonalTag = val
        }
    },
    actions: {
        getSingleGameWithName({state,commit}, gameObject) {
            console.log(gameObject)
            const docRef = db.gamesCollection.doc(gameObject.gameID);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    store.commit('setFullGame', doc.data());
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        },

        /**
         *
         * @param state
         * @param commit
         * @param gameObject
         * @param gamePersonalRating
         * @returns {Promise<void>}
         */
        async addGameToDatabase({ state, commit }, gameObject){

            let game = gameObject.game
            let developers = [];
            let genres = [];
            let tags = [];
            developers = extractNameFromArray(developers, game.developers)
            genres = extractNameFromArray(genres, game.genres)
            tags = extractNameFromArray(tags, game.tags)
            console.log('perso tags', store.state.newGamePersonalTags)

            tags.forEach((element, tagIndex) => {
                if(element === 'Steam Achievements' ||
                    element === 'steam-trading-cards' ||
                    element === 'Valve Anti-Cheat enabled' ||
                    element === 'Full controller support' ||
                    element === 'Steam Cloud' ||
                    element === 'Steam Leaderboards') {
                    tags.splice(tagIndex, 1)
                    console.log('Tag interdit')
                }
            })
            // tags.filter(blackListTags);
            await db.gamesCollection.doc(game.name).set({
                id : game.id,
                name : game.name,
                description: game.description,
                released: game.released,
                finished: '0000-00-00',
                personal_rating: store.state.newGamePersonalRating,
                personal_tags: store.state.newGamePersonalTags,
                background_image: game.background_image,
                developers: developers,
                genres: genres,
                tags: tags,
                favorite: false
            })
        },

        // eslint-disable-next-line no-unused-vars
        async editGameFetchedStatus({ state, commit }, gameObject) {
            // console.log(gameObject)
            await db.gamesReferenceCollection.doc(gameObject.game.name).set({
                fetched : true
            }, {merge : true})
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        },

        // eslint-disable-next-line no-unused-vars
        async editGameFavoriteStatus({ state, commit }, gameObject) {
            const game = gameObject.gameObject
            console.log('favorite state :', game.favorite)
            await db.gamesCollection.doc(game.name).set({
                favorite : !game.favorite
            }, {merge : true})
                .then(() => {
                    store.commit('setFullGameFavoriteState', !game.favorite);
                    console.log("Document successfully edited!");
                })
                .catch((error) => {
                    console.error("Error editing document: ", error);
                });
        },
        // eslint-disable-next-line no-unused-vars
        async deleteGame({ state, commit }, gameObject) {
            db.gamesCollection.doc(gameObject.name).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        },
/*        uploadImage(image){
            // Create a root reference
            var storageRef = firebase.storage().ref();
            console.log(storageRef)
        }*/
    }
})

function blackListTags(tags) {
    return tags !== 'Steam Achievements' &&
        tags !== 'steam-trading-cards' &&
        tags !== 'Valve Anti-Cheat enabled' &&
        tags !== 'Full controller support' &&
        tags !== 'Steam Cloud' &&
        tags !== 'Steam Leaderboards'
}
/**
 *
 * @param DBBArray
 * @param APIArray
 * @returns {*}
 */
function extractNameFromArray(DBBArray, APIArray) {

    APIArray.forEach( element => {
        DBBArray.push(element.name)
    })
    return DBBArray;
}
export default store
