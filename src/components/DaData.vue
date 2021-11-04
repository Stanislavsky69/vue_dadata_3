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
    <da-data-list v-if="showList" :class="{ 'dadata__list_empty': suggestions.length === 0}">
      <da-data-list-row v-for="(item, index) of suggestions"
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
<script setup>
import {
  defineProps,
  defineEmits,
  computed,
  ref,
  watch,
  toRaw,
  onMounted,
} from 'vue';
import axios from 'axios';
import DaDataList from './DaDataList.vue';
import DaDataListRow from './DaDataListRow.vue';

const emit = defineEmits(['update:modelValue', 'onSelected']);
const props = defineProps({
  modelValue: String,
  token: {
    type: String,
    default: null,
    required: true,
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

const params = computed(() => ({
  method: 'POST',
  url: url.value,
  headers: {
    Authorization: `Token ${props.token}`,
    'content-type': 'application/json',
    accept: 'application/json',
  },
  data: { ...props.params, query: localValue.value },
}));

onMounted(() => {
  document.addEventListener('click', (event) => {
    if (dadataDom.value && !dadataDom.value.contains(event.target)) {
      showList.value = false;
    }
  });
});

const search = () => {
  axios(params.value).then((response) => {
    if (response && response.data) {
      if (typeof response.data.suggestions !== 'undefined') {
        suggestions.value = response.data.suggestions;
      } else {
        console.error('DaDataV3:Свойство suggestions не найдено');
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
    console.error('Укажите ключ в объекте');
    return;
  }
  if (typeof key === 'object') {
    const keyParent = Object.keys(key)[0];
    if (!data[keyParent]) {
      console.error(`${keyParent} не найден в объекте dadata`);
      return;
    }
    const keyChild = key[keyParent];
    if (!data[keyParent][keyChild]) {
      console.error(`${keyChild} не найден в объекте dadata`);
      return;
    }
    copyValue = data[keyParent][keyChild];
  } else if (typeof key === 'string') {
    if (!data[key]) {
      console.error(`${key} не найден в объекте dadata`);
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
</script>
