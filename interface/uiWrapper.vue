<template>
  <div v-bind:class='wrapperClasses'>
    <pause-overlay></pause-overlay>
    <div class='menu' v-show='isActive'>
      <loading v-show='isLoading'></loading>
      <start-interface></start-interface>
      <transition name='slide-fade'>
        <pause-interface v-show='isPausing'></pause-interface>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PauseOverlay from './components/pauseOverlay.vue';
import Loading from './components/loading.vue';
import PauseInterface from './components/pauseInterface.vue';
import StartInterface from './components/startInterface.vue';

export default {
  name: 'uiWrapper',
  components: {
    Loading,
    PauseInterface,
    PauseOverlay,
    StartInterface
  },
  computed: {
    isLoading() {
      return this.$store.state.loading;
    },
    isActive() {
      return this.$store.getters.menuIsActive;
    },
    isPausing() {
      return this.$store.state.pause;
    },
    wrapperClasses() {
      return {
        'vue-ui': true,
        maximized: this.isActive
      };
    }
  },
  created() {
    if (TARGET === 'electron') {
      this.loadScript('./app.bundle.js', this.hideUI);
    }
    window.addEventListener('showUI', this.showUI);
    window.addEventListener('hideUI', this.hideUI);
    window.addEventListener('loadingComplete', this.hideLoading);
    window.addEventListener('sceneChanged', this.setCurrentScene);
  },

  destroyed() {
    window.removeEventListener('showUI', this.showUI);
    window.removeEventListener('hideUI', this.hideUI);
    window.removeEventListener('sceneChanged', this.setCurrentScene);
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
    hideLoading(event) {
      this.$store.dispatch('hideLoading');
    },
    setCurrentScene(event) {
      this.$store.dispatch('setScene', event.detail.scene);
    },
    loadScript(url, callback) {
      // Adding the script tag to the head as suggested before
      var head = document.head;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading
      head.appendChild(script);
      this.$store.dispatch('hideLoading');
    }
  }
};
</script>
