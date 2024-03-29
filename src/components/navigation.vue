<template>
  <div id="main_nav">
    <div id="nav_search" class="relative">
      <img src="/img/search.png" alt="" class="nav_icon"  v-on:click="displaySearchBar()">
      <transition name="fade">
        <div v-if="displaySearchBarModal">
          <searchAutoComplete
              search-type="list"
              :items="[games]"
          />
        </div>
      </transition>
    </div>
    <div id="nav_alphab" @click="sortBy('name')">
      <svg id="az_svg" v-bind:class="{ az_svg_active : this.$store.state.filterType === 'name'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 29" fill="white"><g id="Calque_2" data-name="Calque 2"><g id="Calque_1-2" data-name="Calque 1"><text class="cls-1" transform="translate(0.94 24.63)">A</text><text class="cls-2" transform="translate(13.74 11.05)">Z</text></g></g>
      </svg>
    </div>
    <div id="nav_date" @click="sortBy('released')">
      <svg v-bind:class="{ release_date_active : this.$store.state.filterType === 'released'}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: transparent; stroke: white;transform: ;msFilter:;">
        <path  d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path><path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
      </svg>
    </div>
    <div id="nav_tag">
      <svg v-bind:class="{ personal_tags : this.$store.state.filterType === 'personal_tags'}"
           v-on:click="displayTagFilter()"
           xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: transparent; stroke: white;transform: ;msFilter:;">
        <path d="M10.606 0h-10.606v10.609l13.393 13.391 10.607-10.606-13.394-13.394zm-7.02 6.414c-.782-.785-.781-2.047 0-2.83.782-.782 2.049-.779 2.829-.001.783.783.782 2.048 0 2.831-.783.781-2.046.781-2.829 0zm9.807 14.757l-8.484-8.484 7.778-7.778 8.486 8.485-7.78 7.777zm3.534-6.36l-5.656-5.656.707-.709 5.656 5.657-.707.708zm-1.414 1.414l-5.656-5.656.707-.707 5.656 5.656-.707.707zm-3.535-.707l-3.534-3.536.707-.706 3.535 3.535-.708.707z"/>
      </svg>
      <transition name="fade">
        <div v-if="displayTagFilterModal">
          <filterByPersonalTag
              search-type="tag"
              :items="[personalTags]"
          />
        </div>
      </transition>
    </div>
    <div id="nav_rating" v-on:click="sortBy('personal_rating')">
      <svg class="pt-1" xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 24 24">
        <path v-bind:class="{ personal_rating : this.$store.state.filterType === 'personal_rating'}" class="not_favorite_nav" d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/>
      </svg>
    </div>
    <div id="nav_fav" @click="displayOnlyFavoritesSetter">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 24 24">
        <path v-bind:class="{ favorite : this.$store.state.displayOnlyFavorite}" class="not_favorite_nav" stroke="white" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
      </svg>
    </div>
    <div id="nav_plus" v-on:click="toggleDisplayCreationModal()">
      <img src="/img/plus.png" alt="" class="nav_icon">
    </div>
  </div>
  <div id="main_nav_config">
    <img src="/img/config.png" alt="" class="nav_icon">
  </div>


  <transition name="fade">
    <div v-if="displayCreationModal">
      <game-creation-modal></game-creation-modal>
    </div>
  </transition>
</template>

<script>
import store from "@/store/store";
import gameCreationModal from "./gameCreationModal";
import { mapState } from 'vuex'
import searchAutoComplete from "./searchAutoComplete";
import FilterByPersonalTag from "./filterByPersonalTag";

export default {
  name: "navigation",
  components: {
    FilterByPersonalTag,
    gameCreationModal,
    searchAutoComplete
  },
  props: {
  },
  data() {
    return {
      fieldSortBy: 'name',
      sortDirection: 'asc',
      sortByPersonalRating: false,
      displaySearchBarModal : false,
      displayTagFilterModal: false
    }
  },
  computed: {
    ...mapState(
        [
        'count',
        'displayOnlyFavorite',
        'games',
        'displayCreationModal',
        'personalTags',
        ])
  },
  methods: {
    displaySearchBar() {
      this.displayTagFilterModal = false
      this.displaySearchBarModal = !this.displaySearchBarModal
    },
    displayTagFilter() {
      this.displaySearchBarModal = false
      this.displayTagFilterModal = !this.displayTagFilterModal
    },
    toggleDisplayCreationModal() {
      this.$store.commit('setDisplayCreationModal', this.displayCreationModal)
    },
    displayOnlyFavoritesSetter(){
      store.commit('setDisplayOnlyFavorite', !this.$store.state.displayOnlyFavorite)
    },
    sortBy(criteria) {
      this.sortByPersonalRating = criteria === 'personal_rating';
      if(this.fieldSortBy === criteria) {
        // Switch sort direction if we're already filtering with this criteria
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        // Else reset it to the default 'asc'
        this.sortDirection = 'asc'
        this.fieldSortBy = criteria
      }
      this.$store.commit('setFilterDirection', this.sortDirection)
      this.$store.commit('setFilterType', criteria)
      console.log(criteria)
      let modifier = this.sortDirection === 'asc' ? 1 : -1
      this.$store.state.games.sort((a,b) => (a[this.fieldSortBy] > b[this.fieldSortBy]) ? modifier : -1*modifier)
    },
    search() {
      this.$store.commit('hello');
    },
    filterNote(game){
      if (game.note < this.noteMin) {
        console.log(game);
        console.log('a une mauvaise note');

        return 0;
      } else {

        return 1;
      }
    },
  },
}
</script>

<style scoped>
.favorite {
  fill: yellow !important;
  stroke: transparent;
}
.not_favorite_nav {
  stroke: white;
}
.personal_rating {
  fill: red;
  stroke: transparent;
}
.release_date_active {
  fill: white !important;
  stroke: white !important;
}
.cls-1{font-size:21px;}
.cls-1,.cls-2{font-family:Cunia;}
.cls-2{font-size:13px;}
#az_svg {
  fill: transparent;
  stroke: white;
  height: 24px;
  width: 24px;
}
.az_svg_active {
  fill: white !important;
  stroke: transparent !important;
}
</style>
