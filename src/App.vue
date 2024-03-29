<template>
  <div id="body" class="m-0 p-0">
    <div v-if="displayFullGame" id="body_blur" class="w-full h-full absolute bg-black x-10 blur-md opacity-50 z-20 transition-all"></div>

    <nav class="z-30">
        <navigation/>
      </nav>

    <div id="wrap_body">
      <button @click="getSingleGame" class="h-16 w-12"></button>
      <button @click="uploadFile" class="h-16 w-12">UPLOAD PLEASE</button>
      <button @click="getGameFromApiWithName(gamesReferences)" class="h-16 px-5 bg-gray-200" id="api-update">Update list with API</button>

      <div id="filtre_actuel" class="flex">
        <transition name="fade">
          <div class="flex transition ease-in-out duration-150 items-center mr-2 py-1 px-2 bg-white rounded-lg hover:bg-blue-500 hover:text-gray-100 cursor-pointer"
               v-if="filterType"
               v-on:click="disableFilter">
            <div id="filter_type" class="mr-2 h-full flex items-center">
              <svg v-if="this.filterType === 'released'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path><path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
              </svg>
              <svg id="az_svg_filter" v-if="this.filterType === 'name'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 29" fill="white"><g id="Calque_2" data-name="Calque 2"><g id="Calque_1-2" data-name="Calque 1"><text class="cls-1" transform="translate(0.94 24.63)">A</text><text class="cls-2" transform="translate(13.74 11.05)">Z</text></g></g>
              </svg>
                <svg v-if="this.filterType === 'personal_rating'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path class="personal_rating" d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/>
                </svg>
            </div>
            <svg v-if="this.filterDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M6 3l-6 8h4v10h4v-10h4l-6-8zm16 14h-8v-2h8v2zm2 2h-10v2h10v-2zm-4-8h-6v2h6v-2zm-2-4h-4v2h4v-2zm-2-4h-2v2h2v-2z"/>
            </svg>
            <svg v-if="this.filterDirection === 'desc'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M6 21l6-8h-4v-10h-4v10h-4l6 8zm16-12h-8v-2h8v2zm2-6h-10v2h10v-2zm-4 8h-6v2h6v-2zm-2 4h-4v2h4v-2zm-2 4h-2v2h2v-2z"/>
            </svg>
          </div>

        </transition>
        <transition name="fade">
          <div class="flex transition ease-in-out duration-150 items-center mr-2 p-2 bg-white rounded-lg hover:bg-blue-500 hover:text-gray-100"
               v-if="displayOnlyFavorite"
               v-on:click="disableFavorite">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill='yellow' stroke="black" stroke-opacity="0.2" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
            </svg>
          </div>
        </transition>
      </div>

      <div id="game_container">
        <div v-for="(game,index) in favorites"
             v-bind:key="index">

          <div v-if="filterNote(game)" class="thumbnail_card m-2 z-10">
            <gameThumbnail :game = game ></gameThumbnail>
          </div>

        </div>
        <div class="z-30">
          <game-full ></game-full>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gameThumbnail from "@/components/gameThumbnail";
import navigation from "@/components/navigation";
import { mapState } from 'vuex'
import axios from "axios";
import store from "@/store/store";
import GameFull from "./components/gameFull";


export default {
  name: 'App',
  components: {
    GameFull,
    gameThumbnail,
    navigation,
  },
  data() {
    return {
      noteMin: 0,
      myList : [],
      fieldSortBy: 'name',
      sortDirection: 'asc',
      myModel: ''
    }
  },
  methods: {
    sortBy(criteria) {
      if(this.fieldSortBy === criteria) {
        // Switch sort direction if we're already filtering with this criteria
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        // Else reset it to the default 'asc'
        this.sortDirection = 'asc'
        this.fieldSortBy = criteria
      }
      let modifier = this.sortDirection === 'asc' ? 1 : -1
      this.$store.state.games.sort((a,b) => (a[this.fieldSortBy] > b[this.fieldSortBy]) ? modifier : -1*modifier)
    },
    disableFilter() {
      this.$store.commit('setFilterType', '')
    },
    disableFavorite() {
      this.$store.commit('setDisplayOnlyFavorite', false)
    },
    filterNote(game){
      if (game.note < this.noteMin) {
        // console.log(game);
        // console.log(' a une mauvaise note');

        return 0;
      } else {

        return 1;
      }
    },
    getGameFromApiWithName(gamesReferences) {

      gamesReferences.forEach(game => {
        console.log(game)
        const searchWithName = {
          method: 'GET',
          url: 'https://api.rawg.io/api/games',
          params: {key: process.env.VUE_APP_API_KEY, search: game.name}
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
              game : response.data
            })
            store.dispatch('editGameFetchedStatus', {
              game : game
            })

          }).catch(function (error) {
            console.error(error);
          });
        }).catch(function (error) {
          console.error(error);
        });
      })

    },
    getSingleGame(gameID) {
      const optionsSingle = {
        method: 'GET',
        url: 'https://api.rawg.io/api/games/' + gameID,
        params: {key: process.env.VUE_APP_API_KEY}
      };

      axios.request(optionsSingle).then(function (response) {
      }).catch(function (error) {
        console.error(error);
      });
    },
    uploadFile() {
      console.log('sup')
      store.dispatch('uploadImage')
    },

  },
  computed: {
    ...mapState([
      'count',
      'games',
      'gamesReferences',
      'fullGame',
      'displayFullGame',
      'displayOnlyFavorite',
      "filterDirection",
      'filterType',
      'filterPersonalTag'
    ]),
    getAllGames: {
      get() {
        return this.$store.state.games
      }
    },
    //TODO Once all games have their 'favorite' value set to false by default, uncomment the line ending with 'game.favorite === false'
    favorites() {
      let allGames = this.getAllGames
      let filteredGames = []
      let activePersonalTag =  this.$store.state.filterPersonalTag

      if(this.$store.state.displayOnlyFavorite) {
        allGames = this.$store.state.games.filter(game => game.favorite === true)
      }

      if(activePersonalTag !== ""){
        allGames.forEach(function(game){
          if(game.personal_tags.length > 0) {
            if(game.personal_tags.includes(activePersonalTag)){
              filteredGames.push(game)
            }
          }
        });

        return filteredGames
      }

      return allGames
    },
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#filter_type {
  height: 30px;
}
.favorite {
  fill: yellow !important;
}
.personal_rating {
  fill: red;
}
.fade-enter-active, .fade-enter-to, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
#az_svg_filter {
  fill: white;
  stroke: black;
  height: 24px;
  width: 24px;
}

</style>
