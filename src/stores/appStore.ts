import { defineStore } from "pinia";
import { getAppConfig, getGeojson, getIndicators } from "../resources/utils";
import { AppConfig, CountryGeojson, CountryIndicators, CountryLevelIndicators, Geojson } from "../types/resourceTypes";
import { Ref, ref } from "vue";

export const useAppStore = defineStore('app', {
    state: () => {
        const loading = true;
        const appConfig: AppConfig | null = null;
        const selectedCountryLevels: Dict<number> | null = null;

        // Data by country
        const allIndicators: Dict<CountryIndicators> = {};
        const allGeojson: Dict<CountryGeojson> = {};
        
        return {
            loading,
            appConfig,
            selectedCountryLevels,
            allIndicators,
            allGeojson
        }
    },
    getters: {
        selectedIndicators: (state): Dict<CountryLevelIndicators> | null => {
            const {selectedCountryLevels, allIndicators} = state;
            if (!selectedCountryLevels || !Object.keys(allIndicators).length) return null;
            const result = {};
            // TODO: handle incomplete data
            Object.keys(selectedCountryLevels).forEach((country) => {
                if (country in allIndicators) {
                    result[country] = allIndicators[country][selectedCountryLevels[country]!!];
                }    
            });
            return result;
        },
        selectedGeojson: (state): Dict<Geojson> | null => {
            const { selectedCountryLevels, allGeojson } = state;
            if (!selectedCountryLevels || !Object.keys(allGeojson).length) return null;
            const result = {};
            // TODO: handle incompelte data
            Object.keys(selectedCountryLevels).forEach((country) => {
                if (country in allGeojson) {
                    result[country] = allGeojson[country]!![selectedCountryLevels[country]!!];
                }
            });
            return result;
        }
    },
    actions: {
        async initialiseData() {
            this.appConfig = await getAppConfig();
            this.selectedCountryLevels = Object.fromEntries(this.appConfig.countries.map(country => [country, 1]));

            // TODO: Later we will use the same logic to lazy load indicator and geojson when country level selections change
            for (const country of this.appConfig.countries) {
                if (!(country in this.allIndicators) || !(country in this.allGeojson)) {
                    this.allIndicators[country] = {};
                    this.allGeojson[country] = {};
                }
              
                const level = this.selectedCountryLevels[country];
                if (!(level in this.allIndicators[country]) || !(level in this.allGeojson[country])) {
                    this.allIndicators[country]!![level] = await getIndicators(country, level);
                    this.allGeojson[country]!![level] = await getGeojson(country, level);
                }
          }
          this.loading = false;
      }
    }
})
