<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  label?: string
  to?: string
  forcePill?: boolean
}>()

const router = useRouter()
const isScrolled = ref(false)

const updateScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(props.to || '/')
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScroll)
  updateScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
})
</script>

<template>
  <div class="fixed top-8 left-4 md:left-8 z-50 pointer-events-none">
    <button 
      @click="goBack"
      class="pointer-events-auto inline-flex items-center justify-center transition-all duration-500 ease-out cursor-pointer"
      :class="[
        isScrolled || forcePill
          ? 'bg-soft-black text-off-white dark:bg-off-white dark:text-soft-black px-6 py-2 rounded-full shadow-lg' 
          : 'text-soft-black dark:text-off-white opacity-60 hover:opacity-100 mix-blend-difference'
      ]"
    >
      <span class="font-mono text-sm uppercase tracking-widest flex items-center gap-2">
        <span v-if="!(isScrolled || forcePill)" class="text-lg leading-none -mt-[2px]">←</span>
        <span>{{ (isScrolled || forcePill) ? 'Back' : (label || 'Back') }}</span>
      </span>
    </button>
  </div>
</template>
