<template>
    <div class='nav'>
      <button class='btn-default' v-on:click="toggleUI">X</button>
    </div>
</template>

<script>

export default {
  name: 'pauseOverlay',
  components: {
    // HelloWorld
  },

  methods: {
    toggleUI() {
      let signal = 'resumeGame';
      if (this.$store.state.isActive) {
        signal = 'pauseGame';
        this.$store.dispatch('showUI');
      } else {
        this.$store.dispatch('hideUI');
      }
       window.dispatchEvent(new CustomEvent(signal));
    }
  }
}
</script>

<style lang="scss">
</style>
