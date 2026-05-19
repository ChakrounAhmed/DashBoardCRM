/**
 * @file useSnackbar.js
 * @description Composable de notification — équivalent du toast Sonner du projet React.
 * Utilise le uiStore pour piloter le <v-snackbar> global dans App.vue.
 */

import { useUiStore } from '@/stores/uiStore.js'

export function useSnackbar() {
  const ui = useUiStore()

  /**
   * @param {string} text
   * @param {'success'|'error'|'warning'|'info'} [color]
   */
  const success = (text) => ui.showSnackbar(text, 'success')
  const error = (text) => ui.showSnackbar(text, 'error')
  const warning = (text) => ui.showSnackbar(text, 'warning')
  const info = (text) => ui.showSnackbar(text, 'info')

  return { success, error, warning, info }
}
