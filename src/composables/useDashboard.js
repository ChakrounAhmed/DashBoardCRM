/**
 * @file useDashboard.js
 * @description Composable principal du tableau de bord.
 * Regroupe tous les useQuery avec queryKey réactif (refetch auto sur changement de filtres).
 *
 * CORRECTION BUG : import { computed } ajouté (était manquant → ReferenceError)
 */

import { computed } from 'vue'  // ← CORRECTION : computed était utilisé sans être importé
import { useQuery } from '@tanstack/vue-query'
import { useDashboardStore } from '@/stores/dashboardStore.js'
import {
  fetchKpi,
  fetchTrend,
  fetchLotsTrend,
  fetchSousStatuts,
  fetchFacturation,
  fetchInstallateurs,
  fetchZones,
} from '@/services/api/mockApi.js'

export function useDashboard() {
  const dashStore = useDashboardStore()

  // queryKey réactif → VueQuery refetch automatiquement quand filtres changent
  const kpi          = useQuery({ queryKey: computed(() => ['kpi',           { ...dashStore.filtres }]), queryFn: fetchKpi,           staleTime: 30_000 })
  const trend        = useQuery({ queryKey: computed(() => ['trend',         { ...dashStore.filtres }]), queryFn: fetchTrend,         staleTime: 30_000 })
  const lotsTrend    = useQuery({ queryKey: computed(() => ['lotsTrend',     { ...dashStore.filtres }]), queryFn: fetchLotsTrend,     staleTime: 30_000 })
  const sousStatuts  = useQuery({ queryKey: computed(() => ['sousStatuts',   { ...dashStore.filtres }]), queryFn: fetchSousStatuts,   staleTime: 30_000 })
  const facturation  = useQuery({ queryKey: computed(() => ['facturation',   { ...dashStore.filtres }]), queryFn: fetchFacturation,   staleTime: 30_000 })
  const installateurs= useQuery({ queryKey: computed(() => ['installateurs', { ...dashStore.filtres }]), queryFn: fetchInstallateurs, staleTime: 30_000 })
  const zones        = useQuery({ queryKey: computed(() => ['zones',         { ...dashStore.filtres }]), queryFn: fetchZones,         staleTime: 30_000 })

  // isLoading global : vrai si au moins une requête principale charge
  const isLoading = computed(
    () =>
      kpi.isLoading.value         ||
      trend.isLoading.value       ||
      lotsTrend.isLoading.value   ||
      sousStatuts.isLoading.value
  )

  return { kpi, trend, lotsTrend, sousStatuts, facturation, installateurs, zones, isLoading }
}
