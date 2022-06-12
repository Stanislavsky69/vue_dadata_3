<template>
  <ul :class="cssClass">
    <slot />
  </ul>
</template>

<script lang="ts" setup>
defineProps({
  cssClass: {
    type: String,
    default: 'dadata__list',
  },
})
</script>
