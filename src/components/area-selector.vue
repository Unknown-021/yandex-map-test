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
          value: 'podmoskovieCoords',
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
  position: absolute !important;
  z-index: 999999;
  top: 43px;
  width: 314px;
  margin-left: 10px !important;
}
</style>
