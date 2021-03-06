<template>
  <v-container id="map">
    <notification-card :clickAddress="clickAddress" />
    <yandex-map
      ref="mapRef"
      ymap-class="map-box"
      :coords="mapOptions.moscowCoords"
      :controls="mapOptions.controls"
      zoom="11"
      :scroll-zoom="mapOptions.scrollZoom"
      @map-was-initialized="onInitMap"
      @click="onClick"
    >
      <ymap-marker :coords="clickCoords" marker-id="yMarker" hind-container="hint" />
    </yandex-map>
    <area-selector />
  </v-container>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import AreaSelector from './area-selector.vue';
import NotificationCard from './notification-card.vue';
import { options } from '../store/constants/mapOptions';

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
      mapOptions: options,
      map: null,
      mkadPolygon: null,
      myRoute: null,
      straitRoute: null,
      clickCoords: [],
      clickAddress: '',
    };
  },
  watch: {
    selectedArea() {
      this.map.geoObjects.remove(this.mkadPolygon);
      this.createArea(this.coords);
    },
    clickAddress() {
      this.addClick();
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

      this.getclickAddress();
      this.createRoute(closestPoint, clickPoint);
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
              this.map.geoObjects.remove(this.myRoute).remove(this.straitRoute);
            }
            route.options.set('mapStateAutoApply', false);
            this.myRoute = route;
            this.straitRoute = new ymaps.Polyline([
              this.mkadPolygon.geometry.getClosest(clickPoint.geometry.getCoordinates()).position,
              clickPoint.geometry.getCoordinates(),
            ]);
            this.map.geoObjects.add(this.myRoute).add(this.straitRoute);
          },
          (err) => {
            throw err;
          },
          this,
        );
    },
    getclickAddress() {
      const getclickAddressByCoordinates = ymaps.geocode([
        this.clickCoords[0],
        this.clickCoords[1],
      ]);
      getclickAddressByCoordinates.then((res) => {
        this.clickAddress = res.geoObjects.get(0).properties.get('text');
      });
    },
    addClick() {
      if (this.clickAddress) {
        this.$store.commit('addClick', this.clickAddress);
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
