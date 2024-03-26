<template>
  <v-app>
    <v-app-bar :absolute="true">
      <v-app-bar-title>{{ appConfig?.title }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <div class="sticky-footer">
      <v-btn v-for="name in indicatorNames" link
                   class="floating-btn mr-2"
                   :class="name === selectedIndicator ? 'bg-blue' : 'bg-black'"
                   rounded="xl"
                   @click="selectedIndicator = name">{{ name }}</v-btn>
    </div>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../stores/appStore';

// TODO: Indicators floating in footer as options rather than nav drawer
// TODO: Excel and image download also as footer option in footer rhs
// TODO: Make preselected regions available as zoom regions - tick state, select bounding box of all selected + selected countries
// TODO: auto zoom to selected countries on click (if haven't previously selected region?)

const drawer = ref(null);

const { initialiseData }  = useAppStore();
const { appConfig, selectedIndicator } = storeToRefs(useAppStore());

const indicatorNames = computed(() => appConfig.value ?  Object.keys(appConfig.value.indicators) : {});

initialiseData();
watch(appConfig, () => {
  window.document.title = appConfig.value.title;
});

</script>
<style lang="scss">
.sticky-footer {
  position: fixed;
  bottom: 1rem;
  left: 2rem;
  background-color: rgba(0,0,0,0);
  z-index: 999;
}
</style>
