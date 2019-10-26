import Vue from 'vue';
import Vuex from 'vuex';
import uiWrapper from './uiWrapper.vue';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state: {
    sound: true,
    shake: true,
    pause: false,
    menu: true,
    loading: true,
    gameMode: 'Survival',
    character: 'Torb',
    scene: 'menu',
  },
  mutations: {
    toggleSound (state) {
      state.sound = !state.sound;
    },
    toggleShake (state) {
      state.shake = !state.shake;
    },
    togglePause (state) {
      state.pause = !state.pause;
    },
    toggleLoading (state) {
      state.loading = !state.loading;
    },
    setLoading (state, newValue) {
      state.loading = newValue;
    },
    setPause (state, newValue) {
      state.pause = newValue;
    },
    setScene (state, newValue) {
      state.scene = newValue;
    },
    setCharacter (state, newValue) {
      state.character = newValue;
    },
    setGameMode (state, newValue) {
      state.gameMode = newValue;
    }
  },
  actions: {
    showLoading(context) {
      context.commit('setLoading', true);
    },
    hideLoading(context) {
      context.commit('setLoading', false);
    },
    showUI(context) {
      context.commit('setPause', true);
    },
    hideUI(context) {
      context.commit('setPause', false);
    },
    toggleSound(context) {
      context.commit('toggleSound');
      window.dispatchEvent(new CustomEvent('soundChanged', {detail: { newValue: this.state.sound}}));
    },
    toggleShake(context) {
      context.commit('toggleShake');
      window.dispatchEvent(new CustomEvent('shakeChanged', {detail: { newValue: this.state.shake}}));
    },
    toggleCharacter(context, newValue) {
      context.commit('setCharacter', newValue);
      window.dispatchEvent(new CustomEvent('characterChanged', {detail: { newValue: this.state.character}}));
    },
    toggleMode(context, newValue) {
      context.commit('setGameMode', newValue);
      window.dispatchEvent(new CustomEvent('gameModeChanged', {detail: { newValue: this.state.gameMode}}));
    },
    setScene(context, newValue) {
      context.commit('setScene', newValue);
    }
  },
  getters: {
    menuIsActive: (state, getters) => {
      if (state.loading) {
        return false;
      }
      return getters.showPauseMenu || getters.showStartMenu;
    },
    showPauseIcon: state => {
      return state.scene === 'game';
    },
    showPauseMenu: state => {
      return state.pause === true;
    },
    showStartMenu: state => {
      return state.scene === 'menu';
    }
  }
})
  

let app = new Vue({
  el: '#app',
  name: 'app',
  store,
  components: {
    uiWrapper
  },
})
