<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RouterView } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import Footer from './components/Footer.vue'
import CustomCursor from './components/CustomCursor.vue'
import Preloader from './components/Preloader.vue'
import { setLenis } from './utils/lenis'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const router = useRouter()
const showFooter = computed(() => route.path !== '/chat')
const isNavigating = ref(false)

const showDragMessage = ref(false)

let lenis: Lenis

// Drag/drop handlers for "Wrong Window" effect
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  showDragMessage.value = true
}

const handleDragLeave = (e: DragEvent) => {
  // Only hide if leaving the window entirely
  if (e.relatedTarget === null) {
    showDragMessage.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  showDragMessage.value = false
}

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  })

  setLenis(lenis)

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  router.beforeEach((_to, _from, next) => {
    isNavigating.value = true
    next()
  })

  router.afterEach(() => {
    // Show footer after transition completes
    setTimeout(() => {
      isNavigating.value = false
    }, 500)
  })

  // Drag/drop listeners
  window.addEventListener('dragover', handleDragOver)
  window.addEventListener('dragleave', handleDragLeave)
  window.addEventListener('drop', handleDrop)
})

onUnmounted(() => {
  lenis.destroy()
  window.removeEventListener('dragover', handleDragOver)
  window.removeEventListener('dragleave', handleDragLeave)
  window.removeEventListener('drop', handleDrop)
})
</script>

<template>
  <div 
    class="min-h-screen flex flex-col bg-off-white dark:bg-soft-black text-soft-black dark:text-off-white transition-all duration-500 overflow-x-hidden font-sans selection:bg-accent-blue selection:text-soft-black"
  >
    <Preloader />
    <CustomCursor />
    <ThemeToggle />
    
    <div class="flex-1 w-full flex flex-col min-h-screen">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
    
    <Footer v-show="showFooter && !isNavigating" />

    <!-- Wrong Window Drag Message -->
    <Transition name="fade">
      <div 
        v-if="showDragMessage"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-soft-black/80 backdrop-blur-md pointer-events-none"
      >
        <div class="text-center space-y-4">
          <div class="text-6xl">📁</div>
          <p class="text-off-white text-2xl font-display font-bold">This isn't Figma</p>
          <p class="text-off-white/60 font-mono text-sm">but I appreciate the energy.</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(2px);
}

/* Fade transition for drag message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
