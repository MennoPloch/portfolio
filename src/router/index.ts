import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import { getLenis } from '../utils/lenis'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/project/:slug',
            name: 'project-detail',
            component: ProjectDetail,
            meta: { isDetail: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFound.vue')
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('../views/ChatView.vue')
        }
    ],
    scrollBehavior(_to, _from, savedPosition) {
        return new Promise((resolve) => {
            const lenis = getLenis()

            // Wait for fast transition (200ms) to finish
            setTimeout(() => {
                if (savedPosition) {
                    if (lenis) {
                        lenis.scrollTo(savedPosition.top, { immediate: true })
                    }
                    resolve(savedPosition)
                } else {
                    if (lenis) {
                        lenis.scrollTo(0, { immediate: true })
                    } else {
                        window.scrollTo(0, 0)
                    }
                    resolve({ top: 0 })
                }
            }, 250) // 250ms delay matches transition time + buffer
        })
    }
})


import { useAnalytics } from '../composables/useAnalytics'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { logPageView } = useAnalytics()

// Prevent browser from restoring scroll position automatically
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
}

router.afterEach((to) => {
    logPageView(to.fullPath)

    // Refresh ScrollTrigger to recalculate positions after navigation
    // This prevents scroll jumps when returning from detail pages
    // Wait for transition (300ms) + scroll restoration (400ms) + buffer
    setTimeout(() => {
        ScrollTrigger.refresh()
    }, 800)
})

export default router
