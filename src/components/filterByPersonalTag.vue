<template>
  <div v-bind:class="{ personal_tag_search_active : this.searchType === 'tag' }" class="personal_tag_search" v-if="searchType === 'tag'">
    <div v-for="item in items" v-bind:key="item">
      <div v-for="i in item"  v-bind:key="i" v-bind:value="i.name" class="personalTagSearch">
        <label v-bind:for="i.name" v-on:click="toggleCheckStyle($event)"> {{ i.name }}</label>
        <input type="checkbox" :id="i.name" v-bind:value="i.name">
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import {mapState} from "vuex";

export default {
  name: "filterByPersonalTag",
  props: {
    searchType: String,
    items: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      activePersonalTags: [],
      activePersonalTag: String,
      previousChoice: "",
    }
  },
  methods: {
    toggleCheckStyle(event) {
      //TODO Uncomment this part to allow the selection of several tags to filter by
      // if (this.activePersonalTags.includes(event.target.outerText)) {
      //   this.activePersonalTags = this.activePersonalTags.filter(personalTag => !personalTag.includes(event.target.outerText))
      //
      // } else {
      //   this.activePersonalTags.push(event.target.outerText)
      // }

      if(this.activePersonalTag === event.target.outerText) {
        this.activePersonalTag = ''
        event.target.parentNode.classList.remove('personalTagChecked')

      } else {
        this.activePersonalTag = event.target.outerText
        if(this.previousChoice !== "") {
          this.previousChoice.classList.remove('personalTagChecked')

        }
        event.target.parentNode.classList.add('personalTagChecked')
      }

      store.commit('setFilterPersonalTag', this.activePersonalTag)
      this.previousChoice = event.target.parentNode
    },
  },
  computed: {
    ...mapState(
        [
          'filterPersonalTags',
        ]),
  },
}
</script>

<style scoped>
.personal_tag_search {
  position: absolute;
  left: -150px;
  top: 0;
}
.personal_tag_search_active {
  position: absolute;
  height: min-content;
  left: 50px;
  top: 0;
  background-color: black;
  border-radius: 10px;
  padding: 5px;
  z-index: 5;
}
.personalTagSearch {
  display: flex;
}
.personalTagSearch label {
  cursor: pointer;
  padding: 3px 6px;
}
.personalTagSearch input {
  display: none;
}

.personalTagChecked {
  background-color: #7591f1;
  border: solid 1px transparent;
  color: white;
  transition: all 0.2s ease-out;
}
</style>
