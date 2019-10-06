<template>
  <div class='vue-ui' v-if="isActive">
    <h3>Gira Gira Girassa Ji Van Gogh I</h3>
    <p v-on:click="resumeGame">resume game</p>
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
  </div>
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
      isActive: false
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
      this.isActive = false;
       window.dispatchEvent(new CustomEvent('resumeGame', { detail: { isPausing: 'who' }}));
    }
  }
}
</script>


<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">

</style>