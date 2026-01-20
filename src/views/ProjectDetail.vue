<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { portfolioData } from '../data/portfolio'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../utils/lenis'
import NotFound from './NotFound.vue'
import BackButton from '../components/BackButton.vue'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const projectSlug = route.params.slug as string
const project = computed(() => portfolioData.projects.find(p => p.slug === projectSlug))

// Gallery Logic
interface MediaItem {
  type: 'image' | 'video'
  src: string
  thumbnail?: string
}

const mediaItems = computed<MediaItem[]>(() => {
  if (!project.value) return []
  
  const items: MediaItem[] = []
  
  if (project.value.image) {
    items.push({ type: 'image', src: project.value.image })
  }
  
  if (project.value.gallery) {
    project.value.gallery.forEach(img => {
      if (img !== project.value?.image) {
        items.push({ type: 'image', src: img })
      }
    })
  }

  if (project.value.video) {
    items.push({ type: 'video', src: project.value.video })
  }

  return items
})

// Helper function to get thumbnail path
const getThumbnailPath = (originalPath: string): string => {
  // Extract the path after /images/
  const match = originalPath.match(/\/images\/(.+)/)
  if (match) {
    return `/images/Thumbnails/${match[1]}`
  }
  return originalPath
}

// Gallery State
const activeMediaIndex = ref(0)
const activeMedia = computed(() => mediaItems.value[activeMediaIndex.value])
const slideDirection = ref<'next' | 'prev'>('next')

const setActiveMedia = (index: number) => {
  if (index === activeMediaIndex.value) return
  
  // Determine direction with wrap-around logic
  const total = mediaItems.value.length
  
  if (activeMediaIndex.value === 0 && index === total - 1) {
    slideDirection.value = 'prev'
  } else if (activeMediaIndex.value === total - 1 && index === 0) {
    slideDirection.value = 'next'
  } else if (index > activeMediaIndex.value) {
    slideDirection.value = 'next'
  } else {
    slideDirection.value = 'prev'
  }
  
  const mainMediaElement = document.querySelector('.main-media-content')
  
  if (isLightboxOpen.value) {
    activeMediaIndex.value = index
    return
  }
  
  if (mainMediaElement) {
    gsap.to(mainMediaElement, {
      opacity: 0,
      scale: 0.98,
      duration: 0.05,
      onComplete: () => {
        activeMediaIndex.value = index
        gsap.fromTo('.main-media-content', 
          { opacity: 0, scale: 1.02 },
          { opacity: 1, scale: 1, duration: 0.05, ease: 'power2.out' }
        )
      }
    })
  } else {
    activeMediaIndex.value = index
  }
}

const nextMedia = () => {
  if (mediaItems.value.length <= 1) return
  const nextIndex = (activeMediaIndex.value + 1) % mediaItems.value.length
  setActiveMedia(nextIndex)
}

const prevMedia = () => {
  if (mediaItems.value.length <= 1) return
  const prevIndex = (activeMediaIndex.value - 1 + mediaItems.value.length) % mediaItems.value.length
  setActiveMedia(prevIndex)
}

const isLightboxOpen = ref(false)

const openLightbox = () => {
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

// Lock scroll when lightbox is open
watch(isLightboxOpen, (isOpen) => {
  const lenis = getLenis()
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    lenis?.stop()
  } else {
    document.body.style.overflow = ''
    lenis?.start()
  }
})

// Keyboard Navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (isLightboxOpen.value) {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextMedia()
    if (e.key === 'ArrowLeft') prevMedia()
  } else {
    if (e.key === 'ArrowRight') nextMedia()
    if (e.key === 'ArrowLeft') prevMedia()
  }
}

// Swipe Navigation
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (touch) {
    touchStartX.value = touch.screenX
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (touch) {
    touchEndX.value = touch.screenX
    handleSwipe()
  }
}

