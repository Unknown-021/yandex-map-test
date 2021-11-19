import YmapPlugin from 'vue-yandex-maps';
import Vue from 'vue';
import settings from './services/yandex-map-config';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(YmapPlugin, settings);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
