<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }

  gsap.fromTo('.theme-icon', 
    { rotation: 0, scale: 0.8 },
    { rotation: 360, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
  )
}

const onEnter = () => {
  gsap.to('.theme-icon', { scale: 1.1, rotation: 15, duration: 0.4, ease: 'back.out(1.7)' })
}

const onLeave = () => {
  gsap.to('.theme-icon', { scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' })
}

onMounted(() => {
  if (localStorage.theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  // Watch for external theme changes (e.g. from ChatView)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        isDark.value = document.documentElement.classList.contains('dark')
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <button 
    @click="toggleTheme" 
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    class="fixed top-8 right-8 z-50 p-4 rounded-full bg-soft-black dark:bg-off-white text-off-white dark:text-soft-black transition-colors duration-300"
    aria-label="Toggle Theme"
  >
    <div class="theme-icon w-6 h-6 flex items-center justify-center relative">
      <!-- Sun Icon -->
      <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <!-- Moon Icon -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  </button>
</template>
