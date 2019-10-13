import Vue from 'vue';

// miserably fails, check why. Seems it needs to compile
import uiWrapper from './uiWrapper.vue';

let app = new Vue({
  el: '#app',
  name: 'app',
  components: {
    uiWrapper
  },
})
