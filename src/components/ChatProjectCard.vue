<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  project: {
    title: string;
    slug: string;
    tags: string[];
    description: string;
  }
}>();

const router = useRouter();

const openProject = () => {
  router.push(`/project/${props.project.slug}`);
};
</script>

<template>
  <div 
    class="mt-2 mb-4 p-4 rounded-xl bg-white dark:bg-soft-black border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer group max-w-sm"
    @click="openProject"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-bold text-lg group-hover:text-accent-blue transition-colors">{{ project.title }}</h3>
      <div class="flex gap-1">
        <span 
          v-for="tag in project.tags.slice(0, 2)" 
          :key="tag"
          class="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 whitespace-nowrap"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
      {{ project.description }}
    </p>
    
    <button 
      class="text-xs font-bold uppercase tracking-wider text-accent-blue flex items-center gap-1 group-hover:gap-2 transition-all"
    >
      View Project 
      <span>→</span>
    </button>
  </div>
</template>
