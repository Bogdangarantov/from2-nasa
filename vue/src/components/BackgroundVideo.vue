<template>
  <div class="background-video-container">
    <video 
      class="background-video" 
      autoplay 
      muted 
      loop 
      playsinline
    >
      <source src="@/assets/1851190-uhd_3840_2160_25fps.mp4" type="video/mp4">
      Ваш браузер не підтримує відео.
    </video>
  </div>
</template>

<script setup lang="ts">
// Компонент фонового відео
</script>

<style scoped>
.background-video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  background: #000;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
