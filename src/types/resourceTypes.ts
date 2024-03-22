import { Feature } from "geojson";

export interface AppConfig {
    countries: string[]
}

export interface IndicatorValue {
    mean: number,
    sd: number
}

// Indicator values for a singe feature area - a dictionary of indicator ids to  values
export type FeatureIndicatorValues = Dict<IndicatorValue>;

// Indicator values for a level within a country -  a dictionary of feature ids to FeatureIndicatorValues
export type CountryLevelIndicators = Dict<FeatureIndicatorValues>;

// Indicator values for multiple levels within a country - a map of level numbers to CountryLevelIndicators
export type CountryIndicators = Record<number, CountryLevelIndicators>;

export interface Geojson {
    features: Feature[]
};

// Geojson for multiple levels within a country - a map of level numbers to Geojson
export type CountryGeojson = Record<number, Geojson>;