import { AppConfig, CountryLevelIndicators, Geojson } from "../types/resourceTypes";

const getResource = async (path: string) => {
    console.log("Loading resource: " + path);
    const res = await fetch(`resources/${path}`);
    const status = await res.status;
    console.log("status: " + status)
    const json = await res.json();
    console.log("Loaded: " + JSON.stringify(json));
    return json;
}; 

export const getAppConfig = async () => {
    return await getResource("config.json") as AppConfig;
};

export const getIndicators = async (country: string, level: number) => {
    return await getResource(`indicators/indicators-${country}-ADM${level}.json`) as CountryLevelIndicators;
};

export const getGeojson = async (country: string, level: number) => {
    return await getResource(`geojson/geoBoundaries-${country}-ADM${level}_simplified.geojson`) as Geojson;
};