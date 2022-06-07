import DaData from './components/DaData.vue';
import { PluginOptions } from "./types";
import { App } from 'vue';
import { dadataNextOptions } from './constants';

export default {
  install(app: App, options: PluginOptions) {
    app.provide(dadataNextOptions, options);
    app.component((options && options.tag) || 'da-data-next', DaData);
  },
};

export * from './types';
export * from './components/useDaData';
export const DaDataNext = DaData;
