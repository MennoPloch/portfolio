<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const cursor = ref<HTMLElement | null>(null)
const follower = ref<HTMLElement | null>(null)

const onMouseMove = (e: MouseEvent) => {
  // Check if lightbox is open (body has overflow hidden)
  if (document.body.style.overflow === 'hidden') {
    gsap.to([cursor.value, follower.value], { opacity: 0, duration: 0.2 })
    return
  }

  // Check for hoverable elements using event delegation
  const target = e.target as HTMLElement
  // Ensure target is an element and has closest method
  if (!target || typeof target.closest !== 'function') return

  const isHoverable = target.closest('a, button, .cursor-pointer')
  const isHidden = target.closest('.hide-cursor')

  if (isHidden) {
    gsap.to([cursor.value, follower.value], { opacity: 0, duration: 0.2 })
  } else {
    gsap.to([cursor.value, follower.value], { opacity: 1, duration: 0.2 })
    
    if (isHoverable) {
      gsap.to(follower.value, { scale: 3, backgroundColor: 'transparent', borderColor: 'currentColor', borderWidth: '1px', duration: 0.3 })
      gsap.to(cursor.value, { scale: 0, duration: 0.3 })
    } else {
      gsap.to(follower.value, { scale: 1, backgroundColor: 'currentColor', borderColor: 'transparent', borderWidth: '0px', duration: 0.3 })
      gsap.to(cursor.value, { scale: 1, duration: 0.3 })
    }
  }

  gsap.to(cursor.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: 'power2.out'
  })
  
  gsap.to(follower.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onMouseEnter = () => {
  gsap.to([cursor.value, follower.value], { opacity: 1, duration: 0.3 })
}

const onMouseLeave = () => {
  gsap.to([cursor.value, follower.value], { opacity: 0, duration: 0.3 })
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseenter', onMouseEnter)
  document.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseenter', onMouseEnter)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <div class="hidden md:block">
    <div ref="cursor" class="fixed top-0 left-0 w-2 h-2 bg-soft-black dark:bg-off-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"></div>
    <div ref="follower" class="fixed top-0 left-0 w-8 h-8 bg-soft-black/20 dark:bg-off-white/20 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-colors"></div>
  </div>
</template>
