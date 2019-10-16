<template>
  <transition name="slide-fade">
    <div class='vue-ui' v-show="isActive">
        <loading v-show="isLoading"></loading>
        <interface v-show="isPausing"></interface>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import Loading from './components/loading.vue'
import Interface from './components/interface.vue'

export default {
  name: 'uiWrapper',
  components: {
      Loading,
      Interface
  },
  data: function () {
    return {
      isActive: true,
      isPausing: false,
      isLoading: true,
      sound: true,
      shake: true
    }
  },

  created() {
    if (TARGET === 'electron') {
      this.loadScript('./app.bundle.js', this.hideUI);
    }
    window.addEventListener('showUI', this.showUI);
    window.addEventListener('hideUI', this.hideUI);
  },

  destroyed() {
    window.removeEventListener('showUI', this.showUI);
    window.removeEventListener('hideUI', this.hideUI);
  },

  methods: {
    showLoading(event) {
      this.isActive = true;
      this.isLoading = true;
    },
    showUI(event) {
      this.isActive = true;
      this.isPausing = true;
    },
    hideUI(event) {
      this.isActive = false;
      this.isPausing = false;
      this.isLoading = false;
    },
    loadScript(url, callback) {
      // Adding the script tag to the head as suggested before
      var head = document.head;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading
      head.appendChild(script);
      this.isLoading = false;
    }
  }
}
</script>
