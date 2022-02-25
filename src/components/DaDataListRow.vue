<template>
  <li :class="cssClass">
    <slot></slot>
  </li>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    cssClass: {
      type: String,
      default: 'dadata__list__row',
    },
  },
});
</script>
