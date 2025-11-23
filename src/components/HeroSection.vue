<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isLoading } from '../store/loading'

gsap.registerPlugin(ScrollTrigger)

const heroText = ref<HTMLElement | null>(null)
const tagline = ref<HTMLElement | null>(null)
const backgroundLogo = ref<HTMLElement | null>(null)
const parallaxLayer = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.set([heroText.value?.querySelectorAll('.char'), tagline.value, backgroundLogo.value], {
    opacity: 0
  })

  const playEntrance = () => {
    const tl = gsap.timeline()
    
    tl.fromTo(heroText.value?.querySelectorAll('.char') || [], 
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.05,
        ease: 'power4.out'
      }
    )
    .fromTo(backgroundLogo.value, 
      { y: 100, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 3,
        ease: 'power4.out'
      }, '<')
    .fromTo(tagline.value, 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.5')
  }

  if (!isLoading.value) {
    playEntrance()
  } else {
    watch(isLoading, (newValue) => {
      if (!newValue) {
        playEntrance()
      }
    })
  }

  if (parallaxLayer.value) {
    gsap.to(parallaxLayer.value, {
      scrollTrigger: {
        trigger: 'section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: -150,
      ease: 'none'
    })
  }

  let proxy = { skew: 0 }
  let skewSetter = gsap.quickSetter(heroText.value, "skewY", "deg")
  let logoSkewSetter = gsap.quickSetter(backgroundLogo.value, "skewY", "deg")
  let clamp = gsap.utils.clamp(-20, 20)

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -300)
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3",
          overwrite: true,
          onUpdate: () => {
            skewSetter(proxy.skew)
            logoSkewSetter(proxy.skew * 0.2) // 20% of the skew for the logo
          }
        })
      }
    }
  })
})
</script>

<template>
  <section class="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden py-20">
    <div ref="heroText" class="text-center leading-[0.8] select-none text-soft-black dark:text-off-white relative z-10">
      <h1 class="font-display text-[12vw] md:text-[14vw] font-bold uppercase tracking-tighter" aria-label="Menno Plochaet">
        <div class="overflow-hidden" aria-hidden="true"><span class="char inline-block">M</span><span class="char inline-block">e</span><span class="char inline-block">n</span><span class="char inline-block">n</span><span class="char inline-block">o</span></div>
        <div class="overflow-hidden" aria-hidden="true"><span class="char inline-block">P</span><span class="char inline-block">l</span><span class="char inline-block">o</span><span class="char inline-block">c</span><span class="char inline-block">h</span><span class="char inline-block">a</span><span class="char inline-block">e</span><span class="char inline-block">t</span></div>
      </h1>
    </div>
      
    <div ref="backgroundLogo" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1000px] z-0 pointer-events-none opacity-10 dark:opacity-5">
      <div ref="parallaxLayer" class="w-full h-full">
        <svg viewBox="0 0 100 78" fill="none" class="w-full h-full text-gray-200 dark:text-[#2A2A2A]">
          <path d="M56.4498 78H45.1401C42.5325 78 40.6221 75.5451 41.2627 73.0174L54.6667 20.1261C55.6834 16.1143 61.3774 16.0987 62.4161 20.1049L65.3107 31.27C65.4358 31.7524 65.4696 32.2539 65.4105 32.7488L60.4215 74.4749C60.181 76.486 58.4752 78 56.4498 78Z" fill="currentColor"/>
          <path d="M14.2053 19.2059L1.19342 73.0606C0.585325 75.5774 2.4923 78 5.08154 78H16.654C18.5906 78 20.249 76.6127 20.5911 74.7067L26.8472 39.8513C26.9479 39.2902 26.9275 38.7142 26.7875 38.1616L21.9707 19.1624C20.945 15.1163 15.1856 15.1487 14.2053 19.2059Z" fill="currentColor"/>
          <path d="M80.7709 3.0065C80.3172 1.23724 78.7227 0 76.8962 0H65.155C62.5428 0 60.6316 2.46312 61.2804 4.9935L79.2291 74.9935C79.6828 76.7628 81.2773 78 83.1038 78H94.845C97.4572 78 99.3684 75.5369 98.7196 73.0065L80.7709 3.0065Z" fill="currentColor"/>
          <path d="M36.5714 0H25.1925C22.5687 0 20.6554 2.48364 21.3249 5.02061L35.0277 56.947C36.0831 60.9464 41.7727 60.9093 42.7759 56.8966L46.3041 42.7836C46.4334 42.2664 46.458 41.7286 46.3765 41.2017L40.5244 3.38824C40.2226 1.43852 38.5444 0 36.5714 0Z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    <div ref="tagline" class="absolute bottom-12 md:bottom-24 left-0 w-full text-center px-4">
      <p class="font-mono text-sm md:text-base uppercase tracking-widest opacity-60">
        Building digital experiences<br class="md:hidden"> that feel natural
      </p>
    </div>
    
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-accent-blue/20 blur-[100px] -z-10 animate-pulse"></div>
  </section>
</template>

<style scoped>
.char {
  will-change: transform;
}
</style>
