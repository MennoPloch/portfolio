<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const tl = gsap.timeline()

  tl.from(titleRef.value, {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    skewY: 10
  })
  .from('.not-found-text', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1
  }, '-=0.5')
  .from('.back-button', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.6')
})
</script>

<template>
  <div ref="containerRef" class="min-h-screen bg-off-white dark:bg-soft-black flex flex-col items-center justify-center px-4 overflow-hidden relative">
    
    <!-- Background Decor -->
    <div class="absolute inset-0 pointer-events-none opacity-5">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent-blue blur-[100px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-soft-black dark:bg-off-white blur-[120px]"></div>
    </div>

    <div class="relative z-10 text-center space-y-6 max-w-3xl">
      <h1 ref="titleRef" class="font-display text-[12rem] md:text-[16rem] leading-none font-bold text-soft-black/5 dark:text-off-white/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap">
        404
      </h1>
      
      <h2 class="not-found-text font-display text-5xl md:text-7xl font-bold uppercase leading-tight relative">
        Page <br/>
        <span class="text-accent-blue italic">Not Found</span>
      </h2>
      
      <p class="not-found-text font-mono text-lg md:text-xl opacity-60 max-w-lg mx-auto leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>

      <div class="back-button pt-8">
        <RouterLink 
          to="/" 
          class="inline-flex items-center gap-3 font-mono text-lg uppercase tracking-wider px-8 py-4 border-2 border-soft-black dark:border-off-white hover:bg-soft-black hover:text-off-white dark:hover:bg-off-white dark:hover:text-soft-black transition-all duration-300 group"
        >
          <span>← Back to Home</span>
        </RouterLink>
      </div>
    </div>

  </div>
</template>
