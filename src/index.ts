import { PluginOptions } from "./types";
import { App, Plugin } from 'vue';
import { default as DaDataNext } from './components/DaData.vue';

import './assets/styles.scss';

const plugin: Plugin = {
  install(app: App, options: PluginOptions) {
    app.config.globalProperties.$daDataNext = options;
    app.component((options && options.tag) || 'da-data-next', DaDataNext);
  },
}
export { useDaData } from './components/useDaData';
export { plugin as DaDataNextPlugin };
export default plugin;