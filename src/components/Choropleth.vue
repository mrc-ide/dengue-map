<template>
    <div v-if="loading && !features.length">loading..</div>
    <div v-else>
        <LMap ref="map" style="height: 800px; width: 100%" @ready="updateBounds">
            <LGeoJson v-for="feature in features"
                        ref="featureRefs"
                        :key="feature.properties.shapeID"
                        :geojson="feature"
                        :options="createTooltips"
                        :options-style="() => {return {...style, fillColor: getColour(feature)}}">
            </LGeoJson>
        </LMap>
    </div>
</template>    
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from '../stores/appStore';
import {GeoJSON, Layer, GeoJSONOptions} from "leaflet";
import {LGeoJson, LMap} from "@vue-leaflet/vue-leaflet";
import { Feature } from "geojson";

const { selectedGeojson, loading } = storeToRefs(useAppStore());

const map = ref<typeof LMap | null>(null);
const featureRefs = ref<typeof LGeoJson[]>([]);

// TODO: sort out GeoJson / feature types
const features = computed(() => {
    if (loading.value) {
        return [];
    }

    return Object.values(selectedGeojson.value).flatMap((geojson) => geojson.features);
});

const updateBounds = () => {
    if (!loading.value) {
        if (map.value && map.value.leafletObject) {
            map.value.leafletObject.fitBounds(features.value.map((f: Feature) => new GeoJSON(f).getBounds()) as any);
        }
    }
};

const tooltipForFeature = (feature: Feature) => feature.properties.shapeID;

const createTooltips = {
    onEachFeature: (feature: Feature, layer: Layer) => {
        //console.log("CREATING TOOLTIPS")
        //console.log(`layer: ${Object.keys(layer)}`)
        //layer.bindTooltip(tooltipForFeature(feature))
    }
};

const style = {
    className: "geojson"
};

const getColour = (feature) => {
    // TODO: map indicator value to colour in scale
    return "rgb(200,200,200)";
};

watch(featureRefs.value, () => {
    updateBounds();
});
</script>