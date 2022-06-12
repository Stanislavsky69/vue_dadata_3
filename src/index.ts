import { PluginOptions } from "./types";
import { App, Plugin } from 'vue';
import DaDataComponent from './components/DaData.vue';

import './assets/styles.scss';

const plugin: Plugin = {
  install(app: App, options: PluginOptions) {
    app.config.globalProperties.$daDataNext = options;
    app.component((options && options.tag) || 'da-data-next', DaDataComponent);
  },
}
export { useDaData, CSS_CLASSES_DEFAULT } from './components/useDaData';
export { plugin as DaDataNextPlugin };
export const DaDataNext = DaDataComponent;
export default plugin;