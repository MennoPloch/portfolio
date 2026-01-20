<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import ProjectList from '../components/ProjectList.vue'
import ContactSection from '../components/ContactSection.vue'

const scrollProgress = ref(0)

const updateScroll = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (winScroll / height) * 100
  scrollProgress.value = scrolled
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
  <div class="px-4 md:px-12 lg:px-24">
    <!-- Scroll Progress Bar -->
    <div class="fixed top-0 left-0 h-1 bg-accent-blue z-50 transition-all duration-100 ease-out" :style="{ width: scrollProgress + '%' }"></div>

    <HeroSection />
    <AboutSection />
    <ProjectList />
    <ContactSection />
  </div>
</template>
