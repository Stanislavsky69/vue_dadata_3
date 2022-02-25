<template>
  <ul :class="cssClass">
    <slot></slot>
  </ul>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    cssClass: {
      type: String,
      default: 'dadata__list',
    },
  },
});
</script>
