import type { LoginPayload, LoginResponse } from '../types/auth'

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Invalid username or password')
  }

  return await response.json()
}