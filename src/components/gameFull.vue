<template>
  <div>
    <div id="modal-full-game" v-if="displayFullGame"
         v-bind:style="{ backgroundImage: 'url(' + fullGame.background_image + ')'}"
    >
     <div id="modal-background" ></div>
      <div id="modal-close" class="relative w-8 h-8" v-on:click="closeModal">
        <img src="/img/circle.svg" alt="" class="absolute">
        <img src="/img/close.svg" alt="" class="absolute w-1/2 inset-0 m-auto">

      </div>
      <div id="modal-wrap">
        <div id="modal-head" >
          <div id="modal-head-left">
<!--            <div v-on:click="toggleFavoriteStatus(fullGame)">FAVORI : {{fullGame.favorite}}</div>-->
            <div id="game-image" class="relative"  v-bind:style="{ backgroundImage: 'url(' + fullGame.background_image + ')'}">
              <div id="favorite">
                <svg v-on:click="toggleFavoriteStatus(fullGame)" class="pt-1" xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 24 24">
                  <path v-bind:class="{ favorite : fullGame.favorite}" class="not_favorite" d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/>
                </svg>

              </div>
            </div>
            <div class="cursor-pointer h-8 w-8 pt-4 pl-4 pb-8">
              <svg v-on:click="deleteGame(fullGame)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path class="text-white fill-current" d="M17.573 1.848c.083.699-.476 1.152-1.182 1.152h-8.774c-.704 0-1.266-.452-1.182-1.156-1.329.281-4.435 1.159-4.435 2.516 0 .303.103.7.235 1.361 3.175 2.953 15.758 3.088 19.476.244.159-.824.289-1.278.289-1.611 0-1.333-3.091-2.223-4.427-2.506zm3.113 6.897c-.868 4.587-2.184 10.54-2.709 13.287-1.079 1.312-3.545 1.968-6.013 1.968s-4.935-.656-6.013-1.968c-.529-2.884-1.834-8.868-2.684-13.414 3.154 1.274 7.398 1.401 8.895 1.401 1.771 0 5.561-.151 8.524-1.274zm-13.069-6.763c.922 0 1.669-1.08 1.669-1.982h5.437c0 .902.747 1.982 1.668 1.982h-8.774z"/>
              </svg>
            </div>
          </div>
          <div id="modal-head-right" class="justify-inherit">
              <div id="game-title">
                  {{fullGame.name}}
              </div>
            <div class="flex mt-4">
                <div id="game-developers" class="mr-10" v-if="fullGame.developers">
                  <p class="mr-2 game-section">Developers</p>
                  <div class="flex flex-wrap">
                    <div v-for="(developer,key) in fullGame.developers"
                         v-bind:key="key"
                         class="section-data mr-2 mt-1 mb-1 bubble">
                      {{developer}}
                    </div>
                  </div>
                </div>
              <div id="game-tags" v-if="fullGame.tags">
                <p class="mr-2 game-section">Tags</p>
                <div class="flex flex-wrap">
                  <div v-for="(tag,key) in fullGame.tags.slice(0,3)"
                       v-bind:key="key"
                       class="section-data mr-2 mt-1 mb-1 bubble">
                    {{tag}}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex mt-4">
              <div id="game-release flex flex-column items-baseline" class="mr-5" >
                <p class="game-section">Release Date</p>
                <div class="text-left"> {{ formatDateReleased }}</div>

              </div>
              <div id="game-finished" class="mr-5" v-if="fullGame.finished !== '0000-00-00'">
                <p class="game-section">Finished</p>
                <div class="text-left"> {{ formatDateFinished }} </div>
              </div>
              <div id="game-personal-rating" class="mr-5" v-if="fullGame.personal_rating >= 0">
                <p class="game-section">Personal Rating</p>
                  <div class="text-left">{{ fullGame.personal_rating }}</div>
              </div>
            </div>
          </div>

        </div>

        <div class="flex">
          <div id="game-description" class="mt-4 w-3/4 ">
            <p class="game-section">Description</p>
            <div v-html="fullGame.description" id="text-description" class="max-h-60	text-left overflow-y-scroll"></div>
          </div>
          <div id="game-custom-tag" class="text-sm mt-4 ml-6" v-if="getPersonalTags">
            <p class="game-section">Personnal tags</p>
            <div id="personal_tags"  v-for="(tag, index) in fullGame.personal_tags"
                 v-bind:key = index>
              <div class="bubble-personal"> {{tag}}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {mapState} from "vuex";
import store from "@/store/store";

export default {
  name: "gameFull",
  props: {
    title: String,
    note: Intl,
    image: String,
    plateforme: String,
    tags: String,
    categories: String,
    description: String
  },
  data() {
    return {}
  },
  methods: {
    closeModal() {
      store.commit('setDisplayFullGame', false)
    },
    deleteGame(game) {
      store.dispatch('deleteGame', game)
      this.closeModal()
    },
    toggleFavoriteStatus(game) {
      store.dispatch('editGameFavoriteStatus', {
        gameObject : game
      })
    },
    stringSplitter(stringToSplit) {
      if (stringToSplit !== undefined) {
        return stringToSplit.split(',');
      }
    },
  },
  computed: {
    ...mapState(['count', 'games', 'gamesNames', 'personalTags','fullGame', 'displayFullGame']),
    formatDateReleased() {
      return dayjs(this.fullGame.released).format('MMMM DD, YYYY')
    },
    formatDateFinished() {
      if(this.fullGame.finished !== '0000-00-00') {
        return dayjs(this.fullGame.finished).format('MMMM DD, YYYY')
      }
      return '0000-00-00'
    },
    getPersonalTags() {
      return this.$store.state.personalTags
    }
  }
}
</script>

<style scoped>
#modal-full-game {
  background-color: #161616;
  border-radius: 10px;
  color: white;
}
#modal-close {
  color: black;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 50;
}
.bubble {
  background-color: grey;
  padding: 2px 7px;
  border-radius: 6px;
}
.bubble-personal {
  font-size: 16px;
  margin: 6px 0;
  background-color: grey;
  padding: 4px 24px;
  border-radius: 6px;
}
.game-section {
color: hsla(0,0%,100%,.2);
  text-align: left;
}
#game-developers {
  align-items: center;

}
.section-data {
  font-size: 13px;
}
.favorite {
  fill: red !important;
}
.not_favorite {
  stroke: black;
  fill: transparent;
}
#game-description {
  font-size: 13px;
  background-color: rgba(0,0,0,0.3);
  margin: 0;
  box-sizing: content-box;
  border-radius: 10px;
}
#game-description p {
  padding: 10px 0;
  margin: 4px 10px;
}
#text-description {
  margin: 4px 10px;

}
#text-description p{
  margin-top: 4px;
  padding: 15px;
}
#game-description p {
  margin-top: 4px;
}
</style>
