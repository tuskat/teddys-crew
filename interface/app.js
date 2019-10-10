import Vue from 'vue';
import gameInterface from './components/gameInterface.vue'

let app = new Vue({
  el: '#app',
  name: 'app',
  components: {
    gameInterface
  },
})