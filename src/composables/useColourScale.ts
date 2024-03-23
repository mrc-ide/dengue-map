import { Ref, computed } from "vue";
import { FeatureIndicatorValues, IndicatorValue } from "../types/resourceTypes";

interface Extreme {
    min: number,
    max: number
}

export const useColourScale = (selectedIndicators: Ref<Dict<FeatureIndicatorValues>>) => {
    // TODO: we currently just scale colours to min and max in data, but
    // we can also provide option to scale to config- or user-provided
    // values

    const indicatorExtremes = computed((): Dict<Extreme> => {
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
        return result;
    });

    const getColour = (indicator: string, value: number) => {

    };

    return {
        indicatorExtremes,
        getColour
    }
};