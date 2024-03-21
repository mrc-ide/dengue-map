<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { useAppStore } from '../stores/appStore';

const { initialiseData } = useAppStore();
initialiseData();
</script>
