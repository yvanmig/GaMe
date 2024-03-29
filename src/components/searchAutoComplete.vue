<template>
  <div>
    <div class="autocomplete_search" v-if="this.searchType === 'list'">
      <input
          v-model="search"
          @input="onChange"
          type="text"
      />
      <ul
          v-show="isOpen"
          class="autocomplete-results-search"
      >
        <li
            v-for="(result, i) in results"
            :key="i"
            @click="setAppResult(result); openModal(result)"
            class="autocomplete-result-search"
        >
          {{ result.id }}
        </li>
      </ul>
    </div>

  <div class="autocomplete" v-if="this.searchType === 'api'">
    <input
        v-model="search"
        @input="onChange"
        @blur="onBlur"
        type="text"
    />
    <h2 class="my-2">Check if the game is already imported</h2>
    <ul
        v-show="isOpen"
        class="autocomplete-results"
    >
      <li v-if="results.length === 0">
        <p>Rien</p>
      </li>
      <li
          v-for="(result, i) in results"
          :key="i"
          @click="setResult(result)"
          class="autocomplete-result"
      >
        {{ result.id }}
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
import store from "@/store/store";
import {mapState} from "vuex";

export default {
  name: 'SearchAutocomplete',
  props: {
    searchType: String,
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      search: '',
      results: [],
      isOpen: false,
    };
  },
  methods: {
    //TODO: modify this component to create a game = check if game exists in the rawg database, AND that it isn't already stored in mine
    //This way it will list games that weren't already imported
    filterResults() {
      this.items.forEach((element,index) => {
        this.results = element.filter(e => e.id.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
      })
      if(this.results.length === 0 ) {
        this.$store.commit('setNewGameName', this.search)
      }
    },
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    onBlur() {
      if(this.search) {
        this.$store.commit('setNewGameName', this.search)
      }
    },
    setAppResult(result) {
      this.search = result.id
      this.isOpen = false
    },
    openModal(result) {
      store.commit('setDisplayFullGame', true)
      store.dispatch('getSingleGameWithName', {
        gameID : result.id
      })
    },
    setResult(result) {
      this.search = result.id
      this.isOpen = false
    }
  },
  computed: {
    ...mapState(['newGameName']),
  }
};
</script>

<style>
.autocomplete {
  position: relative;
  transition: all 0.2s ease-in-out;
}
.autocomplete_search {
  position: absolute;
  left: 27px;
  top: 0;
}
.autocomplete_search:hover {
  background-color: #17931a;

}

.autocomplete-results-search {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  min-height: 1em;
  background-color: white;
  max-height: 210px;
  overflow: auto;
}
.autocomplete-result-search {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
  height: min-content;

}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  max-height: 210px;
  min-height: 1em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
  height: min-content;
}

.autocomplete-result-search:hover {
  background-color: #4AAE9B;
  color: white;
}
.autocomplete input {
  width: 250px;
  border: solid 1px rgba(0,150,150,0.5);
  border-radius: 8px;
}
</style>
