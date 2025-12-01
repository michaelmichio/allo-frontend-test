import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRocketsStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'

vi.mock('@/services/spacex', () => ({
  fetchRockets: vi.fn(async () => mockRockets),
  fetchRocketById: vi.fn(async (id: string) => mockRockets.find(r => r.id === id)!),
}))

const mockRockets: Rocket[] = [
  {
    id: 'falcon9',
    name: 'Falcon 9',
    description: 'Reusable launch vehicle',
    flickr_images: ['https://example.com/f9.jpg'],
    country: 'USA',
    company: 'SpaceX',
    first_flight: '2010-06-04',
    cost_per_launch: 50000000,
    active: true,
  },
]

function mockLocalStorage () {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  } as unknown as Storage
}

describe('useRocketsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('localStorage', mockLocalStorage())
  })

  it('loads rockets from API', async () => {
    const store = useRocketsStore()
    await store.loadRockets(true)
    expect(store.rockets).toHaveLength(1)
    expect(store.rockets[0].name).toBe('Falcon 9')
  })

  it('adds local rocket and persists to storage', () => {
    const store = useRocketsStore()
    store.addRocket({
      name: 'Custom Rocket',
      description: 'User entry',
      image: 'https://example.com/custom.jpg',
      country: 'ID',
      first_flight: '2025-01-01',
      cost_per_launch: 100,
    })
    expect(store.localRockets[0].name).toBe('Custom Rocket')
    const stored = (globalThis.localStorage as Storage).getItem('rockets:local')
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored as string)[0].name).toBe('Custom Rocket')
  })
})
