import Vue from 'vue';
import store from './store';
import uiWrapper from './uiWrapper.vue';

let app = new Vue({
  el: '#app',
  name: 'app',
  store,
  components: {
    uiWrapper
  },
})
