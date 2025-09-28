<template>
  <div class="col-12 col-lg-8">
    <div class="card bg-dark border-0 apod-image-card">
      <div class="card-body p-0">
        <img 
          v-if="apodData?.media_type === 'image'"
          :src="apodData?.hdurl || apodData?.url" 
          :alt="apodData?.title"
          class="img-fluid w-100 rounded apod-image"
          @load="onImageLoad"
          @error="onImageError"
        />
        <iframe 
          v-else-if="apodData?.media_type === 'video'"
          :src="apodData?.url"
          class="w-100 rounded apod-video"
          frameborder="0"
          allowfullscreen
          @load="onVideoLoad"
        ></iframe>
        <div v-else class="d-flex align-items-center justify-content-center apod-loading">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-white">Loading...</p>
          </div>
        </div>
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
  (e: 'imageLoaded'): void
  (e: 'videoLoaded'): void
  (e: 'mediaError'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const onImageLoad = () => {
  emit('imageLoaded')
}

const onVideoLoad = () => {
  emit('videoLoaded')
}

const onImageError = () => {
  emit('mediaError')
}
</script>

<style scoped>
.apod-image-card {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  overflow: hidden;
  max-width: 100%;
}

     .apod-image {
       max-height: 60vh;
       max-width: 100%;
       width: 100%;
       height: auto;
       object-fit: cover;
       display: block;
     }

     .apod-video {
       height: 60vh;
       max-width: 100%;
       width: 100%;
     }

     .apod-loading {
       height: 60vh;
       max-width: 100%;
       width: 100%;
     }

/* Мобільна адаптація */
@media (max-width: 768px) {
  .apod-image {
    max-height: 50vh;
  }
  
  .apod-video {
    height: 50vh;
  }
  
  .apod-loading {
    height: 50vh;
  }
}

@media (max-width: 576px) {
  .apod-image {
    max-height: 40vh;
  }
  
  .apod-video {
    height: 40vh;
  }
  
  .apod-loading {
    height: 40vh;
  }
}

/* Додаткові обмеження для великих екранів */
@media (min-width: 1200px) {
  .apod-image-card {
    max-width: 100%;
  }
  
  .apod-image {
    max-height: 75vh;
  }
  
  .apod-video {
    height: 75vh;
  }
}
</style>
