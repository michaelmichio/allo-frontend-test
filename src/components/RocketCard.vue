<template>
  <v-card
    class="rocket-card"
    rounded="lg"
    border
    elevation="1"
    @click="handleClick"
  >
    <v-img
      :src="rocket.image || fallbackImage"
      height="180"
      cover
      class="bg-grey-darken-4"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height text-caption text-grey">
          No image
        </div>
      </template>
    </v-img>

    <v-card-title class="d-flex align-center justify-space-between">
      <div class="text-subtitle-1 font-weight-bold text-truncate-2">
        {{ rocket.name }}
      </div>
      <v-chip
        v-if="rocket.isLocal"
        label
        color="primary"
        size="x-small"
      >
        Local
      </v-chip>
    </v-card-title>

    <v-card-subtitle class="d-flex gap-2 align-center flex-wrap">
      <div class="d-flex align-center gap-1 text-body-2">
        <v-icon icon="mdi-flag" size="small" />
        <span class="text-truncate-1">{{ rocket.country || 'Unknown' }}</span>
      </div>
      <v-divider vertical class="mx-1" />
      <div class="d-flex align-center gap-1 text-body-2">
        <v-icon icon="mdi-cash" size="small" />
        <span>{{ formattedCost }}</span>
      </div>
    </v-card-subtitle>

    <v-card-text class="text-body-2 text-medium-emphasis text-truncate-3">
      {{ rocket.description }}
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-chip
        size="x-small"
        prepend-icon="mdi-rocket-launch-outline"
        variant="tonal"
        color="secondary"
      >
        First flight: {{ rocket.first_flight || 'TBD' }}
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { RocketListItem } from '@/types/rocket'
import { computed } from 'vue'

const props = defineProps<{
  rocket: RocketListItem
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const fallbackImage = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80'

const formattedCost = computed(() => {
  const cost = props.rocket.cost_per_launch
  if (!cost) return 'N/A'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost)
})

function handleClick () {
  emit('select', props.rocket.id)
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.rocket-card:hover {
  transform: translateY(-2px);
}

.text-truncate-1 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden; }
.text-truncate-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.text-truncate-3 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
</style>
