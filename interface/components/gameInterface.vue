<template>
  <transition name="slide-fade">
    <div class='vue-ui' v-show="isActive">
      <div class='ui-container'>
        <p>Pause Menu</p>
        <!-- Options -->
        <hr/>
        <p v-on:click="sound = !sound">Sound : {{sound}}</p>
        <p v-on:click="shake = !shake">Camera-Shake : {{shake}}</p>
        <button type='button' class='btn-default' tabindex="0" v-on:click="resumeGame" v-on:keyup.enter="resumeGame">resume game</button>
      </div>
    </div>
  </transition>
</template>

<script>
// import HelloWorld from './HelloWorld.vue'

export default {
  name: 'gameInterface',
  components: {
    // HelloWorld
  },
  data: function () {
    return {
      isActive: false,
      sound: true,
      shake: true
    }
  },
  created() {
    window.addEventListener('showUI', this.showUI);
    window.addEventListener('hideUI', this.hideUI);
  },
  destroyed() {
    window.removeEventListener('showUI', this.showUI);
    window.removeEventListener('hideUI', this.hideUI);
  },

  methods: {
    showUI(event) {
      this.isActive = true;
    },
    hideUI(event) {
      this.isActive = false;
    },
    resumeGame() {
      console.log('loneliestGurl');
      this.isActive = false;
       window.dispatchEvent(new CustomEvent('resumeGame', { detail: { isPausing: 'who' }}));
    }
  }
}
</script>

<style lang="scss">
</style>
