import {
    computed,
    ref,
    watch,
    toRaw,
    inject,
    onMounted,
  } from 'vue';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { debounce } from 'debounce';
import { merge } from 'lodash-es';

import { getCurrentInstance } from '../utils/getCurrentInstance';
import { 
    CssClasses,
    DaDataSuggestionAnyType,
    DaDataSuggestions,
    PluginOptions
} from '../types';

import { dadataNextOptions } from '../constants';


export const CSS_CLASSES_DEFAULT: CssClasses = {
    root: 'dadata',
    list: 'dadata__list',
    input: 'dadata__input',
    listEmpty: 'dadata__list_empty',
    row: 'dadata__list__row'
}

export const propsComponent = {
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
      default: () => ({}),
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
      type: Object,
      default: () => null,
    },
    debounce: {
       type: Number,
       default: 0
    },
    cssClasses: {
      type: Object,
      default: () => ({}),
    },
}

export const emitsComponent = ['update:modelValue', 'onSelected', 'focus', 'input'];

export const useDaData = () => {
    const { props, emit } = getCurrentInstance();
    const suggestions = ref<DaDataSuggestionAnyType[]>([]);
    const showList = ref<boolean>(false);
    const dadataDom = ref<HTMLInputElement | null>(null);

    const globalOptions = inject<PluginOptions>(dadataNextOptions);

    const token = computed(() => {
        if (props.token) return props.token;
        if (globalOptions && globalOptions.token) return globalOptions.token;

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
                data: { ...props.params, query: localValue.value },
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
   

    const search = debounce((success = (data: any) => data, error = () => ({})): void => {
        if(!params.value){
            error();
            throw 'vue-dadata-3: Не указаны параметры запроса';
        }

        axios(params.value).then((response: AxiosResponse<DaDataSuggestions>) => {
            if (response && response.data) {
                if (typeof response.data.suggestions !== 'undefined') {
                    suggestions.value = response.data.suggestions;
                    success(suggestions.value)
                } else {
                    error();
                    throw 'vue-dadata-3:Свойство suggestions не найдено';
                }
            }
        });

    }, props.debounce);

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