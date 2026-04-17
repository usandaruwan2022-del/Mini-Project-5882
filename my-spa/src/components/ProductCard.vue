<script setup lang="ts">
import type { Product } from '../types/product'

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'view', product: Product): void
}>()
</script>

<template>
  <div class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-xl">
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="h-48 w-full rounded-xl object-cover"
    />

    <div class="mt-4">
      <h2 class="text-lg font-bold text-slate-800">
        {{ product.title }}
      </h2>

      <p class="mt-1 text-sm capitalize text-slate-500">
        {{ product.category }}
      </p>

      <p class="mt-2 text-xl font-semibold text-blue-600">
        ${{ product.price }}
      </p>

      <p class="mt-1 text-sm text-slate-600">
        Rating: {{ product.rating }}
      </p>

      <button
        @click="emit('view', product)"
        class="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  </div>
</template>