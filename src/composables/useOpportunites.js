/**
 * @file useOpportunites.js
 * @description Composable pour les données opportunités.
 */

import { useQuery } from '@tanstack/vue-query'
import { fetchOpportunites, fetchOpportuniteById } from '@/services/api/mockApi.js'

export function useOpportunites() {
  return useQuery({
    queryKey: ['opportunites'],
    queryFn: fetchOpportunites,
  })
}

/**
 * @param {import('vue').Ref<number>} id
 */
export function useOpportunite(id) {
  return useQuery({
    queryKey: computed(() => ['opportunites', id.value]),
    queryFn: () => fetchOpportuniteById(id.value),
    enabled: computed(() => !!id.value),
  })
}
