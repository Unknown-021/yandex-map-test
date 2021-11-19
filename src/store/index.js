import Vue from 'vue';
import Vuex from 'vuex';
import { mkadCoords, closestPodmoskovie } from './coords/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mkadCoords,
    closestPodmoskovie,
    selectedArea: 'mkadCoords',
    clicks: [],
  },
  getters: {
    mkadCoords: (state) => state.mkadCoords,
    closestPodmoskovie: (state) => state.closestPodmoskovie,
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
