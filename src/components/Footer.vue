<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import Logo from './Logo.vue'

const marqueeRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (marqueeRef.value) {
    const content = marqueeRef.value.querySelector('.marquee-content')
    if (content) {
      const clone = content.cloneNode(true)
      marqueeRef.value.appendChild(clone)

      gsap.to(marqueeRef.value.children, {
        xPercent: -100,
        repeat: -1,
        duration: 40,
        ease: "none"
      })
    }
  }
})
</script>

<template>
  <footer class="bg-accent-blue text-soft-black py-12 relative overflow-hidden flex flex-col gap-12">
    
    <!-- Marquee -->
    <div class="relative w-full overflow-hidden py-8 bg-soft-black/5">
      <div ref="marqueeRef" class="flex whitespace-nowrap">
        <div class="marquee-content flex gap-8 px-4">
          <span class="font-display text-8xl font-bold uppercase opacity-20">Menno Plochaet — Full Stack Developer — </span>
        </div>
      </div>
    </div>

    <!-- Links & Info -->
    <div class="container mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
      <div class="text-center md:text-left">
        <h2 class="font-display text-4xl font-bold">Let's Talk</h2>
        <p class="font-mono text-sm opacity-60 mt-2">Open for new opportunities</p>
      </div>

      <div class="flex gap-8 justify-center">
        <a href="https://www.linkedin.com/in/menno-plochaet-17321623b/" target="_blank" class="font-mono text-sm uppercase tracking-widest hover:font-bold transition-all">LinkedIn</a>

        <a href="mailto:plochaetm@gmail.com" class="font-mono text-sm uppercase tracking-widest hover:font-bold transition-all">Email</a>
      </div>

      <div class="flex flex-col items-center md:items-end gap-2 opacity-60">
        <Logo class="w-8 h-8 text-soft-black dark:text-soft-black" />
        <div class="font-mono text-xs">
          &copy; {{ new Date().getFullYear() }}
        </div>
      </div>
    </div>
  </footer>
</template>
