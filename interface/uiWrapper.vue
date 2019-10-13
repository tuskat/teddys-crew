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
    resumeGame() {
      this.isActive = false;
       window.dispatchEvent(new CustomEvent('resumeGame', { detail: { isPausing: 'who' }}));
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

<style lang="scss">
// Is not in final build, check why
body {
  font-family: "Connection", cursive;
  font-size: 16px;
}
hr {
  border-width: 1px;
  border-color: white;
  border-style: solid;
}
p {
  font-size: 2em;
  text-shadow: #000000 2px 0 2px;
}

.btn-default {
  margin-top: 1em;
  font-family: "Connection";
  text-decoration: none;
  outline: none;
  border: 2px solid white;
  color: white;
  background: transparent;
  font-size: 2em;
  padding: 0.5em 1em;
  transition: 200ms all ease-in-out;
  box-shadow: inset 0 0 0.5em rgba(255,255,255,0.25);
  text-shadow: #000000 2px 0 2px;
  &:hover {
    background: black;
  }
}

.ui-container {
  margin: 3em;
  padding: 3em;
  border: 2px solid white;
  box-shadow: inset 0 0 0.5em rgba(255,255,255,0.25);
}

.vue-ui {
  font-family: 'Connection', cursive;
  color: white;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  top: 0;
  left: 0;
  transition: 200ms all ease-out;
  overflow: hidden;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

</style>
