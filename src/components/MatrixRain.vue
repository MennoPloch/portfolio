<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;


  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();


  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charArray = chars.split('');
  
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  

  const drops: number[] = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  let frameCount = 0;


  let isDark = document.documentElement.classList.contains('dark');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        isDark = document.documentElement.classList.contains('dark');
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  const draw = () => {

    frameCount++;
    if (frameCount % 12 !== 0) {
      animationId = requestAnimationFrame(draw);
      return;
    }


    ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = isDark ? '#0F0' : '#003300'; // Bright green in dark, dark green in light
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)] || '';
      const dropY = drops[i] || 0;
      
      ctx.fillText(text, i * fontSize, dropY * fontSize);


      if (dropY * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }


      drops[i] = (drops[i] || 0) + 1;
    }
    
    animationId = requestAnimationFrame(draw);
  };

  draw();

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
    observer.disconnect();
  });
});
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 z-0 pointer-events-none opacity-10 dark:opacity-20"
  ></canvas>
</template>
