<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="goBack"
    >
      Back to list
    </v-btn>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      :text="error"
    >
      <template #append>
        <v-btn
          variant="text"
          color="primary"
          prepend-icon="mdi-reload"
          @click="reload"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <v-skeleton-loader
      v-if="isLoading"
      type="card-avatar, article, actions"
    />

    <div v-else-if="rocket" class="d-flex flex-column gap-6 detail-wrapper">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="rocket.image || fallbackImage"
            height="320"
            cover
            class="rounded-lg"
          >
            <template #error>
              <div class="d-flex align-center justify-center fill-height text-caption text-grey">
                No image
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" md="6">
          <div class="d-flex align-center gap-2 mb-1">
            <v-chip
              v-if="rocket.isLocal"
              color="primary"
              size="small"
              label
            >
              Local entry
            </v-chip>
            <v-chip
              v-else
              color="success"
              size="small"
              label
            >
              SpaceX
            </v-chip>
          </div>
          <h1 class="text-h4 font-weight-bold mb-2 detail-title">{{ rocket.name }}</h1>
          <p class="text-body-1 text-medium-emphasis mb-4 detail-description">
            {{ rocket.description }}
          </p>
          <div class="d-flex flex-wrap gap-3 mb-4 chip-row">
            <v-chip prepend-icon="mdi-flag" size="small">{{ rocket.country || 'Unknown' }}</v-chip>
            <v-chip prepend-icon="mdi-domain" size="small">{{ rocket.company }}</v-chip>
            <v-chip prepend-icon="mdi-calendar" size="small">{{ rocket.first_flight || 'TBD' }}</v-chip>
            <v-chip prepend-icon="mdi-cash" size="small" variant="tonal">{{ formattedCost }}</v-chip>
          </div>
          <div class="d-flex gap-2 align-center text-body-2">
            <v-icon :color="rocket.active ? 'success' : 'error'" icon="mdi-circle" size="small" />
            <span>{{ rocket.active ? 'Active' : 'Retired' }}</span>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-empty-state
      v-else
      headline="Rocket not found"
      title="Return to the list and try again"
      action-text="Back"
      @click:action="goBack"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useRocketsStore } from '@/stores/rockets'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useRocketsStore()
const { status, error } = storeToRefs(store)

const rocketId = computed(() => route.params.id as string)
const rocket = computed(() => store.getRocketById(rocketId.value))
const isLoading = computed(() => status.value === 'loading')

const fallbackImage = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80'

const formattedCost = computed(() => {
  const cost = rocket.value?.cost_per_launch
  if (!cost) return 'N/A'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost)
})

onMounted(() => {
  if (!rocket.value) {
    store.loadRocketDetail(rocketId.value)
  }
})

function goBack () {
  router.push({ path: '/rockets' })
}

function reload () {
  store.loadRocketDetail(rocketId.value)
}
</script>

<style scoped>
.detail-wrapper {
  max-width: 1200px;
}

.detail-title {
  text-wrap: balance;
}

.detail-description {
  line-height: 1.6;
}

.chip-row {
  row-gap: 8px;
}
</style>
