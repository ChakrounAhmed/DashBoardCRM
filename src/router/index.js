import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

// Lazy-loaded views (code splitting)
const DashboardView = () => import('@/views/DashboardView.vue')
const OpportunitesView = () => import('@/views/OpportunitesView.vue')
const InstallateurView = () => import('@/views/InstallateurView.vue')
const LotsView = () => import('@/views/LotsView.vue')
const FacturationView = () => import('@/views/FacturationView.vue')
const ParametresView = () => import('@/views/ParametresView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Tableau de bord — Helios Energy Suite',
      requiresAuth: false,
    },
  },
  {
    path: '/opportunites',
    name: 'opportunites',
    component: OpportunitesView,
    meta: { title: 'Opportunités — Helios Energy Suite' },
  },
  {
    path: '/installateurs',
    name: 'installateurs',
    component: InstallateurView,
    meta: { title: 'Installateurs — Helios Energy Suite' },
  },
  {
    path: '/lots',
    name: 'lots',
    component: LotsView,
    meta: { title: 'Lots — Helios Energy Suite' },
  },
  {
    path: '/facturation',
    name: 'facturation',
    component: FacturationView,
    meta: { title: 'Facturation — Helios Energy Suite' },
  },
  {
    path: '/parametres',
    name: 'parametres',
    component: ParametresView,
    meta: { title: 'Paramètres — Helios Energy Suite' },
  },
  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '404 — Page introuvable' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// Navigation guard — update document title
router.beforeEach((to) => {
  document.title = to.meta.title ?? 'Helios Energy Suite'
})

export default router