const handleSwipe = () => {
  if (touchEndX.value < touchStartX.value - 50) {
    nextMedia() // Swipe Left -> Next
  }
  if (touchEndX.value > touchStartX.value + 50) {
    prevMedia() // Swipe Right -> Prev
  }
}

const isScrolled = ref(false)
const scrollProgress = ref(0)
const isMobile = ref(false)
const currentCarouselIndex = ref(0)
const carouselRef = ref<HTMLElement | null>(null)

const updateScroll = () => {
  isScrolled.value = window.scrollY > 50
  
  // Calculate scroll progress
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (winScroll / height) * 100
  scrollProgress.value = scrolled
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const updateCarouselIndex = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollLeft = target.scrollLeft
  const width = target.clientWidth
  currentCarouselIndex.value = Math.round(scrollLeft / width)
}

const scrollToCarouselItem = (index: number) => {
  if (carouselRef.value) {
    const width = carouselRef.value.clientWidth
    carouselRef.value.scrollTo({
      left: width * index,
      behavior: 'smooth'
    })
  }
}





const openLightboxWithItem = (index: number) => {
  setActiveMedia(index)
  openLightbox()
}

onMounted(() => {
  window.addEventListener('scroll', updateScroll)
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', handleKeydown)
  checkMobile()
  
  const tl = gsap.timeline();
  
  tl.from('.project-header', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
  .from('.project-meta', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.gallery-section', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6');
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-off-white dark:bg-soft-black transition-colors duration-500">
    
    <!-- Navigation -->
    <BackButton :is-scrolled="isScrolled" />

    <!-- Scroll Progress Bar -->
    <div class="fixed top-0 left-0 h-1 bg-accent-blue z-50 transition-all duration-100 ease-out" :style="{ width: scrollProgress + '%' }"></div>

    <div v-if="project" class="pb-24">
      
      <!-- Hero Section -->
      <div class="relative min-h-[40vh] md:min-h-[50vh] flex flex-col justify-end p-4 md:p-12 lg:p-24 project-header">
        <div class="max-w-4xl space-y-6">
          <div class="flex flex-wrap gap-2 md:gap-4 mb-4">
            <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 rounded-sm border border-soft-black/20 dark:border-off-white/20 font-mono text-xs uppercase tracking-wider text-soft-black/70 dark:text-off-white/70 bg-transparent">
              #{{ tag }}
            </span>
          </div>
          <h1 class="font-display text-[10vw] md:text-8xl font-bold uppercase leading-[0.9] text-soft-black dark:text-off-white break-words hyphens-auto">
            {{ project.title }}
          </h1>
        </div>
      </div>

      <div class="px-4 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-12 lg:gap-24">
        
        <!-- Sticky Sidebar (Description) -->
        <div class="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12 project-meta min-w-0">
          <div class="space-y-8">
            <div class="border-t border-soft-black/10 dark:border-off-white/10 pt-4">
              <h3 class="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Role</h3>
              <p class="font-display text-xl">{{ project.role || 'Developer' }}</p>
            </div>
            <div class="border-t border-soft-black/10 dark:border-off-white/10 pt-4">
              <h3 class="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Year</h3>
              <p class="font-display text-xl">{{ project.year || '2024' }}</p>
            </div>
            <div v-if="project.link" class="border-t border-soft-black/10 dark:border-off-white/10 pt-4">
              <h3 class="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Link</h3>
              <a :href="project.link" target="_blank" class="font-mono text-accent-blue hover:underline break-all">
                Visit Project ↗
              </a>
            </div>
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <p class="font-mono text-lg leading-relaxed opacity-80 whitespace-pre-line break-words">
              {{ project.longDescription || project.description }}
            </p>
          </div>
        </div>

        <!-- Main Content & Gallery -->
        <div class="lg:col-span-8 space-y-8 gallery-section min-w-0">
          
          <!-- Desktop: Main Media Display -->
          <div 
            v-if="activeMedia && !isMobile"
            class="hidden md:block w-full aspect-video bg-soft-black/5 dark:bg-off-white/5 rounded-lg overflow-hidden cursor-zoom-in relative group border border-soft-black/10 dark:border-off-white/10"
            @click="openLightbox"
          >
            <div class="main-media-content w-full h-full flex items-center justify-center">
              <video
                v-if="activeMedia.type === 'video'"
                :src="activeMedia.src"
                class="w-full h-full object-contain"
                controls
                playsinline
              ></video>
              <img 
                v-else
                :src="activeMedia.src" 
                class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                :alt="project.title"
              />
            </div>
            
            <!-- Zoom Indicator -->
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-soft-black/80 text-off-white px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider backdrop-blur-sm">
              Expand
            </div>
          </div>

          <!-- Desktop: Thumbnail Strip -->
          <div 
            v-if="mediaItems.length > 1 && !isMobile" 
            ref="thumbnailStrip"
            class="hidden md:block relative max-w-full overflow-x-auto thumbnail-scroll"
          >
            <div class="flex gap-4 p-4 w-max">
              <button
                v-for="(item, index) in mediaItems"
                :key="index"
                @click="setActiveMedia(index)"
                class="relative flex-shrink-0 w-32 h-20 md:w-40 md:h-24 rounded-md overflow-hidden border-2 transition-all duration-300 snap-start group"
                :class="[
                  index === activeMediaIndex 
                    ? 'border-accent-blue scale-105 opacity-100 ring-2 ring-accent-blue/20' 
                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                ]"
              >
                <video
                  v-if="item.type === 'video'"
                  :src="item.src"
                  class="w-full h-full object-cover"
                  muted
                  preload="metadata"
                ></video>
                <img 
                  v-else
                  :src="getThumbnailPath(item.src)" 
                  class="w-full h-full object-cover"
                  loading="lazy"
                  alt="Thumbnail"
                />
                
                <!-- Video Indicator Icon -->
                <div v-if="item.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                    <div class="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-black border-b-[4px] border-b-transparent ml-0.5"></div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Mobile: Carousel -->
          <div v-if="isMobile" class="md:hidden w-full space-y-4">
            <div class="relative w-full aspect-video bg-soft-black/5 dark:bg-off-white/5 rounded-lg overflow-hidden border border-soft-black/10 dark:border-off-white/10">
              <div 
                class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                ref="carouselRef"
                @scroll="updateCarouselIndex"
              >
                <div 
                  v-for="(item, index) in mediaItems" 
                  :key="index"
                  class="w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative"
                  @click="openLightboxWithItem(index)"
                >
                  <video
                    v-if="item.type === 'video'"
                    :src="item.src"
                    class="w-full h-full object-contain"
                    controls
                    playsinline
                  ></video>
                  <img 
                    v-else
                    :src="item.src" 
                    class="w-full h-full object-contain"
                    :alt="project.title"
                  />
                </div>
              </div>
              
              <!-- Counter -->
              <span v-if="mediaItems.length > 1" class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                {{ currentCarouselIndex + 1 }} / {{ mediaItems.length }}
              </span>
            </div>

            
            <!-- Mobile Carousel Indicators -->
            <div v-if="mediaItems.length > 1" class="flex justify-center gap-2">
              <button 
                v-for="(_, index) in mediaItems" 
                :key="index"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="currentCarouselIndex === index ? 'bg-accent-blue w-4' : 'bg-soft-black/20 dark:bg-off-white/20'"
                @click="scrollToCarouselItem(index)"
              ></button>
            </div>
            
            <p v-if="mediaItems.length > 1" class="text-center text-xs font-mono opacity-50">Swipe to view more</p>
          </div>

        </div>
      </div>

    </div>

    <!-- 404 State -->
    <NotFound v-else />

    <!-- Lightbox -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isLightboxOpen && activeMedia" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-soft-black/98 p-4 md:p-12 cursor-zoom-out" 
        @click="closeLightbox"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- Navigation Arrows (Desktop) -->
        <button 
          v-if="mediaItems.length > 1"
          @click.stop="prevMedia"
          class="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 items-center justify-center rounded-full bg-soft-black/50 text-off-white border border-off-white/20 hover:bg-accent-blue hover:border-accent-blue transition-all duration-300 backdrop-blur-sm group"
          aria-label="Previous"
        >
          <span class="font-mono text-2xl group-hover:-translate-x-0.5 transition-transform">←</span>
        </button>

        <button 
          v-if="mediaItems.length > 1"
          @click.stop="nextMedia"
          class="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 items-center justify-center rounded-full bg-soft-black/50 text-off-white border border-off-white/20 hover:bg-accent-blue hover:border-accent-blue transition-all duration-300 backdrop-blur-sm group"
          aria-label="Next"
        >
          <span class="font-mono text-2xl group-hover:translate-x-0.5 transition-transform">→</span>
        </button>

        <div class="relative w-full h-full flex items-center justify-center overflow-hidden" @click.stop>
          <button 
            @click="closeLightbox" 
            class="fixed top-6 right-6 group flex items-center gap-3 z-[60] bg-soft-black/80 text-off-white px-6 py-3 rounded-full border border-off-white/20 hover:bg-accent-blue hover:border-accent-blue transition-all duration-300 shadow-lg backdrop-blur-md"
            aria-label="Close"
          >
            <span class="font-mono text-sm uppercase tracking-widest font-bold">Close</span>
            <span class="font-mono text-xl leading-none">✕</span>
          </button>
          
          <Transition :name="slideDirection === 'next' ? 'slide-next' : 'slide-prev'">
            <div :key="activeMediaIndex" class="absolute inset-0 flex items-center justify-center p-4 md:p-12">
              <video
                v-if="activeMedia.type === 'video'"
                :src="activeMedia.src"
                class="max-w-full max-h-full object-contain shadow-2xl"
                controls
                autoplay
              ></video>
              
              <img 
                v-else
                :src="activeMedia.src" 
                class="max-w-full max-h-full object-contain shadow-2xl"
                alt="Lightbox media"
              />
            </div>
          </Transition>
        </div>

        <!-- Bottom Controls (Dots + Hint) -->
        <div class="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-[60] pointer-events-none">
          <!-- Dots -->
          <div 
            v-if="mediaItems.length > 1"
            class="flex gap-3 pointer-events-auto bg-soft-black/50 px-6 py-3 rounded-full backdrop-blur-sm"
            @click.stop
          >
            <button 
              v-for="(_, index) in mediaItems" 
              :key="index"
              @click.stop="setActiveMedia(index)"
              class="h-2.5 rounded-full transition-all duration-300 relative"
              :class="activeMediaIndex === index ? 'bg-accent-blue w-8' : 'bg-off-white/40 hover:bg-off-white/80 w-2.5'"
              aria-label="Go to image"
            >
              <!-- Invisible hit area expansion -->
              <span class="absolute -inset-2"></span>
            </button>
          </div>
          
          <!-- Mobile Hint -->
          <p v-if="mediaItems.length > 1" class="md:hidden font-mono text-xs text-off-white/60 uppercase tracking-widest">
            Swipe to view more
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Slide Transitions */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  will-change: transform, opacity;
}

.slide-next-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-50px);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

/* Thumbnail scroll - show scrollbar */
.thumbnail-scroll {
  scroll-behavior: smooth;
  scrollbar-width: auto;
  scrollbar-color: rgba(100, 100, 100, 0.6) transparent;
}

.thumbnail-scroll::-webkit-scrollbar {
  height: 12px;
}

.thumbnail-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.thumbnail-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.thumbnail-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

:root.dark .thumbnail-scroll {
  scrollbar-color: rgba(200, 200, 200, 0.5) transparent;
}

:root.dark .thumbnail-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

:root.dark .thumbnail-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
}

:root.dark .thumbnail-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
