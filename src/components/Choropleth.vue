<template>
    <!--<l-map ref="map" style="height: 800px; width: 100%" @ready="updateBounds">
        <l-geo-json v-for="feature in currentFeatures"
                    ref="featureRefs"
                    :key="feature.properties.area_id"
                    :geojson="feature"
                    :options="createTooltips"
                    :options-style="() => {return {...style, fillColor: getColour(feature)}}">
        </l-geo-json>
    </l-map>-->
    <div v-if="loading">loading..</div>
    <div v-else>{{ JSON.stringify(selectedGeojson) }}</div>
</template>    
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from '../stores/appStore';

const { selectedGeojson, loading } = storeToRefs(useAppStore());  
</script>