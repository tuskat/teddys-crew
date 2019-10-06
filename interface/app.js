import Vue from 'vue';
import gameInterface from './components/gameInterface.vue'


window.addEventListener('showUI', showUI , false);
window.addEventListener('hideUI', hideUI, false);

function showUI() {
  console.log('we be :u');
}

function hideUI() {
  console.log('communicating u:');
}
let app = new Vue({
  el: '#app',
  name: 'app',
  components: {
    gameInterface
  }
})