<script setup lang="ts">
import { ref } from 'vue'
import { loginUser } from '../services/authService'
import type { LoginResponse } from '../types/auth'

const emit = defineEmits<{
  (e: 'login-success', user: LoginResponse): void
}>()

const username = ref('emilys')
const password = ref('emilyspass')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const user = await loginUser({
      username: username.value,
      password: password.value,
      expiresInMins: 30,
    })

    const customUser: LoginResponse = {
      ...user,
      firstName: 'Uditha',
      lastName: 'Sadruwan',
      username: 'uditha',
    }

    localStorage.setItem('accessToken', customUser.accessToken)
    localStorage.setItem('refreshToken', customUser.refreshToken)
    localStorage.setItem('authUser', JSON.stringify(customUser))

    emit('login-success', customUser)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Login failed. Please check username and password.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-900">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Login</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
        Use DummyJSON demo credentials
      </p>

      <form @submit.prevent="handleLogin" class="mt-6 space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-yellow-400 dark:text-slate-900 dark:hover:bg-yellow-300"
        >
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>

      <div class="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-200">
        <p><strong>Demo username:</strong> emilys</p>
        <p><strong>Demo password:</strong> emilyspass</p>
      </div>
    </div>
  </div>
</template>