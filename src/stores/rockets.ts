import { fetchRocketById, fetchRockets } from '@/services/spacex'
import type { Rocket, RocketCreateInput, RocketListItem } from '@/types/rocket'
import { defineStore } from 'pinia'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

const LOCAL_STORAGE_KEY = 'rockets:local'

function loadLocalRocketsFromStorage (): RocketListItem[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) as RocketListItem[] : []
  } catch (e) {
    console.warn('Failed to load local rockets from storage', e)
    return []
  }
}

function persistLocalRockets (rockets: RocketListItem[]) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rockets))
  } catch (e) {
    console.warn('Failed to persist local rockets', e)
  }
}

interface State {
  rockets: RocketListItem[]
  localRockets: RocketListItem[]
  status: LoadStatus
  error: string | null
  filter: string
}

export const useRocketsStore = defineStore('rockets', {
  state: (): State => ({
    rockets: [],
    localRockets: loadLocalRocketsFromStorage(),
    status: 'idle',
    error: null,
    filter: '',
  }),
  getters: {
    allRockets: (state): RocketListItem[] => {
      return [...state.localRockets, ...state.rockets].map(rocket => ({
        ...rocket,
        image: rocket.image || rocket.flickr_images?.[0],
      }))
    },
    filteredRockets (): RocketListItem[] {
      if (!this.filter) return this.allRockets
      const query = this.filter.toLowerCase()
      return this.allRockets.filter(rocket => rocket.name.toLowerCase().includes(query))
    },
    getRocketById () {
      return (id: string): RocketListItem | undefined => {
        return this.allRockets.find(rocket => rocket.id === id)
      }
    },
  },
  actions: {
    setFilter (value: string) {
      this.filter = value
    },
    async loadRockets (force = false) {
      if (this.status === 'loading') return
      if (this.rockets.length && !force) return
      this.status = 'loading'
      this.error = null
      try {
        const data = await fetchRockets()
        this.rockets = data.map((rocket: Rocket) => ({
          ...rocket,
          image: rocket.flickr_images?.[0],
        }))
        this.status = 'success'
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load rockets'
        this.status = 'error'
      }
    },
    async loadRocketDetail (id: string) {
      const existing = this.getRocketById(id)
      if (existing) return existing
      this.status = 'loading'
      this.error = null
      try {
        const data = await fetchRocketById(id)
        const rocket: RocketListItem = {
          ...data,
          image: data.flickr_images?.[0],
        }
        const index = this.rockets.findIndex(item => item.id === id)
        if (index >= 0) {
          this.rockets.splice(index, 1, rocket)
        } else {
          this.rockets.push(rocket)
        }
        this.status = 'success'
        return rocket
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load rocket'
        this.status = 'error'
        return undefined
      }
    },
    addRocket (payload: RocketCreateInput) {
      const id = `local-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`
      const rocket: RocketListItem = {
        id,
        name: payload.name,
        description: payload.description,
        country: payload.country || 'Unknown',
        company: 'User Created',
        first_flight: payload.first_flight || 'TBD',
        cost_per_launch: payload.cost_per_launch || 0,
        active: true,
        flickr_images: payload.image ? [payload.image] : [],
        image: payload.image,
        isLocal: true,
      }
      this.localRockets.unshift(rocket)
      persistLocalRockets(this.localRockets)
    },
    clearError () {
      this.error = null
    },
  },
})
