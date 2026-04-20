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
    class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-400 md:w-64 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
  >
    <option value="all" class="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
      All Categories
    </option>
    <option
      v-for="category in categories"
      :key="category"
      :value="category"
      class="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
    >
      {{ category }}
    </option>
  </select>
</template>