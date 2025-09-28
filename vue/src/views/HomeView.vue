<script setup lang="ts">
     import { ref, onMounted, watch } from 'vue'
     import { useRoute, useRouter } from 'vue-router'
     import type { APODData } from '@/types/apod'
     import { buildApiUrl, API_CONFIG } from '@/config/api'

// Components
import BackgroundVideo from '@/components/BackgroundVideo.vue'
import LogoHeader from '@/components/LogoHeader.vue'
import APODImage from '@/components/APODImage.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import DatePicker from '@/components/DatePicker.vue'
import InfoModal from '@/components/InfoModal.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const router = useRouter()

const apodData = ref<APODData | null>(null)
const selectedDate = ref('')
const showInfo = ref(false)
const isLoading = ref(false)
const today = new Date().toISOString().split('T')[0]

     const fetchAPOD = async (date?: string) => {
         try {
             const endpoint = date ? `${API_CONFIG.ENDPOINTS.APOD_TODAY}/${date}` : API_CONFIG.ENDPOINTS.APOD_TODAY
             const url = buildApiUrl(endpoint)
             
             const response = await fetch(url)
             const data = await response.json()
             
             if (data.success) {
                 apodData.value = data.data
                 if (date) {
                     selectedDate.value = date
                 }
             }
         } catch (error) {
             console.error('Помилка при отриманні APOD:', error)
         }
     }

     const fetchAPODByDate = async () => {
         if (!selectedDate.value) return
         
         isLoading.value = true
         
         try {
             const url = buildApiUrl(API_CONFIG.ENDPOINTS.APOD_BY_DATE)
             
             const response = await fetch(url, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     date: selectedDate.value
                 })
             })
             
             const data = await response.json()
             
             if (data.success) {
                 apodData.value = data.data
                 // Оновлюємо URL при успішному запиті
                 router.push(`/${selectedDate.value}`)
                 // НЕ встановлюємо isLoading = false тут!
                 // Це зробить onImageLoaded або onVideoLoaded
             } else {
                 // Якщо запит не успішний, зупиняємо завантаження
                 isLoading.value = false
             }
         } catch (error) {
             console.error('Помилка при отриманні APOD за дату:', error)
             // При помилці також зупиняємо завантаження
             isLoading.value = false
         }
     }

// Функція для валідації дати
const isValidDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(23, 59, 59, 999) // Встановлюємо кінець дня
  
  return date <= today && dateString.match(/^\d{4}-\d{2}-\d{2}$/)
}

onMounted(() => {
  // Перевіряємо, чи є дата в URL
  const dateFromUrl = route.params.date as string
  
  if (dateFromUrl && isValidDate(dateFromUrl)) {
    // Якщо дата валідна, встановлюємо її та завантажуємо APOD
    selectedDate.value = dateFromUrl
    fetchAPOD(dateFromUrl)
  } else {
    // Якщо дати немає або вона невалідна, встановлюємо сьогоднішню дату
    selectedDate.value = today
    fetchAPOD()
  }
})

// Слухаємо зміни в URL
watch(() => route.params.date, (newDate) => {
  if (newDate && isValidDate(newDate as string)) {
    selectedDate.value = newDate as string
    fetchAPOD(newDate as string)
  }
})

     const handleShowInfo = () => {
       showInfo.value = true
     }

          const handleCloseModal = () => {
       showInfo.value = false
     }

     // Обробники подій завантаження медіа
     const onImageLoaded = () => {
       console.log('Image loaded, stopping loading indicator')
       isLoading.value = false
     }

     const onVideoLoaded = () => {
       console.log('Video loaded, stopping loading indicator')
       isLoading.value = false
     }

     const onMediaError = () => {
       console.log('Media error, stopping loading indicator')
       isLoading.value = false
     }

     const formatDate = (dateString: string) => {
       return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
       })
     }
</script>

<template>
  <div class="min-vh-100 bg-white text-dark position-relative">
    <!-- Фонове відео -->
    <BackgroundVideo />

    <!-- Основний контент -->
    <div class="content-wrapper position-relative">
      <!-- Header з логотипом -->
      <LogoHeader />

                 <!-- Основний контент -->
           <div class="row g-3 px-3 px-md-5 mx-0">
                     <!-- Ліва колонка - фото -->
             <APODImage 
               :apodData="apodData" 
               @imageLoaded="onImageLoaded"
               @videoLoaded="onVideoLoaded"
               @mediaError="onMediaError"
             />

        <!-- Права колонка - кнопки та QR код -->
        <ActionButtons 
          :apodData="apodData" 
          @showInfo="handleShowInfo" 
        />
        
        
      </div>

      <!-- DatePicker під фото -->
      <DatePicker 
        :selectedDate="selectedDate"
        :today="today"
        :isLoading="isLoading"
        @update:selectedDate="selectedDate = $event"
        @searchPhoto="fetchAPODByDate"
      />



      <!-- Модальне вікно з інформацією -->
      <div v-if="showInfo" class="modal-overlay" @click="handleCloseModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h5 class="modal-title">{{ apodData?.title || 'NASA APOD Information' }}</h5>
            <button type="button" class="modal-close" @click="handleCloseModal">×</button>
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

      <!-- Футер з копірайтом -->
      <Footer />
    </div>
  </div>
</template>

<style scoped>
/* Стилі для основного контенту */
.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 100vw;
  overflow-x: hidden;
}

/* Додаткові обмеження для контейнерів */
.row {
  margin-left: 0;
  margin-right: 0;
}

/* Обмеження для великих екранів */
@media (min-width: 1400px) {
  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* Мобільна адаптація */
@media (max-width: 768px) {
  .content-wrapper {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Стилі для модального вікна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
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
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
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

.modal-close {
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

.modal-close:hover {
  opacity: 0.7;
  color: #ffc107;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

/* Мобільна адаптація для модального вікна */
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
