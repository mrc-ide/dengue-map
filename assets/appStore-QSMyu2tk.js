import{as as a}from"./index-DKn1qql2.js";const i=async t=>await(await fetch(`resources/${t}`)).json(),c=async()=>await i("config.json"),l=async(t,s)=>await i(`indicators/indicators-${t}-ADM${s}.json`),r=async(t,s)=>await i(`geojson/geoBoundaries-${t}-ADM${s}_simplified.geojson`),g=a("app",{state:()=>({loading:!0,appConfig:null,selectedCountryLevels:null,allIndicators:{},allGeojson:{},selectedIndicator:""}),getters:{selectedIndicators:t=>{const{selectedCountryLevels:s,allIndicators:e}=t;if(!s||!Object.keys(e).length)return null;const n={};return Object.keys(s).forEach(o=>{o in e&&(n[o]=e[o][s[o]])}),n},selectedGeojson:t=>{const{selectedCountryLevels:s,allGeojson:e}=t;if(!s||!Object.keys(e).length)return null;const n={};return Object.keys(s).forEach(o=>{o in e&&(n[o]=e[o][s[o]])}),n}},actions:{async initialiseData(){this.appConfig=await c(),this.selectedCountryLevels=Object.fromEntries(this.appConfig.countries.map(e=>[e,1]));const t={},s={};for(const e of this.appConfig.countries){(!(e in t)||!(e in s))&&(t[e]={},s[e]={});const n=this.selectedCountryLevels[e];(!(n in t[e])||!(n in s[e]))&&(t[e][n]=await l(e,n),s[e][n]=await r(e,n))}this.selectedIndicator=Object.keys(this.appConfig.indicators)[0],console.log(`selected ind is ${this.selectedIndicator}`),Object.assign(this.allIndicators,t),Object.assign(this.allGeojson,s),this.loading=!1}}});export{g as u};
