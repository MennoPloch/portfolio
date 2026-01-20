<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  label?: string
  to?: string
  forcePill?: boolean
  isScrolled?: boolean
}>()

const router = useRouter()
const internalIsScrolled = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const magnetic = ref({ x: 0, y: 0 })

const updateScroll = () => {
  internalIsScrolled.value = window.scrollY > 50
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(props.to || '/')
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!buttonRef.value) return
  
  const rect = buttonRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const x = e.clientX - centerX
  const y = e.clientY - centerY
  
  // Magnetic strength
  magnetic.value = { x: x * 0.2, y: y * 0.2 }
}

const handleMouseLeave = () => {
  magnetic.value = { x: 0, y: 0 }
}

const buttonStyle = computed(() => {
  return {
    transform: `translate(${magnetic.value.x}px, ${magnetic.value.y}px)`,
    transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
})

onMounted(() => {
  window.addEventListener('scroll', updateScroll)
  updateScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
})
</script>

<template>
  <div 
    class="fixed top-8 left-4 md:left-8 z-50 pointer-events-none will-change-transform"
    :style="buttonStyle"
  >
    <button 
      ref="buttonRef"
      @click="goBack"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      class="pointer-events-auto inline-flex items-center justify-center transition-all duration-500 ease-out cursor-pointer"
      :class="[
        (props.isScrolled ?? internalIsScrolled) || forcePill
          ? 'bg-soft-black text-off-white dark:bg-off-white dark:text-soft-black px-6 py-2 rounded-full shadow-lg' 
          : 'text-soft-black dark:text-off-white opacity-60 hover:opacity-100 mix-blend-difference'
      ]"
    >
      <span class="font-mono text-sm uppercase tracking-widest flex items-center gap-2 pointer-events-none">
        <span v-if="!((props.isScrolled ?? internalIsScrolled) || forcePill)" class="text-lg leading-none -mt-[2px]">←</span>
        <span>{{ ((props.isScrolled ?? internalIsScrolled) || forcePill) ? 'Back' : (label || 'Back') }}</span>
      </span>
    </button>
  </div>
</template>
