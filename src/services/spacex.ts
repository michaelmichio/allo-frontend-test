import type { Rocket } from '@/types/rocket'

const BASE_URL = (import.meta.env.VITE_SPACEX_API as string) || 'https://api.spacexdata.com/v4'

async function request<T> (path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      accept: 'application/json',
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return await response.json() as T
}

export async function fetchRockets (): Promise<Rocket[]> {
  return await request<Rocket[]>('/rockets')
}

export async function fetchRocketById (id: string): Promise<Rocket> {
  return await request<Rocket>(`/rockets/${id}`)
}
