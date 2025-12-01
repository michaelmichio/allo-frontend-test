<template>
  <v-dialog
    v-model="isOpen"
    max-width="640"
  >
    <template #activator="{ props: activatorProps }">
      <slot
        name="activator"
        v-bind="activatorProps"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          v-bind="activatorProps"
        >
          Add Rocket
        </v-btn>
      </slot>
    </template>

    <v-card title="Add Rocket">
      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            v-model="form.name"
            label="Name"
            prepend-inner-icon="mdi-rocket-outline"
            required
            :rules="[requiredRule]"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            auto-grow
            rows="2"
            required
            :rules="[requiredRule]"
          />
          <v-text-field
            v-model="form.image"
            label="Image URL (optional)"
            prepend-inner-icon="mdi-image-outline"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            prepend-inner-icon="mdi-flag-outline"
          />
          <v-text-field
            v-model="form.first_flight"
            label="First Flight (YYYY-MM-DD)"
            prepend-inner-icon="mdi-calendar"
          />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per launch (USD)"
            prepend-inner-icon="mdi-cash"
            type="number"
            min="0"
            :rules="[numberRule]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="handleSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { RocketCreateInput } from '@/types/rocket'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: RocketCreateInput): void
}>()

const formRef = ref()

const form = reactive<RocketCreateInput>({
  name: '',
  description: '',
  image: '',
  country: '',
  first_flight: '',
  cost_per_launch: undefined,
})

const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (value: boolean) => emit('update:modelValue', value),
})

watch(isOpen, (value) => {
  if (value) return
  resetForm()
})

function resetForm () {
  form.name = ''
  form.description = ''
  form.image = ''
  form.country = ''
  form.first_flight = ''
  form.cost_per_launch = undefined
}

function close () {
  isOpen.value = false
}

async function handleSubmit () {
  const result = await formRef.value?.validate?.()
  const isValid = typeof result === 'boolean' ? result : result?.valid
  if (!isValid) return
  emit('save', { ...form })
  close()
}

const requiredRule = (value: string) => !!value?.trim?.() || 'Required'
const numberRule = (value?: number | string) => {
  if (value === undefined || value === '' || value === null) return true
  return Number(value) >= 0 || 'Must be >= 0'
}
</script>
