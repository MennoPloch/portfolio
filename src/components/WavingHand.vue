<script setup lang="ts">
import { ref } from 'vue'

const isHovered = ref(false)

const onMouseEnter = () => {
  isHovered.value = true
}

const onMouseLeave = () => {
  isHovered.value = false
}
</script>

<template>
  <span 
    class="inline-block relative cursor-default select-none origin-[70%_70%]"
    :class="{ 'animate-wave': !isHovered, 'animate-pop': isHovered }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    👋
  </span>
</template>

<style scoped>
@keyframes wave {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.animate-wave {
  animation: wave 2.5s infinite;
  animation-timing-function: ease-in-out;
  transform-origin: 70% 70%;
}

@keyframes pop {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.4) rotate(10deg); }
  100% { transform: scale(1.2) rotate(0deg); }
}

.animate-pop {
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
