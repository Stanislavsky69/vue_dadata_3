import {computed, onMounted, ref, toRaw} from "vue";
import axios, {AxiosRequestConfig} from "axios";
import {DaDataAddress, DaDataResult} from "../types";

export const useDaDataNext = (props, context) => {
  const token = computed(() => {
    if (props.token) return props.token;
    if (globalOptions && globalOptions.token) return globalOptions.token;
    return null;
  });
  const localValue = ref(props.modelValue);
  const suggestions = ref([]);
  const showList = ref(false);
  const dadataDom = ref(null);

  const url = computed(() => {
    if (props.apiUrl) {
      return props.apiUrl;
    }
    return `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${props.type}`;
  });
  const params = computed<AxiosRequestConfig | null>(() => {
    if (token.value) {
      return {
        method: 'POST',
        url: url.value,
        headers: {
          Authorization: `Token ${token.value}`,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: { ...props.params, query: localValue.value },
      };
    }
    return null;
  });

  onMounted((): void => {
    document.addEventListener('click', (event: Event): void => {
      if (dadataDom.value && !(dadataDom.value as Element).contains(event.target as HTMLElement)) {
        showList.value = false;
      }
    });
  });

  const search = (params: AxiosRequestConfig): void => {
    axios(params).then((response) => {
      if (response && response.data) {
        if (typeof response.data.suggestions !== 'undefined') {
          suggestions.value = response.data.suggestions;
          showList.value = suggestions.value.length > 0;
        } else {
          console.error('vue-dadata-3:Свойство suggestions не найдено');
        }
      }
    });
  };

  const onSelected = (data: DaDataResult<DaDataAddress>): void => {
    localValue.value = data.value;
    if (props.setInputValue && typeof props.setInputValue === 'function') {
      localValue.value = props.setInputValue(toRaw(data));
    }
    emit('onSelected', data);
    showList.value = false;
  };



  const prepareResults = (data: DaDataResult<DaDataAddress>, key: string | Record<string, string>): string | undefined => {
    let copyValue = data.value;
    if (!key) {
      console.error('vue-dadata-3: Укажите ключ в объекте');
      return;
    }
    if (typeof key === 'object') {
      const keyParent: string = Object.keys(key)[0];
      if (!(keyParent in data)) {
        console.error(`vue-dadata-3: ${keyParent} не найден в объекте dadata`);
        return;
      }
      const keyChild: string = key[keyParent];
      if (!(keyChild in data[keyParent])) {
        console.error(`vue-dadata-3: ${keyChild} не найден в объекте dadata`);
        return;
      }
      copyValue = data[keyParent][keyChild];
    } else {
      {
        if (!(key in data)) {
          console.error(`vue-dadata-3: ${key} не найден в объекте dadata`);
          return;
        }
        copyValue = data[key];
      }
    }
    if(localValue.value){
      const splitValue = localValue.value.split(' ');
      if (splitValue.length > 0) {
        splitValue.forEach((word) => {
          copyValue = copyValue.replace(word, `<span class="highlights">${word}</span>`);
        });
      }
    }
    return copyValue;
  };
  const onFocus = (event: Event): void => {
    showList.value = suggestions.value.length > 0;
    emit('focus', event);
  };
  const onInput = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    if(params.value){
      search(params.value);
    }
    emit('update:modelValue', value);
  }

  return {

  }
}
