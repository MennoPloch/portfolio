<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
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

let lenis: Lenis

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
})

onUnmounted(() => {
  lenis.destroy()
})
</script>

<template>
  <div class="min-h-screen bg-off-white dark:bg-soft-black text-soft-black dark:text-off-white transition-colors duration-500 overflow-x-hidden font-sans selection:bg-accent-blue selection:text-soft-black">
    <Preloader />
    <CustomCursor />
    <ThemeToggle />
    
    <RouterView />
    
    <Footer />
  </div>
</template>
