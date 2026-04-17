import type { ProductResponse } from '../types/product'

export async function fetchProducts(): Promise<ProductResponse> {
  const response = await fetch('https://dummyjson.com/products?limit=0')

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return await response.json()
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch('https://dummyjson.com/products/category-list')

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return await response.json()
}