<script setup lang="ts">
defineProps<{
  categories: string[]
  selectedCategory: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void
}>()
</script>

<template>
  <select
    :value="selectedCategory"
    @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
    class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 md:w-64"
  >
    <option value="all">All Categories</option>
    <option
      v-for="category in categories"
      :key="category"
      :value="category"
    >
      {{ category }}
    </option>
  </select>
</template>