import Vue from 'vue';
import Vuex from 'vuex';
import { mkadCoords, podmoskovieCoords } from './constants/coordinates';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mkadCoords,
    podmoskovieCoords,
    selectedArea: 'mkadCoords',
    clicks: [],
  },
  getters: {
    mkadCoords: (state) => state.mkadCoords,
    podmoskovieCoords: (state) => state.podmoskovieCoords,
    selectedArea: (state) => state.selectedArea,
  },
  mutations: {
    setArea(state, data) {
      state.selectedArea = data;
    },
    addClick(state, data) {
      state.clicks.push(data);
    },
  },
});
