<script setup lang="ts">
import { portfolioData } from '../data/portfolio'
</script>

<template>
  <section class="py-28 px-4 md:px-12 lg:px-24 text-soft-black dark:text-off-white flex flex-col items-center justify-center text-center relative overflow-hidden">
    
    <div class="absolute inset-0 opacity-10 pointer-events-none">
    </div>

    <p class="font-mono text-accent-blue mb-4 uppercase tracking-widest text-sm">Contact</p>
    <h2 class="font-display text-4xl md:text-6xl font-bold uppercase mb-8 max-w-3xl">
      Let's build something useful
    </h2>
    
    <p class="font-mono text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto mb-10">
      Reach out if my work fits what you're building. I read email and LinkedIn equally.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <a 
        :href="'mailto:' + portfolioData.personal.email"
        class="group relative inline-flex items-center justify-center px-7 py-4 overflow-hidden font-mono font-medium tracking-tighter text-off-white bg-soft-black dark:text-soft-black dark:bg-off-white rounded-full transition-all duration-300 hover:bg-accent-blue hover:scale-105 z-10 min-w-44"
      >
        <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
        <span class="relative">Email me</span>
      </a>

      <a
        :href="portfolioData.personal.linkedin"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-7 py-4 font-mono font-medium tracking-tighter rounded-full border border-soft-black/20 dark:border-off-white/20 hover:border-accent-blue hover:text-accent-blue transition-all duration-300 min-w-44"
      >
        LinkedIn
      </a>
    </div>

  </section>
</template>
