<template>
  <div class='ui-container'>
    <p>Loading...</p>
  </div>
</template>

<script>

export default {
  name: 'loading',
  components: {
    // HelloWorld
  },
  data: function () {
    return {
      isActive: true,
    }
  },

  methods: {
    showUI(event) {
      this.isActive = true;
    },
    hideUI(event) {
      this.isActive = false;
    },
    startGame() {
      this.isActive = false;
       window.dispatchEvent(new CustomEvent('startGame', { detail: { isPausing: 'who' }}));
    }
  }
}
</script>

<style lang="scss">
</style>
