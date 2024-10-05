<script setup>
  const props = defineProps({
    selected : {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div
    class="px-2 py-1 m-1 rounded"
    :class="{
      'bg-emerald-600 text-emerald-100': props.selected,
      'bg-slate-900 text-slate-500': !props.selected
      }"
  >
    <slot></slot>
  </div>
</template>