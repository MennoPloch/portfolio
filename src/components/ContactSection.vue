<script setup lang="ts">
import { portfolioData } from '../data/portfolio'
</script>

<template>
  <section class="py-32 px-4 md:px-12 lg:px-24 text-soft-black dark:text-off-white flex flex-col items-center justify-center text-center relative overflow-hidden">
    
    <div class="absolute inset-0 opacity-10 pointer-events-none">
    </div>

    <p class="font-mono text-accent-blue mb-4">Looking for talent?</p>
    <h2 class="font-display text-4xl md:text-8xl font-bold uppercase mb-8">
      Open for <br/> Opportunities
    </h2>
    
    <p class="font-mono text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl mx-auto mb-12">
      I'm currently seeking full-time opportunities where I can contribute to meaningful projects and grow as a developer.
    </p>



    <a 
      :href="'mailto:' + portfolioData.personal.email"
      class="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-mono font-medium tracking-tighter text-off-white bg-soft-black dark:text-soft-black dark:bg-off-white rounded-full transition-all duration-300 hover:bg-accent-blue hover:scale-105 z-10"
    >
      <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
      <span class="relative">Get In Touch</span>
    </a>

    <div class="mt-16 flex flex-col md:flex-row gap-8 items-center">

      <a :href="portfolioData.personal.linkedin" target="_blank" class="font-mono text-sm hover:text-accent-blue transition-colors uppercase tracking-widest">LinkedIn</a>
      <a href="https://github.com/MennoPloch" target="_blank" class="font-mono text-sm hover:text-accent-blue transition-colors uppercase tracking-widest">GitHub</a>
    </div>

  </section>
</template>
