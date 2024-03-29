<template>

  <div class="text-white text-xs mt-4"
      v-if="this.filterType === 'released'">
    {{game.released}}
  </div>
  <div class="text-white text-xs mt-4"
      v-if="this.filterType === 'personal_rating' && game.personal_rating !== null && game.personal_rating >= 0">
    {{game.personal_rating}}
  </div>
  <div class="text-white text-xs mt-4"
      v-if="this.filterType === 'personal_rating' && game.personal_rating === -1">
    -
  </div>
  <div class="thumbnail_image_background"
       v-bind:style="{ backgroundImage: 'url(' + game.background_image + ')'}"
       v-bind:id="game.name"
       v-on:click="openModal"
  />
<!--  <div class="thumbnail_image_background thumbnail_back"-->
<!--       v-bind:style="{ backgroundImage: 'url(' + game.background_image + ')'}"-->
<!--       v-bind:id="game.name"-->
<!--       v-on:click="openModal"-->
<!--  >-->
<!--    <p>{{game.name}}</p>-->
<!--    <p v-if="game.personal_rating !== null"> {{}}</p>-->
<!--  </div>-->

</template>

<script>
import store from "@/store/store";
import {mapState} from "vuex";

export default {
  name: "gameThumbnail",
  props: {
    title: String,
    plateforme: String,
    tags: String,
    categories: String,
    description: String,
    game: {
      name: String,
      background_image: String,
      note: Intl
    }
  },
  data() {
    return {
      displayFull : false
    }
  },
  methods: {
    openModal(event) {
      store.commit('setDisplayFullGame', true)
      store.dispatch('getSingleGameWithName', {
        gameID : event.target.id
      })
    }
  },
  computed: {
    ...mapState(
        [
            'count',
            'games',
            'gamesReferences',
            'fullGame',
            'displayFullGame',
            'filterType'
        ]
    ),
    filterNote(){
      if (this.game.note < 2) {
        console.log(this.game);
        console.log('a une mauvaise note');

        return 0;
      } else {

        return 1;
      }
    },
  }
}
</script>

<style scoped>
.tagContainer, .categoryContainer {
  display: flex;
}
.tag, .category {
  background: #2c3e50;
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
}
</style>
