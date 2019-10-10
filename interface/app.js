import Vue from 'vue';
import gameInterface from './components/gameInterface.vue'
import '../styles/default.scss';


let app = new Vue({
  el: '#app',
  name: 'app',
  components: {
    gameInterface
  },
})
