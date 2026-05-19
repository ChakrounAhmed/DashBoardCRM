import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router/index.js'
import vuetify from './plugins/vuetify.js'
import vueQuery from './plugins/vueQuery.js'

// Global styles
import './assets/main.css'

const app = createApp(App)

// ── Plugins ────────────────────────────────────────────────────────────────
app.use(createPinia())   // State management
app.use(router)          // Vue Router
app.use(vuetify)         // UI components + theme
app.use(vueQuery)        // @tanstack/vue-query
app.use(VueApexCharts)   // Charts (component: <apexchart>)

app.mount('#app')
