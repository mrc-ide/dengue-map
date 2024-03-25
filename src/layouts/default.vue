<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list-item title="Indicators" subtitle="Select an indicator to view its data"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="name in indicatorNames" link 
                   :title="name"
                   :variant="name === selectedIndicator ? 'tonal' : 'plain'"
                   @click="selectedIndicator = name"></v-list-item>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>DengueMap</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../stores/appStore';

const drawer = ref(false);

const { initialiseData }  = useAppStore();
const { appConfig, selectedIndicator } = storeToRefs(useAppStore());

const indicatorNames = computed(() => appConfig.value ?  Object.keys(appConfig.value.indicators) : {});

initialiseData();
</script>
<style lang="scss">
// squash leaflet zoom controls on mobile..
.v-navigation-drawer {
    z-index: 9999 !important; 
}
</style>