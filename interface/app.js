import Vue from 'vue';
import gameInterface from './components/gameInterface.vue'
// miserably fails, check why. Seems it needs to compile
import './styles/default.scss';


let app = new Vue({
  el: '#app',
  name: 'app',
  components: {
    gameInterface
  },
})
