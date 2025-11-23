<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { portfolioData } from '../data/portfolio'
import WavingHand from './WavingHand.vue'

const imageRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 60%',
      end: 'bottom top',
      toggleActions: 'play none none reverse'
    }
  })

  tl.from(imageRef.value, {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
  .from(textRef.value, {
    x: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.8')
})
</script>

<template>
  <section class="about-section py-24 px-4 md:px-12 lg:px-24 min-h-screen flex flex-col lg:flex-row gap-16 items-center justify-center overflow-hidden">
    
    <!-- Artistic Cutout Image -->
    <div ref="imageRef" class="relative w-full lg:w-1/2 max-w-md aspect-[3/4] group">
      <div class="absolute inset-0 bg-accent-blue/20 transform translate-x-4 translate-y-4 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
      <div class="w-full h-full relative overflow-hidden artistic-blob bg-soft-black/10 dark:bg-off-white/10">
        <!-- Placeholder for the user's picture -->
        <img 
          src="/images/Me/ProfilePicture.png" 
          alt="Menno Plochaet" 
          class="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100 opacity-100 group-hover:opacity-100"
          onerror="this.src='https://placehold.co/600x800/1a1a1a/FFF?text=Menno'"
        />
      </div>
    </div>

    <!-- Bio Text -->
    <div ref="textRef" class="lg:w-1/2 space-y-8">
      <h2 class="font-display text-5xl md:text-7xl font-bold uppercase leading-tight">
        Full Stack <br/>
        <span class="text-accent-blue italic">Developer</span>
      </h2>
      
      <p class="font-mono text-lg md:text-xl leading-relaxed opacity-80 max-w-xl">
        <span class="font-bold text-2xl mr-2">Hi there! <WavingHand /></span>
        {{ portfolioData.bio }}
      </p>

      <div class="grid grid-cols-2 gap-8 pt-8 border-t border-soft-black/10 dark:border-off-white/10">
        <div>
          <h3 class="font-display text-xl font-bold mb-2">Location</h3>
          <p class="font-mono opacity-60">{{ portfolioData.personal.location }}</p>
        </div>
        <div>
          <h3 class="font-display text-xl font-bold mb-2">Contact</h3>
          <a :href="'mailto:' + portfolioData.personal.email" class="font-mono opacity-60 hover:text-accent-blue transition-colors">
            {{ portfolioData.personal.email }}
          </a>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.artistic-blob {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}
</style>
