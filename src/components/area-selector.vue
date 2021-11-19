<template>
  <v-select
    :items="areas"
    value="mkadCoords"
    class="area-select"
    label="Выберите область"
    solo
    @input="setArea"
  ></v-select>
</template>

<script>
export default {
  name: 'area-selector',
  data() {
    return {
      areas: [
        {
          text: 'MKAД',
          value: 'mkadCoords',
        },
        {
          text: 'Подмосковье',
          value: 'closestPodmoskovie',
        },
      ],
    };
  },
  methods: {
    setArea(value) {
      this.$store.commit('setArea', value);
    },
  },
};
</script>

<style>
.area-select {
  position: absolute;
  z-index: 999999;
  top: 30px;
  right: 160px;
  width: 320px;
}
</style>
