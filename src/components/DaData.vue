<template>
  <div class="dadata" ref="dadataDom">
    <input
      type="text"
      :name="inputName"
      @focus="onFocus"
      class="dadata__input"
      :placeholder="placeholder"
      v-model="localValue"
    >
    <da-data-list v-if="showList"
                  :class="{ [`${cssClasses.listEmpty}`] : suggestions.length === 0}"
                  :css-class="cssClasses.list">
      <da-data-list-row :css-class="cssClasses.row" v-for="(item, index) of suggestions"
        @click="onSelected(item)"
        :key="index"
      >
        <slot name="list-item" :prop="item" :prepare-value="prepareResults">
         <span v-html="prepareResults(item, 'value')"></span>
        </slot>
      </da-data-list-row>
    </da-data-list>
  </div>
</template>
<script>
import {
  computed,
  ref,
  watch,
  toRaw,
  inject,
  toRefs,
  onMounted,
  defineComponent,
} from 'vue';
import axios from 'axios';
import DaDataList from './DaDataList.vue';
import DaDataListRow from './DaDataListRow.vue';

export default defineComponent({
  components: {
    DaDataListRow,
    DaDataList,
  },
  emits: ['update:modelValue', 'onSelected'],
  props: {
    modelValue: String,
    token: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'address',
    },
    params: {
      type: Object,
      default: () => {},
    },
    setInputValue: {
      type: Function,
    },
    apiUrl: {
      type: String,
      default: null,
    },
    inputName: {
      type: String,
      default: 'address',
    },
    placeholder: {
      type: String,
      default: null,
    },
    customParams: {
      type: Object,
      default: () => null,
    },
    cssClasses: {
      type: Object,
      default: () => ({
        root: 'dadata',
        list: 'dadata__list',
        listEmpty: 'dadata__list_empty',
        row: 'dadata__list__row',
      }),
    },
  },
  setup(props, { emit }) {
    const globalOptions = inject('da-data-next-options');
    const {
      token, modelValue, apiUrl, type, customParams, params,
    } = toRefs(props);
    const tokenLocal = computed(() => {
      if (token.value) return token.value;
      if (globalOptions && globalOptions.token) return globalOptions.token;
      return null;
    });
    const localValue = ref(modelValue.value);
    const suggestions = ref([]);
    const showList = ref(false);
    const dadataDom = ref(null);

    const url = computed(() => {
      if (apiUrl.value) {
        return apiUrl.value;
      }
      return `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${type.value}`;
    });
    const paramsLocal = computed(() => {
      if (customParams.value) return customParams.value;
      if (tokenLocal.value) {
        return {
          method: 'POST',
          url: url.value,
          headers: {
            Authorization: `Token ${tokenLocal.value}`,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          data: { ...params.value, query: localValue.value },
        };
      }
      return null;
    });

    onMounted(() => {
      document.addEventListener('click', (event) => {
        if (dadataDom.value && !dadataDom.value.contains(event.target)) {
          showList.value = false;
        }
      });
    });

    const search = () => {
      if (!paramsLocal.value) return;
      axios(paramsLocal.value).then((response) => {
        if (response && response.data) {
          if (typeof response.data.suggestions !== 'undefined') {
            suggestions.value = response.data.suggestions;
          } else {
            console.error('vue-dadata-3:Свойство suggestions не найдено');
          }
        }
      });
    };

    const onSelected = (data) => {
      localValue.value = data.value;
      if (props.setInputValue && typeof props.setInputValue === 'function') {
        localValue.value = props.setInputValue(toRaw(data));
      }
      emit('onSelected', data);
      showList.value = false;
    };

    const onFocus = () => {
      showList.value = true;
      if (localValue.value) {
        search();
      }
    };

    const prepareResults = (data, key) => {
      let copyValue = data.value;
      if (!key) {
        console.error('vue-dadata-3: Укажите ключ в объекте');
        return;
      }
      if (typeof key === 'object') {
        const keyParent = Object.keys(key)[0];
        if (!data[keyParent]) {
          console.error(`vue-dadata-3: ${keyParent} не найден в объекте dadata`);
          return;
        }
        const keyChild = key[keyParent];
        if (!data[keyParent][keyChild]) {
          console.error(`vue-dadata-3: ${keyChild} не найден в объекте dadata`);
          return;
        }
        copyValue = data[keyParent][keyChild];
      } else if (typeof key === 'string') {
        if (!data[key]) {
          console.error(`vue-dadata-3: ${key} не найден в объекте dadata`);
          return;
        }
        copyValue = data[key];
      }
      const splitValue = localValue.value && localValue.value.split(' ');
      if (splitValue.length > 0) {
        splitValue.forEach((word) => {
          copyValue = copyValue.replace(word, `<span class="highlights">${word}</span>`);
        });
      }
      // eslint-disable-next-line consistent-return
      return copyValue;
    };

    watch(() => localValue.value, (val) => {
      emit('update:modelValue', val);
      if (val) {
        search();
      } else {
        showList.value = false;
        suggestions.value = [];
      }
    });
    return {
      onFocus,
      onSelected,
      prepareResults,
      showList,
      localValue,
      suggestions,
    };
  },
});
</script>
