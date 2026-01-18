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
  } else {
    // Ensure opacity is 1 if not hovering something else that handles opacity
    // But we rely on mouseenter/leave for general visibility, so just ensure it's not forced hidden by this check
    // Actually, let's just let the mouseenter/leave handle opacity, but if we are moving and not in lightbox, make sure it's visible if it was hidden by lightbox
    // Check for hide-cursor class
    const target = e.target as HTMLElement
    if (target && target.closest && target.closest('.hide-cursor')) {
      gsap.to([cursor.value, follower.value], { opacity: 0, duration: 0.2 })
      return
    }

    if (cursor.value && cursor.value.style.opacity === '0') {
       gsap.to([cursor.value, follower.value], { opacity: 1, duration: 0.2 })
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

const addHoverListeners = () => {
  const hoverables = document.querySelectorAll('a, button, .cursor-pointer')
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(follower.value, { scale: 3, backgroundColor: 'transparent', borderColor: 'currentColor', borderWidth: '1px', duration: 0.3 })
      gsap.to(cursor.value, { scale: 0, duration: 0.3 })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(follower.value, { scale: 1, backgroundColor: 'currentColor', borderColor: 'transparent', borderWidth: '0px', duration: 0.3 })
      gsap.to(cursor.value, { scale: 1, duration: 0.3 })
    })
  })
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseenter', onMouseEnter)
  document.addEventListener('mouseleave', onMouseLeave)
  
  // Re-add listeners when DOM changes (simple observer or just timeout for now)
  setTimeout(addHoverListeners, 1000)
  
  // Mutation observer for dynamic content
  const observer = new MutationObserver(addHoverListeners)
  observer.observe(document.body, { childList: true, subtree: true })
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
