<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CategoryFilter from './components/CategoryFilter.vue'
import ProductGrid from './components/ProductGrid.vue'
import ProductModal from './components/ProductModal.vue'
import LoginForm from './components/LoginForm.vue'
import { fetchCategories, fetchProducts } from './services/productService'
import { useBookmarks } from './composables/useBookmarks'
import type { Product } from './types/product'
import type { LoginResponse } from './types/auth'

const products = ref<Product[]>([])
const categories = ref<string[]>([])
const searchTerm = ref('')
const selectedCategory = ref('all')
const selectedProduct = ref<Product | null>(null)

const isLoading = ref(true)
const errorMessage = ref('')

const isLoggedIn = ref(false)
const authUser = ref<LoginResponse | null>(null)
const isDarkMode = ref(false)
const isCartOpen = ref(false)

const { cartItems, cartCount, toggleCart } = useBookmarks()

const USD_TO_LKR = 300

function formatLkr(price: number): string {
  return `Rs. ${(price * USD_TO_LKR).toLocaleString()}`
}

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark') {
    isDarkMode.value = true
  }

  const savedUser = localStorage.getItem('authUser')
  const savedToken = localStorage.getItem('accessToken')

  if (savedUser && savedToken) {
    authUser.value = JSON.parse(savedUser) as LoginResponse
    isLoggedIn.value = true
  }

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

function handleLoginSuccess(user: LoginResponse) {
  authUser.value = user
  isLoggedIn.value = true
}

function handleLogout() {
  const confirmed = confirm('Are you sure you want to log out?')

  if (!confirmed) return

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('authUser')

  authUser.value = null
  isLoggedIn.value = false
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value

  if (isDarkMode.value) {
    localStorage.setItem('theme', 'dark')
  } else {
    localStorage.setItem('theme', 'light')
  }
}

function toggleCartPanel() {
  isCartOpen.value = !isCartOpen.value
}
</script>

<template>
  <div :class="isDarkMode ? 'dark' : ''">
    <LoginForm
      v-if="!isLoggedIn"
      @login-success="handleLoginSuccess"
    />

    <div
      v-else
      class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white"
    >
      <header class="border-b border-slate-700 bg-slate-900 py-4 text-white shadow-lg dark:bg-slate-950">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-white">
              Uditha Store
            </h1>
            <p class="mt-1 text-xs tracking-wide text-slate-300">
              Sri Lankan Smart Product Catalog
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="toggleCartPanel"
              class="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
            >
              Shopping Cart ({{ cartCount }})
            </button>

            <div class="hidden text-right sm:block">
              <p class="text-sm font-semibold text-white">
                Uditha Sadruwan
              </p>
              <p class="text-xs text-slate-300">
                uditha
              </p>
            </div>

            <img
              v-if="authUser?.image"
              :src="authUser.image"
              :alt="authUser.username"
              class="h-10 w-10 rounded-full border border-slate-500 object-cover"
            />

            <button
              @click="toggleDarkMode"
              class="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 dark:bg-yellow-400 dark:text-slate-900 dark:hover:bg-yellow-300"
            >
              {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
            </button>

            <button
              @click="handleLogout"
              class="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
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
          class="py-10 text-center text-lg text-slate-600 dark:text-slate-300"
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
          <p class="mb-4 text-slate-600 dark:text-slate-300">
            Found {{ filteredProducts.length }} products in LKR prices
          </p>

          <div
            v-if="filteredProducts.length === 0"
            class="rounded-2xl bg-white p-8 text-center text-slate-500 shadow dark:bg-slate-800 dark:text-slate-300"
          >
            No products found.
          </div>

          <ProductGrid
            v-else
            :products="filteredProducts"
            @view="openModal"
          />
        </div>
      </main>

      <div
        v-if="isCartOpen"
        class="fixed inset-0 z-40 bg-black/40"
        @click="isCartOpen = false"
      ></div>

      <div
        class="fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white p-5 shadow-2xl transition dark:bg-slate-900"
        :class="isCartOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">
            Shopping Cart
          </h2>

          <button
            @click="isCartOpen = false"
            class="rounded-lg bg-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            X
          </button>
        </div>

        <div class="mt-4 space-y-4 overflow-y-auto">
          <div
            v-if="cartItems.length === 0"
            class="rounded-2xl bg-slate-100 p-6 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          >
            Your shopping cart is empty.
          </div>

          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-4 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"
          >
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="h-20 w-20 rounded-xl object-cover"
            />

            <div class="flex-1">
              <h3 class="font-semibold text-slate-800 dark:text-white">
                {{ item.title }}
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-300">
                {{ item.brand }}
              </p>
              <p class="mt-1 font-semibold text-blue-600 dark:text-yellow-400">
                {{ formatLkr(item.price) }}
              </p>

              <button
                @click="toggleCart(item)"
                class="mt-2 rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        :product="selectedProduct"
        @close="closeModal"
      />
    </div>
  </div>
</template>