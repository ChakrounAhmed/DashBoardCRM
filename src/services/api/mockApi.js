/**
 * @file mockApi.js
 * @description Simule des appels réseau avec un délai artificiel.
 * Toutes les fonctions retournent une Promise — elles peuvent être remplacées
 * par de vrais appels axios sans modifier les composables ni les views.
 *
 * Migration vers une vraie API :
 *   Avant : import { fetchInstallateurs } from '@/services/api/mockApi.js'
 *   Après : import { fetchInstallateurs } from '@/services/api/installateurs.js'
 *           où fetchInstallateurs = () => axios.get('/api/installateurs').then(r => r.data)
 */

import {
  MOCK_INSTALLATEURS,
  MOCK_ZONES,
  MOCK_TREND,
  MOCK_SOUS_STATUTS,
  MOCK_FACTURATION,
  MOCK_LOTS_TREND,
  MOCK_OPPORTUNITES,
  MOCK_LOTS,
  MOCK_KPI,
} from '@/data/mockData.js'

/** Simule une latence réseau */
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── KPI ─────────────────────────────────────────────────────────────────────

/**
 * Retourne les indicateurs clés globaux du tableau de bord.
 * @returns {Promise<import('@/data/mockData.js').KpiGlobal>}
 */
export const fetchKpi = async () => {
  await delay(400)
  return MOCK_KPI
}

// ─── Trend ───────────────────────────────────────────────────────────────────

export const fetchTrend = async () => {
  await delay(500)
  return MOCK_TREND
}

export const fetchLotsTrend = async () => {
  await delay(500)
  return MOCK_LOTS_TREND
}

// ─── Sous-statuts & Facturation ───────────────────────────────────────────────

export const fetchSousStatuts = async () => {
  await delay(300)
  return MOCK_SOUS_STATUTS
}

export const fetchFacturation = async () => {
  await delay(300)
  return MOCK_FACTURATION
}

// ─── Installateurs ────────────────────────────────────────────────────────────

/**
 * Retourne la liste complète des installateurs.
 * @returns {Promise<import('@/data/mockData.js').Installateur[]>}
 */
export const fetchInstallateurs = async () => {
  await delay(600)
  return MOCK_INSTALLATEURS
}

/**
 * @param {number} id
 * @returns {Promise<import('@/data/mockData.js').Installateur>}
 */
export const fetchInstallateurById = async (id) => {
  await delay(400)
  const item = MOCK_INSTALLATEURS.find((i) => i.id === id)
  if (!item) throw new Error(`Installateur ${id} introuvable`)
  return item
}

// ─── Zones ────────────────────────────────────────────────────────────────────

export const fetchZones = async () => {
  await delay(400)
  return MOCK_ZONES
}

// ─── Opportunités ─────────────────────────────────────────────────────────────

/**
 * @returns {Promise<import('@/data/mockData.js').Opportunite[]>}
 */
export const fetchOpportunites = async () => {
  await delay(700)
  return MOCK_OPPORTUNITES
}

/**
 * @param {number} id
 * @returns {Promise<import('@/data/mockData.js').Opportunite>}
 */
export const fetchOpportuniteById = async (id) => {
  await delay(400)
  const item = MOCK_OPPORTUNITES.find((o) => o.id === id)
  if (!item) throw new Error(`Opportunité ${id} introuvable`)
  return item
}

// ─── Lots ─────────────────────────────────────────────────────────────────────

/**
 * @returns {Promise<import('@/data/mockData.js').Lot[]>}
 */
export const fetchLots = async () => {
  await delay(600)
  return MOCK_LOTS
}
