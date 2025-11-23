<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

import { isLoading } from '../store/loading'

const percentage = ref(0)
const show = ref(true)

onMounted(() => {
  const tl = gsap.timeline({
    onComplete: () => {
      show.value = false
      document.body.style.overflow = 'auto'
      isLoading.value = false
    }
  })

  document.body.style.overflow = 'hidden'

  tl.to(percentage, {
    value: 100,
    duration: 2,
    ease: 'power2.inOut',
    roundProps: 'value',
    onUpdate: () => {}
  })
  
  tl.to('.preloader', {
    yPercent: -100,
    duration: 0.8,
    ease: 'power4.inOut'
  })
})
</script>

<template>
  <div v-if="show" class="preloader fixed inset-0 z-[10000] bg-off-white dark:bg-soft-black flex items-center justify-center text-soft-black dark:text-off-white">
    <div class="text-9xl font-display font-bold">
      {{ Math.round(percentage) }}%
    </div>
  </div>
</template>
