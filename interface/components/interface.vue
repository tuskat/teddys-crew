<template>
  <div class='ui-container'>
    <button class='btn-close' v-on:click="resumeGame">X</button>

    <p>Pause Menu</p>
    <!-- Options -->
    <hr/>
    <p v-on:click="toggleSound">Sound : {{$store.state.sound}}</p>
    <p v-on:click="toggleShake">Camera-Shake : {{$store.state.shake}}</p>
    <button type='button' class='btn-default' tabindex="0" v-on:click="resumeGame" v-on:keyup.enter="resumeGame">Resume Game</button>
  </div>
</template>

<script>

export default {
  name: 'interface',
  components: {
  },

  methods: {
    toggleSound(event) {
      this.$store.dispatch('toggleSound');
    },
    toggleShake(event) {
      this.$store.dispatch('toggleShake');
    },
    resumeGame() {
      this.$store.dispatch('hideUI');
      window.dispatchEvent(new CustomEvent('resumeGame'));
    }
  }
}
</script>
