import { Feature } from "geojson";

export interface IndicatorConfig {
    colourScale: {
        name: string
    }
}

export interface AppConfig {
    title: string,
    countries: string[],
    indicators: Dict<IndicatorConfig>
}

export interface IndicatorValue {
    mean: number,
    sd: number
}

// Indicator values for a singe feature area - a dictionary of indicator ids to  values
export type FeatureIndicatorValues = Dict<IndicatorValue>;

export interface Geojson {
    features: Feature[]
};

// Dictionary of feature ids to indicator values
export type FeatureIndicators = Dict<FeatureIndicatorValues>;

