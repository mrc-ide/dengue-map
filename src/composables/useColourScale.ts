import { AppConfig, Ref, computed } from "vue";
import { FeatureIndicatorValues, IndicatorValue } from "../resourceTypes";
import { useAppStore } from "../stores/appStore";
import { storeToRefs } from "pinia";
import * as d3ScaleChromatic from "d3-scale-chromatic";

interface IndicatorRange {
    min: number,
    max: number,
    range: number
}

export const useColourScale = (selectedIndicators: Ref<Dict<FeatureIndicatorValues>>) => {
    // TODO: we currently just scale colours to min and max in data, but
    // we can also provide option to scale to config- or user-provided
    // values
    const appConfig: Ref<null | AppConfig> = storeToRefs(useAppStore()).appConfig;

    const colourScales = computed(() => {
        const result = {};
        if (appConfig.value) {
            const indicators = appConfig.value.indicators;
            Object.keys(indicators).forEach((key) => {
                const scaleName = indicators[key].colourScale?.name || "interpolateGreens";
                result[key] = (d3ScaleChromatic as any)[scaleName];
            });
        }
        return result;
    });

    const indicatorExtremes = computed((): Dict<IndicatorRange> => {
        const result = {};
        const allValues = Object.values(selectedIndicators.value);
        allValues.forEach((featureValues: FeatureIndicatorValues) => {
            Object.entries(featureValues).forEach(([indicator, indicatorValue]) => {
                const value = (indicatorValue as IndicatorValue).mean;
                if (!(indicator in result)) {
                    result[indicator] = { min: value, max: value };
                } else {
                    if (value > result[indicator].max) {
                        result[indicator].max = value;
                    } else if (value < result[indicator].min) {
                        result[indicator].min = value
                    }
                }
            });
        });
        Object.keys(result).forEach((key) => {
            const indicatorRange = result[key];
            indicatorRange.range = (indicatorRange.max != indicatorRange.min) ? //Avoid dividing by zero if only one value...
                                indicatorRange.max - indicatorRange.min :
                                1;
        });
        return result;
    });

    const getColour = (indicator: string, featureIndicators: FeatureIndicatorValues) => {
        const value = featureIndicators[indicator].mean;

        if (!indicatorExtremes.value || !colourScales.value) {
            return "rgb(200, 200, 200)";
        }

        const range = indicatorExtremes.value[indicator];

        let colorValue = (value - range.min) / range.range;
        if (colorValue > 1) {
            colorValue = 1;
        }
        if (colorValue < 0) {
            colorValue = 0;
        }

        const scale = colourScales.value[indicator];
        return scale(colorValue);
    };

    return {
        colourScales,
        getColour
    }
};
