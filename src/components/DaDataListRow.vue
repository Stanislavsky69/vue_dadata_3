<template>
  <li :class="cssClass">
    <slot />
  </li>
</template>

<script setup lang="ts">
defineProps({
  cssClass: {
    type: String,
    default: 'dadata__list__row',
  },
})
</script>
