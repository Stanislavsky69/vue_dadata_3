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
    DaDataSuggestionAnyType,
    DaDataSuggestions,
    ComposableDaData
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
    margeParams: {
      type: Object as PropType<AxiosRequestConfig>,
      default: () => ({}),
    },
    debounceWait: {
       type: Number,
       default: 0
    },
    debounceOptions: {
        type: Object as PropType<DebounceSettings>,
        default: () => ({})
    },
    cssClasses: {
      type: Object as PropType<CssClasses>,
      default: () => ({}),
    },
}

export const emitsComponent = ['update:modelValue', 'onSelected', 'focus', 'input'];

export const useDaData = (): ComposableDaData => {
    const { props, emit, pluginSettings } = getCurrentInstance();
    const suggestions = ref<DaDataSuggestionAnyType[]>([]);
    const showList = ref<boolean>(false);
    const dadataDom = ref<HTMLElement | null>(null);

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
    const params = computed<AxiosRequestConfig>((): AxiosRequestConfig => {
        if (token.value) {
            return merge({
                method: 'POST',
                url: url.value,
                headers: {
                    Authorization: `Token ${token.value}`,
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
                data: { query: localValue.value },
            }, props.mergeParams);
        }

        return {};
    });

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
            console.error('vue-dadata-3: ?????????????? ???????? ?? ??????????????');
            return '';
        }

        if (typeof key === 'object') {
            const keyParent = Object.keys(key)[0];

            if (!data[keyParent]) {
                console.error(`vue-dadata-3: ${keyParent} ???? ???????????? ?? ?????????????? dadata`);
                return '';
            }

            const keyChild = key[keyParent];

            if (!data[keyParent][keyChild]) {
                console.error(`vue-dadata-3: ${keyChild} ???? ???????????? ?? ?????????????? dadata`);
                return '';
            }

            copyValue = data[keyParent][keyChild];

        } else if (typeof key === 'string') {
            if (!data[key]) {
                console.error(`vue-dadata-3: ${key} ???? ???????????? ?? ?????????????? dadata`);
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
   

    const search = _debounce((success = (data: any) => data, error = () => ({})): void => {
        if(!params.value){
            error();
            throw 'vue-dadata-3: ???? ?????????????? ?????????????????? ??????????????';
        }

        axios(params.value).then((response: AxiosResponse<DaDataSuggestions>) => {
            if (response && response.data) {
                if (typeof response.data.suggestions !== 'undefined') {
                    suggestions.value = response.data.suggestions;
                    success(suggestions.value)
                } else {
                    error();
                    throw 'vue-dadata-3:???????????????? suggestions ???? ??????????????';
                }
            }
        });

    }, props.debounceWait, { ...DEBOUNCE_DEFAULT_SETTINGS, ...props.debounceOptions });

    const onSelected = (data: any): void => {
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