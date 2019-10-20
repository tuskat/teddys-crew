<template>
  <div v-bind:class="wrapperClasses">
    <pause-overlay></pause-overlay>
    <transition name="slide-fade">
      <div class='menu' v-show="isActive">
        <loading v-show="isLoading"></loading>
        <interface v-show="isPausing"></interface>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import PauseOverlay from './components/pauseOverlay.vue'
import Loading from './components/loading.vue'
import Interface from './components/interface.vue'

export default {
  name: 'uiWrapper',
  components: {
      Loading,
      Interface,
      PauseOverlay
  },
  computed: {
    isLoading() {
      return this.$store.state.loading;
    },
    isActive() {
      return this.$store.state.loading || this.$store.state.pause;
    },
    isPausing() {
      return this.$store.state.pause;
    },
    wrapperClasses() {
      return {
        'vue-ui': true,
        maximized: this.isActive
      }
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
      this.$store.dispatch('showLoading');
    },
    showUI(event) {
      this.$store.dispatch('showUI');
    },
    hideUI(event) {
      this.$store.dispatch('hideUI');
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
      this.$store.dispatch('hideLoading');
    }
  }
}
</script>
