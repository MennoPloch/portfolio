<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const props = defineProps<{
  project: {
    title: string;
    slug: string;
    tags: string[];
    description: string;
  }
}>();

const router = useRouter();
const cardRef = ref<HTMLElement | null>(null);
const rotation = ref({ x: 0, y: 0 });
const isHovering = ref(false);

const openProject = () => {
  router.push(`/project/${props.project.slug}`);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -2; // Reduced from 5 to 2 for subtlety
  const rotateY = ((x - centerX) / centerX) * 2;

  rotation.value = { x: rotateX, y: rotateY };
  isHovering.value = true;
};

const handleMouseLeave = () => {
  rotation.value = { x: 0, y: 0 };
  isHovering.value = false;
};

const cardStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${rotation.value.x}deg) rotateY(${rotation.value.y}deg) scale(${isHovering.value ? 1.02 : 1})`,
    transition: isHovering.value ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  };
});
</script>

<template>
  <div 
    ref="cardRef"
    class="mt-2 mb-4 p-4 rounded-xl bg-white dark:bg-soft-black border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md cursor-pointer group max-w-sm will-change-transform"
    :style="cardStyle"
    @click="openProject"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="flex justify-between items-start mb-2 pointer-events-none">
      <h3 class="font-bold text-lg group-hover:text-accent-blue transition-colors">{{ project.title }}</h3>
      <div class="flex gap-1">
        <span 
          v-for="tag in project.tags.slice(0, 2)" 
          :key="tag"
          class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 border border-black/20 dark:border-white/20 rounded-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
    
    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 pointer-events-none">
      {{ project.description }}
    </p>
    
    <button 
      class="text-xs font-bold uppercase tracking-wider text-accent-blue flex items-center gap-1 group-hover:gap-2 transition-all pointer-events-none"
    >
      View Project 
      <span>→</span>
    </button>
  </div>
</template>
