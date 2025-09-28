<template>
  <div class="row mt-3 px-3 px-md-5">
    <div class="col-12">
      <div class="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 datepicker-container">
        <div class="input-group date-input-group">
          <input 
            type="date" 
            class="form-control date-input"
            :value="selectedDate"
            @input="updateDate"
            :max="today"
          />
        </div>
        <button 
          @click="searchPhoto"
          class="btn btn-primary btn-lg search-button"
          :disabled="!selectedDate || isLoading"
        >
          <i v-if="!isLoading" class="bi bi-search"></i>
          <div v-else class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span class="button-text">{{ isLoading ? 'Searching...' : 'Find Photo' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedDate: string
  today: string
  isLoading: boolean
}

interface Emits {
  (e: 'update:selectedDate', value: string): void
  (e: 'searchPhoto'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateDate = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:selectedDate', target.value)
}

const searchPhoto = () => {
  emit('searchPhoto')
}
</script>

<style scoped>
     .datepicker-container {
       min-height: 60px;
     }

.date-input-group {
  max-width: 300px;
  width: 100%;
}

.date-input {
  font-size: 1rem;
  padding: 0.75rem;
}

.search-button {
  min-width: 140px;
  transition: all 0.3s ease;
}

.search-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

/* Мобільна адаптація */
@media (max-width: 768px) {
  .datepicker-container {
    min-height: auto;
  }
  
  .date-input-group {
    max-width: 100%;
  }
  
  .search-button {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .date-input {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
  
  .search-button {
    font-size: 1rem !important;
    padding: 0.75rem 1rem !important;
  }
  
  .button-text {
    font-size: 0.9rem;
  }
}
</style>
