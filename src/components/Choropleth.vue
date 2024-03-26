<template>
    <div v-if="initialising">loading..</div>
    <div v-else>
        <LMap ref="map" style="height: 100vh; width: 100%" @ready="updateBounds">
            <LTileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></LTileLayer>
            <LGeoJson v-for="f in featuresWithColours"
                        ref="featureRefs"
                        :key="featureId(f.feature)"
                        :geojson="f.feature"
                        :options="createTooltips"
                        :options-style="() => {return {...style, fillColor: f.colour}}">
            </LGeoJson>
        </LMap>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from '../stores/appStore';
import {GeoJSON, Layer} from "leaflet";
import {LGeoJson, LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import { Feature } from "geojson";
import { useColourScale } from "../composables/useColourScale";

const { selectedGeojson, selectedIndicators, loading, selectedIndicator } = storeToRefs(useAppStore());

const FEATURE_ID_PROP = "shapeISO";
const FEATURE_NAME_PROP = "shapeName";

const map = ref<typeof LMap | null>(null);
const featureRefs = ref<typeof LGeoJson[]>([]);

interface FeatureWithColour {
    feature: Feature,
    colour: string
}

// TODO: Use a simpler background layer

// TODO: we're currently just flattening features and indicators from the store,
// but we may want to deal with them at country level in future.
// This structure is an inefficient way to get reactivity working, but we can probably do better!
const featuresWithColours = computed(() => {
    if (loading.value) {
        return [];
    }
    const selectedInd = selectedIndicator.value;
    return Object.values(selectedGeojson.value).flatMap((geojson) => geojson.features.map((feature) => {
      return {
        feature,
        colour: getColourForFeature(feature, selectedInd)
      }
    }));
});

const indicators = computed(() => {
    if (loading.value) {
        return {};
    }
    const allFeatureIndicators = Object.values(selectedIndicators.value);
    const result = Object.assign({}, ...allFeatureIndicators);
    return result;
});

const { colourScales, getColour } = useColourScale(indicators);


const featureId = (feature: Feature) => feature.properties!![FEATURE_ID_PROP];
const featureName = (feature: Feature) => feature.properties!![FEATURE_NAME_PROP];

const updateBounds = () => {
    if (!loading.value) {
        if (map.value && map.value.leafletObject) {
            map.value.leafletObject.fitBounds(featuresWithColours.value.map((f: FeatureWithColour) => new GeoJSON(f.feature).getBounds()) as any);
        }
    }
};

const initialising = computed(() => {
    return loading.value && !featuresWithColours.value.length && !indicators.value.length && !Object.keys(colourScales.value).length;
});

const getColourForFeature = (feature, indicator) => {
    console.log("recomputing getColourForFeature")
    const featureIndicators = indicators.value[featureId(feature)];
    return getColour(indicator, featureIndicators);
};

// TODO: pull out tooltips stuff into composable when fully implement
// TODO: configure friendly indicator names
// TODO: format values
// TODO: include country name (?)
// TODO: put selected indicator first
const tooltipForFeature = (feature: Feature) => {
    let indicatorValues = "";
    const fid = featureId(feature);
    if (fid in indicators.value) {
        const featureValues = indicators.value[fid];
        indicatorValues = Object.keys(featureValues).map((key) => {
            return `${key}: ${featureValues[key].mean} (+/- ${featureValues[key].sd})<br/>`;
        }).join("");
    }
    const name = featureName(feature) || featureId(feature);
    return `<div><strong>${name}</strong></div><div>${indicatorValues}</div>`;
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
    featuresWithColours.value.forEach((f: FeatureWithColour) => {
        const geojson = featureRefs.value.find(f => featureId(f.geojson) === featureId(f.feature))
        if (geojson && geojson.geojson && geojson.leafletObject) {
            geojson.leafletObject.eachLayer((layer: Layer) => {
                layer.setTooltipContent(tooltipForFeature(f.feature));
            })
        }
    })
};

const style = {
    className: "geojson"
};

watch([selectedGeojson, selectedIndicators], () => {
    updateBounds();
    updateMap();
})
</script>
