import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store d'authentification.
 * Gère l'utilisateur connecté et le token de session.
 */
export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const user = ref(null)
  const token = ref(localStorage.getItem('helios_token') || null)

  // ── Getters ────────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const userInitials = computed(() => {
    if (!user.value?.name) return 'SH'
    return user.value.name
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  })

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * @param {{ id: number, name: string, email: string, role: string }} userData
   * @param {string} authToken
   */
  function login(userData, authToken) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('helios_token', authToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('helios_token')
  }

  // Hydrate l'utilisateur depuis un token existant (mock)
  function hydrate() {
    if (token.value && !user.value) {
      user.value = {
        id: 1,
        name: 'Shirley H.',
        email: 'shirley@helios-energy.fr',
        role: 'Admin',
      }
    }
  }

  return { user, token, isAuthenticated, userInitials, login, logout, hydrate }
})
