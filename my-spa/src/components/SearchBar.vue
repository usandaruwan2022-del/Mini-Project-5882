<script setup lang="ts">
defineProps<{
  searchTerm: string
}>()

const emit = defineEmits<{
  (e: 'update:searchTerm', value: string): void
}>()
</script>

<template>
  <input
    :value="searchTerm"
    @input="emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
    type="text"
    placeholder="Search products..."
    class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 md:w-80"
  />
</template>