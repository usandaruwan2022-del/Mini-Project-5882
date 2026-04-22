import { computed, ref } from 'vue'
import type { Product } from '../types/product'

export interface CartItem extends Product {
  quantity: number
}

const cartItems = ref<CartItem[]>([])
const isInitialized = ref(false)

function loadCart() {
  if (isInitialized.value) return

  const saved = localStorage.getItem('cartItems')
  if (saved) {
    cartItems.value = JSON.parse(saved) as CartItem[]
  }

  isInitialized.value = true
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
}

function isInCart(productId: number): boolean {
  return cartItems.value.some((item) => item.id === productId)
}

function addToCart(product: Product) {
  const existing = cartItems.value.find((item) => item.id === product.id)

  if (existing) {
    existing.quantity += 1
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1,
    })
  }

  saveCart()
}

function removeFromCart(productId: number) {
  cartItems.value = cartItems.value.filter((item) => item.id !== productId)
  saveCart()
}

function increaseQty(productId: number) {
  const item = cartItems.value.find((item) => item.id === productId)
  if (!item) return

  item.quantity += 1
  saveCart()
}

function decreaseQty(productId: number) {
  const item = cartItems.value.find((item) => item.id === productId)
  if (!item) return

  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    cartItems.value = cartItems.value.filter((cartItem) => cartItem.id !== productId)
  }

  saveCart()
}

const cartCount = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0)
)

export function useBookmarks() {
  loadCart()

  return {
    cartItems,
    cartCount,
    isInCart,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  }
}