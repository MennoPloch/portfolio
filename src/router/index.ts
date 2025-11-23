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
        }
    ],
    scrollBehavior(to, _from, savedPosition) {
        const lenis = getLenis()

        // Always scroll to top on initial navigation or route change
        if (to.name === 'home' && !savedPosition) {
            if (lenis) {
                lenis.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo(0, 0)
            }
            return { top: 0 }
        }

        // If navigating to a detail page, ALWAYS start at top
        if (to.meta.isDetail) {
            if (lenis) {
                lenis.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo(0, 0)
            }
            return { top: 0 }
        }

        // If we have a saved position (e.g. clicking back button), restore it
        if (savedPosition) {
            if (lenis) {
                lenis.scrollTo(savedPosition.top, { immediate: true })
            }
            return savedPosition
        }

        // Otherwise, scroll to top
        if (lenis) {
            lenis.scrollTo(0, { immediate: true })
        }
        return { top: 0 }
    }
})

export default router
