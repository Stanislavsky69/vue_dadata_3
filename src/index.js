import DaData from './components/DaData.vue';

export default {
  install(app, options) {
    app.provide('da-data-next-options', options);
    app.component((options && options.tag) || 'da-data-next', DaData);
  },
};

export const DaDataNext = DaData;
