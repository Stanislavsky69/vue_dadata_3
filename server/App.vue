<template>
  <div class="page">
    <da-data
      v-model="value"
    >
    </da-data>
    <da-data
    >
      <template #list-item="{ prop, prepareValue}">
        <span v-html="prepareValue(prop, 'value')"></span>
      </template>
    </da-data>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DaData from '../src/components/DaData.vue';

const value = ref('Тверь');
</script>

<style lang="scss">
@import '../src/assets/_variabless.scss';
@import '../src/assets/_styles.scss';
.page{
  display: flex;
  align-items: center;
}
</style>
