<template>
  <div class='ui-container'>
    <p>Pause Menu</p>
    <!-- Options -->
    <hr/>
    <p v-on:click="sound = !sound">Sound : {{sound}}</p>
    <p v-on:click="shake = !shake">Camera-Shake : {{shake}}</p>
    <button type='button' class='btn-default' tabindex="0" v-on:click="resumeGame" v-on:keyup.enter="resumeGame">resume game</button>
  </div>
</template>

<script>

export default {
  name: 'interface',
  components: {
  },
  data: function () {
    return {
      isActive: false,
      sound: true,
      shake: true
    }
  },

  methods: {
    resumeGame() {
      this.isActive = false;
       window.dispatchEvent(new CustomEvent('resumeGame', { detail: { shake: this.shake, sound: this.sound }}));
    }
  }
}
</script>
