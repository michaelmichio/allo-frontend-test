<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 60vh;">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/rockets')
})
</script>
