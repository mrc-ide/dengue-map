<template>
    <div v-if="loading && !features.length">loading..</div>
    <div v-else>
        <LMap ref="map" style="height: 800px; width: 100%" @ready="updateBounds">
            <LGeoJson v-for="feature in features"
                        ref="featureRefs"
                        :key="featureId(feature)"
                        :geojson="feature"
                        :options="createTooltips"
                        :options-style="() => {return {...style, fillColor: getColour(feature)}}">
            </LGeoJson>
        </LMap>
    </div>
</template>    
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from '../stores/appStore';
import {GeoJSON, Layer, GeoJSONOptions} from "leaflet";
import {LGeoJson, LMap} from "@vue-leaflet/vue-leaflet";
import { Feature } from "geojson";

const { selectedGeojson, loading } = storeToRefs(useAppStore());

const FEATURE_ID_PROP = "shapeISO";

const map = ref<typeof LMap | null>(null);
const featureRefs = ref<typeof LGeoJson[]>([]);

// TODO: sort out GeoJson / feature types
const features = computed(() => {
    if (loading.value) {
        return [];
    }

    return Object.values(selectedGeojson.value).flatMap((geojson) => geojson.features);
});

const featureId = (feature: Feature) => feature.properties!![FEATURE_ID_PROP];

const updateBounds = () => {
    if (!loading.value) {
        if (map.value && map.value.leafletObject) {
            map.value.leafletObject.fitBounds(features.value.map((f: Feature) => new GeoJSON(f).getBounds()) as any);
        }
    }
};

const tooltipForFeature = (feature: Feature) => {
    return `<div>FeatureId: ${featureId(feature)}</div>`;
};

const createTooltips = {
    onEachFeature: (feature: Feature, layer: Layer) => {
        layer.bindTooltip(tooltipForFeature(feature)).openTooltip();
    }
};

const updateMap = () => {
    // TODO: update colour scales
    updateTooltips();
}

const updateTooltips = () => {
    // TODO: can we simplify this?
    features.value.forEach((feature: Feature) => {       
        const geojson = featureRefs.value.find(f => featureId(f.geojson) === featureId(feature))
        if (geojson && geojson.geojson && geojson.leafletObject) {
            geojson.leafletObject.eachLayer((layer: Layer) => {
                layer.setTooltipContent(tooltipForFeature(feature));
            })
        }      
    })
};

const style = {
    className: "geojson"
};

const getColour = (feature) => {
    // TODO: map indicator value to colour in scale
    return "rgb(200,200,200)";
};

watch(featureRefs, () => {
    updateBounds();
    updateMap();
});

watch(features, () => {
    updateMap();
})
</script>