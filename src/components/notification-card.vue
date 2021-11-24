<template>
  <transition name="slide-fade">
    <v-card v-if="show" class="notification-card" elevation="2" outlined shaped tile>
      <span>{{ clickAddress }}</span>
    </v-card>
  </transition>
</template>

<script>
export default {
  name: 'notification-card',
  props: {
    clickAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    clickAddress() {
      this.show = true;
      setTimeout(() => (this.show = false), 1000);
    },
  },
};
</script>

<style>
.notification-card {
  position: absolute !important;
  top: 10px;
  right: 30px;
  z-index: 999999;
  width: 300px;
  height: 140px;
  text-align: center;
  padding: 25px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
