<script setup lang="ts">
import type { Product } from '../types/product'

defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="product"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <div class="flex items-start justify-between gap-4">
        <h2 class="text-2xl font-bold text-slate-800">
          {{ product.title }}
        </h2>

        <button
          @click="emit('close')"
          class="rounded-lg bg-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-300"
        >
          X
        </button>
      </div>

      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="mt-4 h-72 w-full rounded-xl object-cover"
      />

      <div class="mt-4 space-y-2 text-slate-700">
        <p><strong>Brand:</strong> {{ product.brand }}</p>
        <p><strong>Category:</strong> {{ product.category }}</p>
        <p><strong>Price:</strong> ${{ product.price }}</p>
        <p><strong>Rating:</strong> {{ product.rating }}</p>
        <p><strong>Stock:</strong> {{ product.stock }}</p>
        <p><strong>Description:</strong> {{ product.description }}</p>
      </div>
    </div>
  </div>
</template>