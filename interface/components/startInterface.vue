<template>
  <div class="ui-container" v-if="show">
    <p>Menu</p>
    <!-- Options -->
    <hr />
    <p v-on:click="toggleCharacter">Character : {{$store.state.character}}</p>
    <p v-on:click="toggleMode">Mode : {{$store.state.gameMode}}</p>
    <button
      type="button"
      class="btn-default"
      tabindex="0"
      v-on:click="startGame"
      v-on:keyup.enter="startGame"
    >Start Game</button>
  </div>
</template>

<script>
export default {
  name: "startInterface",
  data: () => {
    return {
      gameModeIndex: 0,
      characterIndex: 0,
      gameModeList: ["Survival", "Debug"],
      characterList: ["Torb", "Ors"]
    };
  },

  components: {},

  computed: {
    show() {
      return this.$store.getters.showStartMenu;
    }
  },

  methods: {
    toggleCharacter(event) {
      this.characterIndex++;
      if (this.characterIndex >= this.characterList.length) {
        this.characterIndex = 0;
      }
      this.$store.dispatch(
        "toggleCharacter",
        this.characterList[this.characterIndex]
      );
    },

    toggleMode(event) {
      this.gameModeIndex++;
      if (this.gameModeIndex >= this.gameModeList.length) {
        this.gameModeIndex = 0;
      }
      this.$store.dispatch("toggleMode", this.gameModeList[this.gameModeIndex]);
    },

    startGame() {
      this.$store.dispatch('hideUI');
      window.dispatchEvent(new CustomEvent("startGame"));
    }
  }
};
</script>
