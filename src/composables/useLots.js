/**
 * @file useLots.js
 * @description Composable pour les données lots.
 */

import { useQuery } from '@tanstack/vue-query'
import { fetchLots } from '@/services/api/mockApi.js'

export function useLots() {
  return useQuery({
    queryKey: ['lots'],
    queryFn: fetchLots,
  })
}
