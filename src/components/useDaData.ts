import {
  computed,
  ref,
  watch,
  toRaw,
  onMounted,
  PropType,
} from 'vue';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { merge, debounce as _debounce } from 'lodash-es';
import type { DebounceSettings } from "lodash-es";

import { getCurrentInstance } from '../utils/getCurrentInstance';
import {
  CssClasses,
  DaDataAddressBounds,
  DaDataQueryData,
  DaDataSuggestionAnyType,
  DaDataSuggestions,
  ComposableDaData,
  LocationOptions,
} from '../types';


const DEBOUNCE_DEFAULT_SETTINGS: DebounceSettings = {
    leading: false,
    trailing: true
}


export const CSS_CLASSES_DEFAULT: CssClasses = {
    root: 'dadata',
    list: 'dadata__list',
    input: 'dadata__input',
    listEmpty: 'dadata__list_empty',
    row: 'dadata__list__row'
}

export const propsComponent = {
    modelValue: {
        type: String,
        required: true
    },
    token: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'address',
    },
    setInputValue: {
      type: Function as PropType<(item: DaDataSuggestionAnyType) => string>,
    },
    apiUrl: {
      type: String,
      default: null,
    },
    inputId: {
        type: String,
        default: null
    },
    inputName: {
      type: String,
      default: 'address',
    },
    placeholder: {
      type: String,
      default: null,
    },
    mergeParams: {
      type: Object as PropType<AxiosRequestConfig>,
      default: () => ({}),
    },
    debounceWait: {
       type: Number,
       default: 300,
    },
    debounceOptions: {
        type: Object as PropType<DebounceSettings>,
        default: () => ({})
    },
    cssClasses: {
      type: Object as PropType<CssClasses>,
      default: () => ({}),
    },
    locations: {
      type: Object as PropType<LocationOptions>,
      default: () => ({}),
    },
    fromBound: {
      type: String as PropType<DaDataAddressBounds>,
    },
    toBound: {
      type: String as PropType<DaDataAddressBounds>,
    },
}

export const emitsComponent = ['update:modelValue', 'onSelected', 'focus', 'input'];

export const useDaData = (): ComposableDaData => {
    const { props, emit, pluginSettings } = getCurrentInstance();
    const suggestions = ref<DaDataSuggestionAnyType[]>([]);
    const showList = ref<boolean>(false);
    const dadataDom = ref<HTMLElement | null>(null);
    const requestCache = new Map<string, DaDataSuggestionAnyType[]>();

    const token = computed(() => {
        if (props.token) return props.token;
        if(pluginSettings?.token) return pluginSettings.token;
        return null;
    });
    const localValue = computed({
        get(){
            return props.modelValue;
        },
        set(val: string){
            emit('update:modelValue', val);
        }
    });
    const computedCssClasses = computed<CssClasses>((): CssClasses => {
        return { ...CSS_CLASSES_DEFAULT, ...props.cssClasses }
    });
    const url = computed<string>((): string => {
        if (props.apiUrl) {
            return props.apiUrl;
        }

        return `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${props.type}`;
    });

    function makeRequestParams(url: string, token: string|null, query: string, data: Partial<DaDataQueryData> = {}, params: Record<string, any> = {}): AxiosRequestConfig<DaDataQueryData> {
      if (!token || !query.trim()) {
        return {};
      }

      return merge({
        method: 'POST',
        url: url,
        headers: {
          Authorization: `Token ${token}`,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: buildQueryData(data),
      }, params);
    }

    function buildQueryData(extra: Partial<DaDataQueryData> = {}): DaDataQueryData {
        const data: DaDataQueryData = {
            query: localValue.value,
            ...props.locations,
        };

        if (props.fromBound) {
            data['from_bound'] = {
                value: props.fromBound,
            };
        }

        if (props.toBound) {
            data['to_bound'] = {
                value: props.toBound,
            };
        }

        return merge(data, extra);
    }

    const bindCloseClickOutside = () => {
        document.addEventListener('click', (event: Event) => {
            if (dadataDom.value && !dadataDom.value.contains(event.target as HTMLElement)) {
                showList.value = false;
            }
        });
    }

    const prepareResults = (data: any, key: string): string => {
        let copyValue = data.value;

        if (!key) {
            console.error('vue-dadata-3: Укажите ключ в объекте');
            return '';
        }

        if (typeof key === 'object') {
            const keyParent = Object.keys(key)[0];

            if (!data[keyParent]) {
                console.error(`vue-dadata-3: ${keyParent} не найден в объекте dadata`);
                return '';
            }

            const keyChild = key[keyParent];

            if (!data[keyParent][keyChild]) {
                console.error(`vue-dadata-3: ${keyChild} не найден в объекте dadata`);
                return '';
            }

            copyValue = data[keyParent][keyChild];

        } else if (typeof key === 'string') {
            if (!data[key]) {
                console.error(`vue-dadata-3: ${key} не найден в объекте dadata`);
                return '';
            }

            copyValue = data[key];

        }
        const splitValue: string[] = localValue.value?.split(' ') || [];

        if (splitValue.length > 0) {
            splitValue.forEach((word) => {
                copyValue = copyValue.replace(word, `<span class="highlights">${word}</span>`);
            });
        }

        return copyValue;
    };

    function apiRequest(query: string, data: Partial<DaDataQueryData> = {}): Promise<DaDataSuggestionAnyType[]|undefined> {
      const params = makeRequestParams(url.value, token.value, query, data, props.mergeParams);

      return axios(params)
        .then((response: AxiosResponse<DaDataSuggestions>) => {
          if (response && response.data) {
            if (typeof response.data.suggestions !== 'undefined') {
              return response.data.suggestions;
            } else {
              console.error('vue-dadata-3: Свойство suggestions не найдено');
            }
          }
        });
    }

    function fixValue(): void {
      const query = localValue.value.trim();

      if (!query) {
        return;
      }

      if (requestCache.has(query)) {
        onSelected(requestCache.get(query)![0]);

        return;
      }

      apiRequest(query, {count: 1})
        .then(suggestions => {
          if (suggestions && suggestions[0]) {
            onSelected(suggestions[0]);
          }
        });
    }

    const search = _debounce(() => {
      const query = localValue.value.trim();

      if (requestCache.has(query)) {
        suggestions.value = requestCache.get(query)!;

        return;
      }

      apiRequest(localValue.value)
        .then(response => {
          if (response) {
            requestCache.set(query, response);
            suggestions.value = response;
          }
        })
    }, props.debounceWait, { ...DEBOUNCE_DEFAULT_SETTINGS, ...props.debounceOptions });

    const onSelected = (data: DaDataSuggestionAnyType): void => {
        localValue.value = data.value;

        if ('setInputValue' in props && typeof props.setInputValue === 'function') {
            localValue.value = props.setInputValue(toRaw(data));
        }

        emit('onSelected', data);

        showList.value = false;
    };
    const onFocus = (event: Event): void => {
        showList.value = true;

        if(localValue.value){
            search();
        }
        emit('focus', event);
    };

    const onInput = (event: Event): void => {
        showList.value = true;
        const val = (event.target as HTMLInputElement).value;

        if (val) {
            search();
        } else {
            suggestions.value = [];
        }

        emit('input', event);
    }

    onMounted(() => {
        bindCloseClickOutside();
    })

    watch(() => props.modelValue, () => {
         localValue.value = props.modelValue;
     });

    return {
        fixValue,
        search,
        onInput,
        onFocus,
        showList,
        localValue,
        prepareResults,
        computedCssClasses,
        onSelected,
        dadataDom,
        suggestions
    }
}
