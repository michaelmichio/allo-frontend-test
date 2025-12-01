<template>
  <v-app>
    <v-app-bar
      flat
      color="surface"
      density="comfortable"
    >
      <v-btn
        variant="text"
        prepend-icon="mdi-rocket-launch-outline"
        to="/rockets"
      >
        Allo Rockets
      </v-btn>
      <v-spacer />
      <v-btn
        icon="mdi-github"
        href="https://github.com/r-spacex/SpaceX-API"
        target="_blank"
        rel="noreferrer"
        variant="text"
      />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="errorSnackbar"
      color="error"
      timeout="4000"
      location="top right"
    >
      {{ error || 'An error occurred' }}
      <template #actions>
        <v-btn
          variant="text"
          color="on-error"
          @click="dismissError"
        >
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { useRocketsStore } from '@/stores/rockets'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const store = useRocketsStore()
const { error } = storeToRefs(store)
const errorSnackbar = ref(false)

watch(error, (value) => {
  if (value) {
    errorSnackbar.value = true
  }
})

function dismissError () {
  errorSnackbar.value = false
  store.clearError()
}
</script>
