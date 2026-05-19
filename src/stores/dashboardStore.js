/**
 * @file dashboardStore.js
 * @description Store Pinia central du dashboard.
 *   - Gestion des objectifs par KPI (persistés dans localStorage)
 *   - Filtres globaux réactifs (période, dates, installateurs, zones)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {

  // ── Objectifs ──────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'helios_objectifs'

  /**
   * @typedef {{ entreprise:string, typePeriode:string, periode:string, valeurCible:number, createdAt:string }} Objectif
   * @type {import('vue').Ref<Record<string, Objectif|null>>}
   */
  const objectifs = ref({
    volumeCAE:       null,
    chiffreAffaires: null,
    opportunites:    null,
    surfaceIsolee:   null,
    volumeInstalle:  null,
    nombreLots:      null,
    lotsTotal:       null,
    lotsDeposes:     null,
  })

  /** Charge les objectifs depuis le localStorage au démarrage */
  function chargerObjectifs() {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) objectifs.value = { ...objectifs.value, ...JSON.parse(s) }
    } catch { /* ignore */ }
  }

  /**
   * Enregistre un objectif pour un KPI donné
   * @param {string} kpiKey
   * @param {{ entreprise:string, typePeriode:string, periode:string, valeurCible:number }} data
   */
  function definirObjectif(kpiKey, data) {
    objectifs.value[kpiKey] = { ...data, createdAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectifs.value))
  }

  /** Supprime l'objectif d'un KPI */
  function supprimerObjectif(kpiKey) {
    objectifs.value[kpiKey] = null
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectifs.value))
  }

  /**
   * Retourne le statut de l'objectif : 'ok' (≥90%), 'warning' (70–89%), 'danger' (<70%), 'none'
   * @param {string} kpiKey
   * @param {number} valeurActuelle
   * @returns {'ok'|'warning'|'danger'|'none'}
   */
  function statutObjectif(kpiKey, valeurActuelle) {
    const obj = objectifs.value[kpiKey]
    if (!obj || !obj.valeurCible || !valeurActuelle) return 'none'
    const pct = (valeurActuelle / obj.valeurCible) * 100
    if (pct >= 90) return 'ok'
    if (pct >= 70) return 'warning'
    return 'danger'
  }

  /**
   * Retourne le pourcentage d'atteinte de l'objectif, ou null
   * @param {string} kpiKey
   * @param {number} valeurActuelle
   * @returns {number|null}
   */
  function pctObjectif(kpiKey, valeurActuelle) {
    const obj = objectifs.value[kpiKey]
    if (!obj || !obj.valeurCible || !valeurActuelle) return null
    return Math.round((valeurActuelle / obj.valeurCible) * 100)
  }

  // ── Filtres globaux ────────────────────────────────────────────────────────
  const filtres = ref({
    periode:        'Mensuel',    // 'Hebdo' | 'Mensuel' | 'Annuel'
    dateDebut:      '2025-01-01',
    dateFin:        '2025-03-31',
    installateurs:  [],           // [] = tous
    zones:          [],           // [] = toutes
  })

  /**
   * Met à jour un filtre
   * @param {string} key
   * @param {any} val
   */
  function setFiltre(key, val) {
    filtres.value[key] = val
  }

  return {
    objectifs,
    chargerObjectifs,
    definirObjectif,
    supprimerObjectif,
    statutObjectif,
    pctObjectif,
    filtres,
    setFiltre,
  }
})
