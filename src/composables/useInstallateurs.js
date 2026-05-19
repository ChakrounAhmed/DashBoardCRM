/**
 * @file useInstallateurs.js
 * @description Composable pour les données installateurs.
 */

import { useQuery } from '@tanstack/vue-query'
import { fetchInstallateurs, fetchInstallateurById } from '@/services/api/mockApi.js'

/**
 * Retourne la liste complète des installateurs.
 */
export function useInstallateurs() {
  return useQuery({
    queryKey: ['installateurs'],
    queryFn: fetchInstallateurs,
  })
}

/**
 * Retourne un installateur par son id.
 * @param {import('vue').Ref<number>} id
 */
export function useInstallateur(id) {
  return useQuery({
    queryKey: computed(() => ['installateurs', id.value]),
    queryFn: () => fetchInstallateurById(id.value),
    enabled: computed(() => !!id.value),
  })
}
