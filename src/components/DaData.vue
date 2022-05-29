<template>
  <div class="dadata" ref="dadataDom">
    <input
      type="text"
      :name="inputName"
      @focus="onFocus"
      @input="onInput"
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
<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  toRaw,
  inject,
  onMounted,
  defineEmits,
  defineProps,
} from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import DaDataList from './DaDataList.vue';
import DaDataListRow from './DaDataListRow.vue';
import { DaDataAddress, DaDataResult, PluginOptions } from "../types";

const emit = defineEmits(['update:modelValue', 'onSelected', 'focus']);
const props = defineProps({
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
  cssClasses: {
    type: Object,
    default: () => ({
      root: 'dadata',
      list: 'dadata__list',
      listEmpty: 'dadata__list_empty',
      row: 'dadata__list__row',
    }),
  },
});

const globalOptions = inject<PluginOptions>('da-data-next-options');


</script>
