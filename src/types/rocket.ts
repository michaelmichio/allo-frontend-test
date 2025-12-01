export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  country: string
  company: string
  first_flight: string
  cost_per_launch: number
  active: boolean
}

export interface RocketCreateInput {
  name: string
  description: string
  country?: string
  first_flight?: string
  cost_per_launch?: number
  image?: string
}

export type RocketListItem = Rocket & {
  isLocal?: boolean
  image?: string
}
