import DaData from './components/DaData.vue';
import { PluginOptions } from "./types";
import { App } from 'vue'

export default {
  install(app: App, options: PluginOptions) {
    app.provide('da-data-next-options', options);
    app.component((options && options.tag) || 'da-data-next', DaData);
  },
};

export const DaDataNext = DaData;
