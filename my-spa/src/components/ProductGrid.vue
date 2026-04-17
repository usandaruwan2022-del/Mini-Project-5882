<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '../types/product'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  (e: 'view', product: Product): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @view="emit('view', $event)"
    />
  </div>
</template>