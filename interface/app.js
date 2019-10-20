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
    loading: false,
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
    setLoading (state, loading) {
      state.loading = loading;
    },
    setPause (state, pause) {
      state.pause = pause;
    },
    setScene (state, scene) {
      state.scene = scene;
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
      window.dispatchEvent(new CustomEvent('soundChanged', {detail: { sound: this.state.sound}}));
    },
    toggleShake(context) {
      context.commit('toggleShake');
      window.dispatchEvent(new CustomEvent('shakeChanged', {detail: { shake: this.state.shake}}));
    },
    setScene(context, scene) {
      context.commit('setScene', scene);
    }
  },
  getters: {
    menuIsActive: state => {
      return state.pause || state.loading;
    },
    showPauseIcon: state => {
      return state.scene === 'game';
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
