import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store UI global.
 * Gère l'état de la sidebar, le thème (light/dark) et les notifications snackbar.
 */
export const useUiStore = defineStore('ui', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const sidebarOpen = ref(true)
  const theme = ref(localStorage.getItem('helios_theme') || 'light')

  /** @type {import('vue').Ref<{ show: boolean, text: string, color: string }>} */
  const snackbar = ref({ show: false, text: '', color: 'success' })

  // Filtre de période actif sur le tableau de bord
  const activePeriod = ref('Mensuel') // 'Hebdo' | 'Mensuel' | 'Annuel'

  // ── Actions ────────────────────────────────────────────────────────────────
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('helios_theme', theme.value)
  }

  /**
   * Affiche une notification snackbar.
   * @param {string} text
   * @param {'success'|'error'|'warning'|'info'} [color='success']
   */
  function showSnackbar(text, color = 'success') {
    snackbar.value = { show: true, text, color }
  }

  function hideSnackbar() {
    snackbar.value.show = false
  }

  return {
    sidebarOpen,
    theme,
    snackbar,
    activePeriod,
    toggleSidebar,
    toggleTheme,
    showSnackbar,
    hideSnackbar,
  }
})
