<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Matter from 'matter-js'
import { portfolioData } from '../data/portfolio'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

let engine: Matter.Engine
let render: Matter.Render
let runner: Matter.Runner

onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initPhysics()
        observer.disconnect()
      }
    })
  }, { threshold: 0.1 })

  observer.observe(containerRef.value)
})

function initPhysics() {
  if (!canvasRef.value || !containerRef.value) return

  const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events

  engine = Engine.create()
  engine.gravity.y = 0.5

  const width = containerRef.value.clientWidth
  const height = 600

  render = Render.create({
    canvas: canvasRef.value,
    engine: engine,
    options: {
      width,
      height,
      background: 'transparent',
      wireframes: false,
      pixelRatio: window.devicePixelRatio
    }
  })

  const wallOptions = { 
    isStatic: true, 
    render: { fillStyle: 'transparent' } 
  }
  
  const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions)
  const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions)
  const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions)

  Composite.add(engine.world, [ground, leftWall, rightWall])

  const allSkills = portfolioData.skills.flatMap(cat => cat.items)
  
  const ctx = document.createElement('canvas').getContext('2d')
  if (ctx) ctx.font = '16px "JetBrains Mono"'

  allSkills.forEach((skill) => {
    const textWidth = ctx ? ctx.measureText(skill).width + 40 : 100
    const x = Math.random() * (width - 100) + 50
    const y = -Math.random() * 500 - 50

    const body = Bodies.rectangle(x, y, textWidth, 40, {
      chamfer: { radius: 20 },
      restitution: 0.5,
      friction: 0.1,
      render: {
        fillStyle: document.documentElement.classList.contains('dark') ? '#FDFBF7' : '#0F0F0F',
        strokeStyle: 'transparent'
      },
      label: skill
    })

    Composite.add(engine.world, body)
  })

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })

  Composite.add(engine.world, mouseConstraint)
  render.mouse = mouse

  Events.on(render, 'afterRender', () => {
    const context = render.context
    context.font = '16px "JetBrains Mono"'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    
    const isDark = document.documentElement.classList.contains('dark')
    
    Composite.allBodies(engine.world).forEach(body => {
      if (!body.isStatic && body.label) {
        context.save()
        context.translate(body.position.x, body.position.y)
        context.rotate(body.angle)
        context.fillStyle = isDark ? '#0F0F0F' : '#FDFBF7'
        context.fillText(body.label, 0, 0)
        context.restore()
        
        body.render.fillStyle = isDark ? '#FDFBF7' : '#0F0F0F'
      }
    })
  })

  Render.run(render)
  runner = Runner.create()
  Runner.run(runner, engine)
}

onUnmounted(() => {
  if (render) {
    Matter.Render.stop(render)
    if (render.canvas) render.canvas.remove()
  }
  if (runner) Matter.Runner.stop(runner)
  if (engine) Matter.Engine.clear(engine)
})
</script>

<template>
  <section class="py-24 px-4 md:px-12 lg:px-24 min-h-screen flex flex-col lg:flex-row gap-12 items-center">
    <!-- Bio Text -->
    <div class="lg:w-1/2">
      <h2 class="font-display text-4xl md:text-6xl font-bold mb-8 uppercase">About Me</h2>
      <p class="font-mono text-lg md:text-xl leading-relaxed opacity-80 mb-8">
        {{ portfolioData.bio }}
      </p>
      
      <div class="space-y-4">
        <div v-for="(job, index) in portfolioData.timeline.slice(0, 2)" :key="index" class="border-l-2 border-soft-black dark:border-off-white pl-4">
          <h3 class="font-bold text-xl">{{ job.title }}</h3>
          <p class="text-sm opacity-60">{{ job.role }} | {{ job.period }}</p>
        </div>
      </div>
    </div>

    <!-- Physics Skills Area -->
    <div ref="containerRef" class="lg:w-1/2 w-full h-[600px] relative bg-soft-black/5 dark:bg-off-white/5 rounded-lg overflow-hidden">
      <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" role="img" aria-label="Interactive physics simulation of technical skills"></canvas>
    </div>
  </section>
</template>
