<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const activeImage = ref<string | null>(null)
const cursorX = ref(0)
const cursorY = ref(0)
const isHovering = ref(false)

const onMouseMove = (e: MouseEvent) => {
  if (window.matchMedia('(hover: none)').matches) return

  cursorX.value = e.clientX
  cursorY.value = e.clientY
  
  gsap.to('.project-media', {
    x: e.clientX,
    y: e.clientY,
    duration: 0.5,
    ease: 'power2.out'
  })
}

const onMouseEnter = (image: string) => {
  if (window.matchMedia('(hover: none)').matches) return

  activeImage.value = image
  isHovering.value = true
  gsap.to('.project-media', {
    scale: 1,
    opacity: 1,
    duration: 0.3
  })
}

const onMouseLeave = () => {
  isHovering.value = false
  gsap.to('.project-media', {
    scale: 0.8,
    opacity: 0,
    duration: 0.3
  })
}

const navigateToProject = (slug: string) => {
  router.push('/project/' + slug)
}

onMounted(() => {
  const items = document.querySelectorAll('.project-item')
  
  items.forEach((item) => {
    gsap.fromTo(item, 
      { x: -50, opacity: 1 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          end: 'top 15%',
          toggleActions: 'play none none reverse'
        },
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      }
    )
  })
})
</script>

<template>
  <section class="py-32 px-4 md:px-12 lg:px-24 min-h-screen relative" @mousemove="onMouseMove">
    <h2 class="font-display text-4xl md:text-6xl font-bold mb-16 uppercase border-b border-soft-black dark:border-off-white pb-4">
      Selected Works
    </h2>

    <div class="space-y-8 project-list-container">
      <div 
        v-for="project in portfolioData.projects" 
        :key="project.id"
        class="project-item group relative flex flex-col 2xl:flex-row 2xl:items-center justify-between py-8 border-b border-soft-black/10 dark:border-off-white/10 transition-opacity duration-300 hide-cursor cursor-none"
        @mouseenter="onMouseEnter(project.image || '')"
        @mouseleave="onMouseLeave"
        @click="navigateToProject(project.slug)"
      >
        <div class="z-10">
          <h3 class="font-display text-4xl md:text-7xl font-bold uppercase group-hover:translate-x-4 transition-transform duration-300">
            <RouterLink :to="'/project/' + project.slug" class="block">
              {{ project.title }}
            </RouterLink>
          </h3>
          <div class="flex flex-wrap gap-x-6 gap-y-2 mt-2 md:mt-4 font-mono text-sm opacity-60 group-hover:translate-x-4 transition-transform duration-300 delay-75">
            <span v-for="tag in project.tags" :key="tag" class="relative">
              {{ tag }}
              <span class="absolute -right-4 top-0 opacity-30">/</span>
            </span>
          </div>
        </div>

        <div class="2xl:text-right mt-6 2xl:mt-0 z-10 flex flex-col items-start 2xl:items-end gap-2">
          <p class="font-mono max-w-md opacity-80 group-hover:translate-x-4 2xl:group-hover:-translate-x-4 transition-transform duration-300 delay-100">
            {{ project.description }}
          </p>
          <!-- Mobile Click Indicator - Only on actual touch devices -->
          <div class="[@media(hover:none)]:flex hidden items-center gap-2 text-accent-blue font-mono text-sm uppercase tracking-wider">
            <span>View Project</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Image Reveal -->
    <div 
      class="project-media fixed top-0 left-0 h-[220px] w-auto pointer-events-none z-50 opacity-0 scale-75 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-soft-black shadow-2xl border border-transparent dark:border-off-white/10"
    >
      <img 
        v-if="activeImage" 
        :src="activeImage" 
        class="h-full w-auto object-contain opacity-90"
        alt="Project Preview"
      />
    </div>
  </section>
</template>

<style scoped>
.project-media {
  will-change: transform, opacity;
}
</style>
