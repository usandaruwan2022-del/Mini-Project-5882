<script setup lang="ts">
import type { Product } from '../types/product'
import { useBookmarks } from '../composables/useBookmarks'

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'view', product: Product): void
}>()

const USD_TO_LKR = 300
const { isInCart, toggleCart } = useBookmarks()

function formatLkr(price: number): string {
  return `Rs. ${(price * USD_TO_LKR).toLocaleString()}`
}
</script>

<template>
  <div class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-xl dark:bg-slate-800">
    <div class="relative">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="h-48 w-full rounded-xl object-cover"
      />

      <button
        @click="toggleCart(product)"
        class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold shadow hover:bg-white dark:bg-slate-900 dark:text-white"
      >
        {{ isInCart(product.id) ? '✓' : '+' }}
      </button>
    </div>

    <div class="mt-4">
      <h2 class="text-lg font-bold text-slate-800 dark:text-white">
        {{ product.title }}
      </h2>

      <p class="mt-1 text-sm capitalize text-slate-500 dark:text-slate-300">
        {{ product.category }}
      </p>

      <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
        Brand: {{ product.brand }}
      </p>

      <p class="mt-2 text-xl font-semibold text-blue-600 dark:text-yellow-400">
        {{ formatLkr(product.price) }}
      </p>

      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Rating: {{ product.rating }}
      </p>

      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Stock: {{ product.stock }}
      </p>

      <button
        @click="emit('view', product)"
        class="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-yellow-400 dark:text-slate-900 dark:hover:bg-yellow-300"
      >
        View Details
      </button>
    </div>
  </div>
</template>