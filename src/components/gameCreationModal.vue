<template>
  <div id="game_creation_modal">

    <div class="flex justify-center h-screen items-center antialiased w-3/4">
      <div class="flex flex-col w-full sm:w-5/6 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
        <div
            class="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg"
        >
          <p class="font-semibold text-gray-800">Import a game</p>
          <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              v-on:click="toggleDisplayCreationModal"

          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <div class="flex flex-col px-6 py-5 bg-gray-50">
          <searchAutoComplete
              search-type="api"
              :items="[games]"
          />
        </div>
        <div class="flex flex-col px-6 py-5 bg-gray-50">
          <p class="mb-2 font-semibold text-gray-700">Personal Rating : {{this.gamePersonalRating}}</p>
          <div id="container_rating" class="flex content-between justify-center w-full" v-on:click="setPersonalRating($event)">
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="0">0</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="1">1</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="2">2</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="3">3</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="4">4</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="5">5</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="6">6</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="7">7</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="8">8</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="9">9</button>
            <button class="hover:bg-green-700 rounded px-2 py-1 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white" data-rating="10">10</button>
          </div>
{{checkedTags}}
        <div id="personalTagsContainer">
          <div v-for="tag in personalTags"  v-bind:key="tag" v-bind:value="tag.name" class="personalTag">
            <label v-bind:for="tag.name" v-on:click="toggleCheckStyle($event)"> {{ tag.name }}</label>
            <input type="checkbox" :id="tag.name" v-bind:value="tag.name" v-model="checkedTags">
          </div>
        </div>

        <div class="w-full flex justify-center pt-8">
          <button class="hover:bg-red-500 w-40 hover:border-red-800 rounded px-5 py-2 cursor-pointer m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white"
                  v-on:click="createGame()">Create Game</button>
        </div>
      </div>
    </div>
  </div>



  </div>
</template>

<script>
import {mapState} from "vuex";
import searchAutoComplete from "./searchAutoComplete";
import axios from "axios";
import store from "@/store/store";

export default {
  name: "gameCreationModal",
  components: {
    searchAutoComplete
  },
  data() {
    return {
      checkedTags: [],
      gameName: '',
      gamePersonalRating: '',
      search: '',
      newGame: {
        gameId: '',
        personalRating: 0,
      }
    }
  },
  methods: {
    toggleCheckStyle(event) {
      event.target.parentNode.classList.toggle('checked')
    },
    toggleDisplayCreationModal() {
      this.$store.commit('setDisplayCreationModal', this.displayCreationModal)
    },
    createGame() {
      this.newGame.gameId = this.newGameName
      let personalRating = this.gamePersonalRating
      let personalTags = this.checkedTags
      this.$store.commit('setNewGamePersonalRating', personalRating)
      this.$store.commit('setNewGamePersonalTags', personalTags)
          const searchWithName = {
            method: 'GET',
            url: 'https://api.rawg.io/api/games',
            params: {key: process.env.VUE_APP_API_KEY, search: this.newGame.gameId}
          };

          axios.request(searchWithName).then(function (response) {
            let result = response.data.results[0]
            const searchWithID = {
              method: 'GET',
              url: 'https://api.rawg.io/api/games/' + result.id,
              params: {key: process.env.VUE_APP_API_KEY}
            };

            axios.request(searchWithID).then(function (response) {
              store.dispatch('addGameToDatabase', {
                game : response.data,
              })
            }).catch(function (error) {
              console.error(error);
            });
          }).catch(function (error) {
            console.error(error);
          });
    },
    setPersonalRating(event) {
      this.gamePersonalRating = event.target.dataset.rating
    }
  },
  computed: {
    ...mapState(['games', 'newGameName', 'displayCreationModal', 'personalTags']),
  }
}
</script>

<style scoped>
#game_creation_modal {
  display: flex;
  background-color: transparent;
  justify-content: center;
  position: fixed;
  width: 75%;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}
#container_rating div {
  width: 10%;
}
#iner {
  display: flex;
}
#personalTagsContainer {
  display: flex;
  flex-wrap: wrap;
}
.personalTag {
  margin: 5px 5px;
  padding: 3px 6px;
  border-radius: 10px;
  border:solid 1px black;
  transition: all 0.2s ease-out;
  cursor: pointer;
}
.personalTag label {
  cursor: pointer;
  /*border:solid 1px black;*/
  padding: 3px 6px;
}
.personalTag input {
  display: none;
}
.checked {
  background-color: #7591f1;
  border: solid 1px transparent;
  color: white;
  transition: all 0.2s ease-out;
}
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #4AAE9B;
  color: white;
}
</style>
