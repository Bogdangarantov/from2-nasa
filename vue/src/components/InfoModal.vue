<template>
  <!-- Модальне вікно -->
  <Teleport to="body">
    <div 
      v-if="showInfo" 
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ apodData?.title || 'NASA APOD Information' }}</h5>
          <button type="button" class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="apodData">
            <p class="text-white mb-3">
              <strong>Date:</strong> {{ formatDate(apodData.date) }}
            </p>
            <p class="text-white mb-3" v-if="apodData.copyright">
              <strong>Author:</strong> {{ apodData.copyright }}
            </p>
            <p class="text-white mb-3">{{ apodData.explanation }}</p>
            <div class="d-flex gap-2 flex-wrap">
              <a 
                v-if="apodData.hdurl" 
                :href="apodData.hdurl" 
                target="_blank"
                class="btn btn-outline-light"
              >
                High Quality Photo
              </a>
              <a 
                :href="apodData.url" 
                target="_blank"
                class="btn btn-outline-light"
              >
                Original
              </a>
            </div>
          </div>
          <div v-else class="text-center">
            <p class="text-white">Loading information...</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface APODData {
  copyright?: string
  date: string
  explanation: string
  hdurl?: string
  media_type: string
  service_version: string
  title: string
  url: string
  thumbnail_url?: string
}

interface Props {
  showInfo: boolean
  apodData: APODData | null
}

interface Emits {
  (e: 'closeModal'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  console.log('InfoModal: closeModal called')
  emit('closeModal')
}

// Додаємо діагностику для props
console.log('InfoModal: showInfo =', props.showInfo)
console.log('InfoModal: apodData =', props.apodData)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background-color: #212529;
  border-radius: 0.5rem;
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #6c757d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: bold;
}

.btn-close:hover {
  opacity: 0.7;
  color: #ffc107;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

/* Мобільна адаптація */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .modal-content {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-overlay {
    padding: 0;
  }
}
</style>
