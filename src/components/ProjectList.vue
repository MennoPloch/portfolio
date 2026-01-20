<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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

const FIXED_HEIGHT = 220 // Fixed height for all preview images

// Cache for preloaded image dimensions
const imageDimensions = new Map<string, { width: number; height: number }>()

// Preload all project images and cache their dimensions
const preloadImages = () => {
  portfolioData.projects.forEach(project => {
    if (project.image) {
      const img = new Image()
      img.onload = () => {
        imageDimensions.set(project.image!, {
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      img.src = project.image
    }
  })
}

// Check which project is under the cursor (for scroll detection)
const checkHoveredProject = () => {
  if (window.matchMedia('(hover: none)').matches) return
  if (cursorX.value === 0 && cursorY.value === 0) return

  const element = document.elementFromPoint(cursorX.value, cursorY.value)
  if (!element) return

  const projectItem = element.closest('.project-item')
  if (projectItem) {
    const projectId = projectItem.getAttribute('data-project-id')
    const project = portfolioData.projects.find(p => String(p.id) === projectId)
    if (project && project.image && activeImage.value !== project.image) {
      setActiveImage(project.image)
    }
  }
}

const setActiveImage = (image: string) => {
  activeImage.value = image
  isHovering.value = true

  // Calculate target width based on cached dimensions
  const dims = imageDimensions.get(image)
  let targetWidth = FIXED_HEIGHT * 1.5 // Default aspect ratio fallback
  
  if (dims) {
    const aspectRatio = dims.width / dims.height
    targetWidth = FIXED_HEIGHT * aspectRatio
  }

  // Animate the container to show AND resize smoothly
  gsap.to('.project-media', {
    width: targetWidth,
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out'
  })
}

const onMouseMove = (e: MouseEvent) => {
  if (window.matchMedia('(hover: none)').matches) return

  cursorX.value = e.clientX
  cursorY.value = e.clientY
  
  gsap.to('.project-media', {
    left: e.clientX,
    top: e.clientY,
    xPercent: -50,
    yPercent: -50,
    duration: 0.5,
    ease: 'power2.out'
  })
}

const onMouseEnter = (image: string) => {
  if (window.matchMedia('(hover: none)').matches) return
  setActiveImage(image)
}

const onMouseLeave = () => {
  isHovering.value = false
  gsap.to('.project-media', {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      // Clear the image after fade-out to prevent stale renders
      if (!isHovering.value) {
        activeImage.value = null
      }
    }
  })
}

// Also hide when leaving the entire section
const onSectionLeave = () => {
  isHovering.value = false
  activeImage.value = null
  gsap.set('.project-media', { opacity: 0, scale: 0.8 })
}

const navigateToProject = (slug: string) => {
  router.push('/project/' + slug)
}

// Scroll handler to update hovered project
const handleScroll = () => {
  if (isHovering.value) {
    checkHoveredProject()
  }
}

onMounted(() => {
  preloadImages()
  window.addEventListener('scroll', handleScroll, { passive: true })
  
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

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="py-32 px-4 md:px-12 lg:px-24 min-h-screen relative" @mousemove="onMouseMove" @mouseleave="onSectionLeave">
    <h2 class="font-display text-4xl md:text-6xl font-bold mb-16 uppercase border-b border-soft-black dark:border-off-white pb-4">
      Selected Works
    </h2>

    <div class="project-list-container">
      <div 
        v-for="project in portfolioData.projects" 
        :key="project.id"
        class="project-item group relative flex flex-col 2xl:flex-row 2xl:items-center justify-between py-10 border-b border-soft-black/10 dark:border-off-white/10 transition-opacity duration-300 hide-cursor cursor-none"
        :data-project-id="project.id"
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
      v-show="isHovering || activeImage"
      class="project-media fixed pointer-events-none z-50 opacity-0 scale-75 overflow-hidden rounded-lg shadow-2xl"
      style="height: 220px;"
    >
      <img 
        v-if="activeImage" 
        :src="activeImage" 
        class="h-full w-full object-cover rounded-lg"
        alt="Project Preview"
      />
    </div>
  </section>
</template>

<style scoped>
.project-media {
  will-change: transform, opacity;
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-media img {
  will-change: auto;
}
</style>
