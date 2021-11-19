<template>
  <v-container id="map">
    <area-selector />
    <notification-card :address="address" />
    <yandex-map
      ref="mapRef"
      ymap-class="map-box"
      :coords="moscowCoords"
      :controls="controls"
      zoom="11"
      :scroll-zoom="scrollZoom"
      @map-was-initialized="onInitMap"
      @click="onClick"
    >
      <ymap-marker :coords="clickCoords" marker-id="123" hind-container="hint" />
    </yandex-map>
  </v-container>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import AreaSelector from './area-selector.vue';
import NotificationCard from './notification-card.vue';

export default {
  name: 'Ymap',
  components: {
    yandexMap,
    ymapMarker,
    AreaSelector,
    NotificationCard,
  },
  data() {
    return {
      moscowCoords: [55.754458, 37.62137],
      clickCoords: [],
      controls: ['fullscreenControl', 'searchControl', 'zoomControl'],
      scrollZoom: false,
      map: null,
      mkadPolygon: null,
      myRoute: null,
      straitRoute: null,
      address: '',
    };
  },
  watch: {
    selectedArea() {
      this.map.geoObjects.remove(this.mkadPolygon);
      this.createArea(this.coords);
    },
  },
  computed: {
    coords() {
      return this.$store.getters[this.selectedArea];
    },
    selectedArea() {
      return this.$store.getters.selectedArea;
    },
  },
  methods: {
    onInitMap(map) {
      this.map = map;
      this.map.container.enterFullscreen();
      this.createArea(this.coords);
    },
    onClick(e) {
      this.clickCoords = e.get('coords');
      const clickPoint = new ymaps.Placemark(this.clickCoords);
      const closestPoint = this.mkadPolygon.geometry.getClosest(
        clickPoint.geometry.getCoordinates(),
      ).position;

      this.getAddress();
      this.createRoute(closestPoint, clickPoint);
      this.addClick();
    },
    createArea(coords) {
      this.mkadPolygon = new ymaps.Polygon([[...coords]], {
        hintContent: 'МКАД',
      });
      this.map.geoObjects.add(this.mkadPolygon);
    },
    createRoute(closest, clickPoint) {
      ymaps
        .route([this.clickCoords, closest], {
          multiRoute: false,
        })
        .done(
          (route) => {
            if (this.myRoute) {
              this.map.geoObjects.remove(this.myRoute);
              this.map.geoObjects.remove(this.straitRoute);
            }
            route.options.set('mapStateAutoApply', false);
            this.myRoute = route;
            this.straitRoute = new ymaps.Polyline(
              [
                this.mkadPolygon.geometry.getClosest(clickPoint.geometry.getCoordinates()).position,
                clickPoint.geometry.getCoordinates(),
              ],
              {
                hintContent: 'Ломаная',
              },
              {
                draggable: true,
                strokeColor: '#000000',
                strokeWidth: 2,
                strokeStyle: '0.5 3',
              },
            );
            this.map.geoObjects.add(this.myRoute);
            this.map.geoObjects.add(this.straitRoute);
          },
          (err) => {
            throw err;
          },
          this,
        );
    },
    getAddress() {
      const getaddressByCoordinates = ymaps.geocode([this.clickCoords[0], this.clickCoords[1]]);
      getaddressByCoordinates.then((res) => {
        this.address = res.geoObjects.get(0).properties.get('text');
      });
    },
    addClick() {
      if (this.address) {
        this.$store.commit('addClick', this.address);
      }
    },
  },
};
</script>

<style lang="scss">
.map-box {
  width: 100%;
  height: 100vh;
}

@media (min-width: 1264px) {
  .container {
    max-width: 100% !important;
    padding: 0 !important;
  }
}
</style>
