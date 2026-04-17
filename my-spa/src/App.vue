<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CategoryFilter from './components/CategoryFilter.vue'
import ProductGrid from './components/ProductGrid.vue'
import ProductModal from './components/ProductModal.vue'
import { fetchCategories, fetchProducts } from './services/productService'
import type { Product } from './types/product'

const products = ref<Product[]>([])
const categories = ref<string[]>([])
const searchTerm = ref('')
const selectedCategory = ref('all')
const selectedProduct = ref<Product | null>(null)

const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    isLoading.value = true

    const productData = await fetchProducts()
    const categoryData = await fetchCategories()

    products.value = productData.products
    categories.value = categoryData
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Something went wrong while loading data.'
  } finally {
    isLoading.value = false
  }
})

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === 'all' ||
      product.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

function openModal(product: Product) {
  selectedProduct.value = product
}

function closeModal() {
  selectedProduct.value = null
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-slate-900 py-4 text-white shadow-md">
      <div class="mx-auto max-w-7xl px-4">
        <h1 class="text-2xl font-bold">My Product Store</h1>
        <p class="text-sm text-slate-300">
          Vue 3 + TypeScript + Tailwind SPA
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          :searchTerm="searchTerm"
          @update:searchTerm="searchTerm = $event"
        />

        <CategoryFilter
          :categories="categories"
          :selectedCategory="selectedCategory"
          @update:selectedCategory="selectedCategory = $event"
        />
      </div>

      <div
        v-if="isLoading"
        class="py-10 text-center text-lg text-slate-600"
      >
        Loading products...
      </div>

      <div
        v-else-if="errorMessage"
        class="py-10 text-center text-red-600"
      >
        {{ errorMessage }}
      </div>

      <div v-else>
        <p class="mb-4 text-slate-600">
          Found {{ filteredProducts.length }} products
        </p>

        <ProductGrid
          :products="filteredProducts"
          @view="openModal"
        />
      </div>
    </main>

    <ProductModal
      :product="selectedProduct"
      @close="closeModal"
    />
  </div>
</template>