<template>
  <div
    ref="dadataDom"
    :class="computedCssClasses.root"
  >
    <input
      v-model="localValue"
      type="text"
      :name="inputName"
      :id="inputId"
      :class="computedCssClasses.input"
      :placeholder="placeholder"
      @input="onInput"
      @focus="onFocus"
    >
    <da-data-list
      v-if="showList"
      :class="{ [`${computedCssClasses.listEmpty}`] : suggestions.length === 0}"
      :css-class="computedCssClasses.list"
    >
      <da-data-list-row
        v-for="(item, index) of suggestions"
        :key="index"
        :css-class="computedCssClasses.row"
        @click="onSelected(item)"
      >
        <slot
          name="list-item"
          :prop="item"
          :prepare-value="prepareResults"
        >
          <span v-html="prepareResults(item, 'value')" />
        </slot>
      </da-data-list-row>
    </da-data-list>
  </div>
</template>

<script setup lang="ts">
import DaDataList from './DaDataList.vue';
import DaDataListRow from './DaDataListRow.vue';
import { useDaData, emitsComponent, propsComponent } from './useDaData';

defineProps(propsComponent);
defineEmits(emitsComponent);

const { 
  prepareResults,
  onSelected,
  onFocus,
  onInput,
  showList,
  localValue,
  suggestions,
  computedCssClasses,
  dadataDom
} = useDaData();


</script>