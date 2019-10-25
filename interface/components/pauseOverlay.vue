<template>
    <div class='nav' v-show="showPauseIcon">
      <button v-bind:class="buttonClasses" v-on:click="toggleUI"></button>
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
      if (!this.$store.getters.menuIsActive) {
        signal = 'pauseGame';
        this.$store.dispatch('showUI');
      } else {
        this.$store.dispatch('hideUI');
      }
       window.dispatchEvent(new CustomEvent(signal));
    }
  },

  computed: {
    buttonClasses() {
      return {
        'btn-nav' : true,
        'pause' : !this.$store.getters.menuIsActive,
        'play' : this.$store.getters.menuIsActive
      }
    },
    showPauseIcon() {
      return this.$store.getters.showPauseIcon;
    }
  }
}
</script>

<style lang="scss">
</style>
