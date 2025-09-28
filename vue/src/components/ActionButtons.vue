<template>
  <div class="col-12 col-lg-4">
    <div class="d-flex flex-column gap-3 justify-content-center justify-content-lg-end h-100 action-buttons-container">
      <!-- Кнопка перегляду зображення -->
      <button 
        @click="downloadImage"
        class="btn btn-outline-light btn-lg d-flex align-items-center justify-content-center gap-2 action-button"
        :disabled="!apodData || apodData.media_type !== 'image'"
      >
        <i class="bi bi-eye"></i>
        <span class="button-text">View Image</span>
      </button>

                  <!-- Кнопка інформації -->
            <button 
              @click="handleShowInfo"
              class="btn btn-outline-light btn-lg d-flex align-items-center justify-content-center gap-2 action-button"
              :disabled="!apodData"
            >
              <i class="bi bi-info-circle"></i>
              <span class="button-text">Information</span>
            </button>

      <!-- QR код для донату -->
      <div class="text-center mt-3 qr-section">
        <h6 class="text-white mb-2">Support the project</h6>
        <a 
          href="https://donatello.to/From2" 
          target="_blank" 
          rel="noopener noreferrer"
          class="qr-link"
        >
          <img 
            src="@/assets/donate_qr.svg" 
            alt="Donation QR Code" 
            class="img-fluid qr-code"
          />
        </a>
        <p class="text-white-50 mt-2 small">Click to donate</p>
      </div>
    </div>
  </div>
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
  apodData: APODData | null
}

interface Emits {
  (e: 'showInfo'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const downloadImage = () => {
  if (!props.apodData) return
  
  const imageUrl = props.apodData.hdurl || props.apodData.url
  if (!imageUrl) return
  
  // Відкриваємо зображення в новій вкладці
  window.open(imageUrl, '_blank')
}

const handleShowInfo = () => {
  emit('showInfo')
}
</script>

<style scoped>
     .action-buttons-container {
       min-height: 250px;
     }

.action-button {
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.qr-code {
  max-width: 150px;
  height: auto;
  transition: transform 0.3s ease;
}

.qr-link {
  display: inline-block;
  text-decoration: none;
}

.qr-link:hover .qr-code {
  transform: scale(1.05);
}

/* Мобільна адаптація */
@media (max-width: 768px) {
  .action-buttons-container {
    min-height: auto;
    margin-top: 2rem;
  }
  
  .action-button {
    font-size: 1rem !important;
    padding: 0.75rem 1.5rem !important;
  }
  
  .qr-code {
    max-width: 120px;
  }
}

@media (max-width: 576px) {
  .action-button {
    font-size: 0.9rem !important;
    padding: 0.5rem 1rem !important;
  }
  
  .button-text {
    font-size: 0.9rem;
  }
  
  .qr-code {
    max-width: 100px;
  }
}
</style>
