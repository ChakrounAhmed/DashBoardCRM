<template>
  <div class="dash-root" @click="handleRootClick">
    <!-- ── Breadcrumb ──────────────────────────────────────────────────────── -->
    <div class="crm-bc">
      <div>Tableau de bord &rsaquo; <span class="crm-bc-active">Vue globale</span></div>

      <!-- Objectifs KPI  -->
      <div class="crm-obj-wrap">
        <button class="crm-icon-btn" title="Objectifs KPI" @click="showObjMenu = !showObjMenu">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </button>
        <div v-if="showObjMenu" class="crm-obj-dropdown">
          <p class="crm-obj-title">Définir un objectif</p>
          <button
            v-for="card in kpiCards"
            :key="card.label"
            class="crm-obj-item"
            @click="(ouvrirObjectif(card), (showObjMenu = false))"
          >
            <v-icon :icon="card.icon" size="13" class="me-2" style="color: #a78bfa" />
            {{ card.label }}
          </button>
        </div>
        <div v-if="showObjMenu" class="crm-overlay" @click="showObjMenu = false" />
      </div>
    </div>

    <!-- ── Page Header ────────────────────────────────────────────────────── -->
    <div class="crm-ph">
      <div class="crm-ph-left">
        <h1 class="crm-ph-title">Tableau de bord</h1>
        <p class="crm-ph-sub">
          Indicateurs et graphiques — actualisé aujourd'hui à {{ heureActu }}
        </p>
      </div>

      <!-- Filtres header — IMAGE 6 -->
      <div class="crm-hacts">
        <span class="crm-flbl">Du</span>
        <input type="date" v-model="dashStore.filtres.dateDebut" class="crm-date-input" />
        <span class="crm-flbl">au</span>
        <input type="date" v-model="dashStore.filtres.dateFin" class="crm-date-input" />
        <!-- Select avec chevron visible — IMAGE 6 -->
        <div class="crm-ssel-wrap">
          <select v-model="dashStore.filtres.periode" class="crm-ssel">
            <option value="Hebdo">Hebdomadaire</option>
            <option value="Mensuel">Mensuel</option>
            <option value="Trimestriel">Trimestriel</option>
            <option value="Annuel">Annuel</option>
          </select>
          <svg class="crm-ssel-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            />
          </svg>
        </div>
        <!-- Bouton Actualiser — IMAGE 6 -->
        <button class="crm-btnref" :disabled="isRefreshing" @click="actualiser">
          <svg
            class="crm-ref-icon"
            :class="{ 'crm-ref-spin': isRefreshing }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M1 4v6h6" />
            <path d="M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          {{ isRefreshing ? 'Chargement...' : 'Actualiser' }}
        </button>
      </div>
    </div>

    <!-- ── KPI Cards ──────────────────────────────────────────────────────── -->
    <div class="crm-kpis">
      <template v-if="isLoading">
        <div v-for="n in 8" :key="n" class="crm-kpi crm-kpi--skeleton" />
      </template>
      <template v-else-if="kpi.data.value">
        <div
          v-for="card in kpiCards"
          :key="card.label"
          class="crm-kpi"
          :style="{ '--kc': card.color }"
          @click="ouvrirDrill(card.drillKey)"
        >
          <button
            v-if="card.key"
            class="kpi-obj-btn"
            :title="`Objectif — ${card.label}`"
            @click.stop="ouvrirObjectif(card)"
          >
            ⊙
          </button>
          <div class="crm-kl">{{ card.label }}</div>
          <div class="crm-kv">
            {{ card.value }}<span v-if="card.unit" class="crm-ku">{{ card.unit }}</span>
          </div>
          <div class="crm-kd" :class="card.deltaPos ? 'kd-up' : 'kd-dn'">
            {{ card.deltaPos ? '↑' : '↓' }} {{ Math.abs(card.delta ?? 0).toFixed(1) }}%
          </div>
          <div
            v-if="card.key && dashStore.pctObjectif(card.key, card.rawValue) !== null"
            class="kpi-obj-badge"
            :class="`badge-${dashStore.statutObjectif(card.key, card.rawValue)}`"
          >
            ⚑ {{ dashStore.pctObjectif(card.key, card.rawValue) }}% obj.
          </div>
        </div>
      </template>
    </div>

    <div class="crm-body">
      <!-- ── Filtrer par acteur ─────────────────────────────────────────── -->
      <div class="crm-ap">
        <div class="crm-ap-head">
          <svg
            width="15"
            height="15"
            fill="none"
            stroke="#7c3aed"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="7" r="4" />
            <path d="M3 20c0-4 2.7-6 6-6s6 2 6 6" />
            <path d="M17 14s3 1 3 4" />
            <path d="M15 7c1.2-.6 2.8-.6 4 0a3 3 0 0 1 0 5.2" />
          </svg>
          <span class="crm-ap-title">Filtrer par acteur</span>
        </div>

        <div class="crm-ap-sels">
          <!-- ── Select Type d'acteur — IMAGE 2 ─────────────────────────── -->
          <div class="crm-sg">
            <label class="crm-sg-label">Type d'acteur</label>
            <div class="crm-msw">
              <!-- Trigger -->
              <div
                class="crm-mst"
                :class="{ 'crm-mst--open': showTypeDD }"
                @click.stop="toggleTypeDD"
              >
                <div class="crm-mst-pills">
                  <span v-if="!selTypes.length" class="crm-mph">Sélectionner un type...</span>
                  <span v-for="tid in selTypes" :key="tid" class="crm-mpill">
                    {{ typesActeur.find((t) => t.id === tid)?.label }}
                    <span class="crm-pill-rm" @click.stop="removeType(tid)">×</span>
                  </span>
                </div>
                <svg
                  class="crm-mst-chevron"
                  :class="{ 'crm-mst-chevron--open': showTypeDD }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  />
                </svg>
              </div>

              <!-- Dropdown — position:fixed pour passer au-dessus de tout (IMAGE 2) -->
              <Teleport to="body">
                <div v-if="showTypeDD" class="crm-mdd-fixed" :style="typeDropStyle" @click.stop>
                  <div class="crm-mdd-scroll">
                    <div
                      v-for="t in typesActeur"
                      :key="t.id"
                      class="crm-mopt"
                      :class="{ 'crm-mopt--sel': selTypes.includes(t.id) }"
                      @click="toggleType(t.id)"
                    >
                      <span class="crm-mchk" :class="{ 'crm-mchk--on': selTypes.includes(t.id) }">
                        <svg v-if="selTypes.includes(t.id)" viewBox="0 0 12 12" fill="white">
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      </span>
                      <span>{{ t.label }}</span>
                    </div>
                  </div>
                  <div class="crm-mdd-footer" @click="selectAllTypes">✓ Tout sélectionner</div>
                </div>
              </Teleport>
            </div>
          </div>

          <!-- ── Select Acteurs — IMAGE 3 groupes ───────────────────────── -->
          <div class="crm-sg">
            <label class="crm-sg-label">Acteur(s)</label>
            <div class="crm-msw">
              <!-- Trigger -->
              <div
                class="crm-mst"
                :class="{ 'crm-mst--open': showActorDD }"
                @click.stop="toggleActorDD"
              >
                <div class="crm-mst-pills">
                  <span v-if="!selActors.length" class="crm-mph">Sélectionner des acteurs...</span>
                  <span v-for="aid in selActors" :key="aid" class="crm-mpill crm-mpill--actor">
                    {{ acteurs.find((a) => a.id === aid)?.name }}
                    <span class="crm-pill-rm" @click.stop="removeActor(aid)">×</span>
                  </span>
                </div>
                <svg
                  class="crm-mst-chevron"
                  :class="{ 'crm-mst-chevron--open': showActorDD }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  />
                </svg>
              </div>

              <!-- Dropdown acteurs groupés — IMAGE 3 -->
              <Teleport to="body">
                <div v-if="showActorDD" class="crm-mdd-fixed" :style="actorDropStyle" @click.stop>
                  <div class="crm-mdd-search">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      stroke-width="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                      v-model="actorSearch"
                      type="text"
                      placeholder="Rechercher un acteur..."
                      @click.stop
                    />
                  </div>
                  <div class="crm-mdd-scroll">
                    <!-- Groupes par type — IMAGE 3 -->
                    <template v-for="tid in visibleActorTypes" :key="tid">
                      <div class="crm-mgrp">{{ typesActeur.find((t) => t.id === tid)?.label }}</div>
                      <div
                        v-for="actor in filteredActorsByType(tid)"
                        :key="actor.id"
                        class="crm-mopt"
                        :class="{ 'crm-mopt--sel': selActors.includes(actor.id) }"
                        @click="toggleActor(actor.id)"
                      >
                        <span
                          class="crm-mchk"
                          :class="{ 'crm-mchk--on': selActors.includes(actor.id) }"
                        >
                          <svg v-if="selActors.includes(actor.id)" viewBox="0 0 12 12" fill="white">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        </span>
                        <span>{{ actor.name }}</span>
                      </div>
                    </template>
                    <div v-if="!visibleActorTypes.length" class="crm-mdd-empty">
                      Aucun acteur disponible
                    </div>
                  </div>
                  <div class="crm-mdd-footer" @click="selectAllActors">✓ Tout sélectionner</div>
                </div>
              </Teleport>
            </div>
          </div>

          <!-- Preview noms acteurs sélectionnés -->
          <p v-if="acteursBadge" class="crm-act-info">{{ acteursBadge }}</p>
        </div>
      </div>

      <!-- ── Section Performance par acteur ─────────────────────────────── -->
      <div class="crm-sh">
        <h2 class="crm-sh-title">Performance par acteur</h2>
        <span class="crm-badge">{{ acteursBadgeCount }}</span>
      </div>

      <!-- Grille 3 graphes acteurs — IMAGE 1 : CAE gauche, Opps droite -->
      <div class="crm-g3">
        <!-- 1. CA (violet) | Opportunités (orange) — barres denses -->
        <div class="crm-card crm-card--chart">
          <div class="crm-ch">
            <div class="crm-ct">CA &amp; Opportunités par acteur</div>
          </div>
          <div class="crm-leg">
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #7c3aed"></span>CA (€)</span
            >
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #f97316"></span>Opportunités</span
            >
          </div>
          <apexchart type="bar" :height="chartH" :options="actCAOpts" :series="actCASeries" />
        </div>

        <!-- 2. Volume CAE installé (vert) | déposé (bleu foncé) -->
        <div class="crm-card crm-card--chart">
          <div class="crm-ch">
            <div class="crm-ct">Volume CAE par acteur</div>
          </div>
          <div class="crm-leg">
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #10b981"></span>Installé (GWh/an)</span
            >
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #3730a3"></span>Déposé (GWh/an)</span
            >
          </div>
          <apexchart type="bar" :height="chartH" :options="actCAEOpts" :series="actCAESeries" />
        </div>

        <!-- 3. Surface (cyan) | Opportunités (rose) -->
        <div class="crm-card crm-card--chart">
          <div class="crm-ch">
            <div class="crm-ct">Surface isolée &amp; Opportunités</div>
          </div>
          <div class="crm-leg">
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #06b6d4"></span>Surface (m²)</span
            >
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #ec4899"></span>Opportunités</span
            >
          </div>
          <apexchart type="bar" :height="chartH" :options="actSurfOpts" :series="actSurfSeries" />
        </div>
      </div>

      <!-- ── Sous-statuts ──────────────────────────────────────────────── -->
      <div class="crm-sh">
        <h2 class="crm-sh-title">Opportunités par sous-statut</h2>
        <span class="crm-badge">Vue globale</span>
      </div>
      <div class="crm-card" style="cursor: pointer" @click="ouvrirDrill('sousStatuts')">
        <div class="crm-ch">
          <div>
            <div class="crm-ct">Nombre d'opportunités par sous-statut du pipeline</div>
            <div class="crm-cm">Données cumulées sur la période</div>
          </div>
          <span class="total-badge"
            >TOTAL <strong>{{ sousStatutsFull.reduce((a, s) => a + s.n, 0) }}</strong></span
          >
        </div>
        <apexchart type="bar" height="300" :options="ssOpts" :series="ssSeries" />
      </div>

      <!-- ── Zones géographiques ───────────────────────────────────────── -->
      <div class="crm-sh">
        <h2 class="crm-sh-title">Analyse par zone géographique</h2>
        <span class="crm-badge">{{ zonesGeo.noms.length }} zones</span>
      </div>
      <div class="crm-g2">
        <div class="crm-card crm-card--chart" style="cursor: pointer" @click="ouvrirDrill('zones')">
          <div class="crm-ch"><div class="crm-ct">Volume CAE par zone</div></div>
          <div class="crm-leg">
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #10b981"></span>Installé (GWh/an)</span
            >
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #3730a3"></span>Déposé (GWh/an)</span
            >
          </div>
          <apexchart type="bar" height="250" :options="zoneCaeOpts" :series="zoneCaeSeries" />
        </div>
        <div
          class="crm-card crm-card--chart"
          style="cursor: pointer"
          @click="ouvrirDrill('oppsParZone')"
        >
          <div class="crm-ch">
            <div class="crm-ct">Surface isolée &amp; Opportunités par zone</div>
          </div>
          <div class="crm-leg">
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #7c3aed"></span>Surface (m²)</span
            >
            <span class="crm-li"
              ><span class="crm-lsq" style="background: #f97316"></span>Opportunités</span
            >
          </div>
          <apexchart type="bar" height="250" :options="zoneSurfOpts" :series="zoneSurfSeries" />
        </div>
      </div>

      <p class="crm-footer">
        <span class="crm-footer-dot">●</span>
        Données mises à jour il y a 2 minutes · Helios Energy Suite — iCRM Énergie
      </p>
    </div>

    <!-- DrillDown Modal -->
    <DrillDownModal
      v-model="drill.open"
      :titre="drill.titre"
      :sous-titre="drill.sousTitre"
      :donnees="drill.donnees"
      :colonnes="drill.colonnes"
      :nom-fichier="drill.nomFichier"
    />

    <!-- ObjectifModal -->
    <ObjectifModal
      v-if="kpiCible"
      v-model="kpiModalOpen"
      :kpi-key="kpiCible.key"
      :kpi-label="kpiCible.label"
      :kpi-unit="kpiCible.unit ?? ''"
      :valeur-actuelle="kpiCible.rawValue"
      :objectif-existant="dashStore.objectifs[kpiCible.key]"
      @enregistrer="({ kpiKey: k, objectif: o }) => dashStore.definirObjectif(k, o)"
      @supprimer="(k) => dashStore.supprimerObjectif(k)"
    />
  </div>
</template>

<script setup>
  import { ref, computed, reactive, nextTick, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
  import { useQueryClient } from '@tanstack/vue-query'
  import { useDashboard } from '@/composables/useDashboard.js'
  import { useDashboardStore } from '@/stores/dashboardStore.js'
  import {
    MOCK_ACTEURS,
    MOCK_TYPES_ACTEUR,
    ACTEUR_COLORS,
    MOCK_SOUS_STATUTS_FULL,
    MOCK_ZONES_GEO,
    MOCK_ZONES,
  } from '@/data/mockData.js'
  import DrillDownModal from '@/components/dashboard/DrillDownModal.vue'
  import ObjectifModal from '@/components/dashboard/ObjectifModal.vue'

  const dashStore = useDashboardStore()
  const queryClient = useQueryClient()
  const { kpi, trend, lotsTrend, sousStatuts, facturation, installateurs, zones, isLoading } =
    useDashboard()

  const heureActu = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const isRefreshing = ref(false)

  // ── Formatters ────────────────────────────────────────────────────────────────
  const nf = new Intl.NumberFormat('fr-FR')
  const fmt = (n) => nf.format(n)
  const fmtEur = (n) => nf.format(n) + ' €'
  const fmtSurf = (n) => nf.format(n) + ' m²'
  const fmtShort = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M€`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k€`
    return `${n}€`
  }

  const kpiList = computed(() => [
    {
      key: 'volumeCAE',
      label: 'Volume CAE',
      unit: 'kWh',
      icon: 'mdi-lightning-bolt',
      valeurActuelle: kpi.data.value?.volumeCae,
    },
    {
      key: 'chiffreAffaires',
      label: "Chiffre d'affaires",
      unit: '€',
      icon: 'mdi-currency-eur',
      valeurActuelle: kpi.data.value?.chiffreAffaires,
    },
    {
      key: 'opportunites',
      label: 'Opportunités',
      unit: 'opps',
      icon: 'mdi-briefcase-outline',
      valeurActuelle: kpi.data.value?.opportunites,
    },
    {
      key: 'surfaceIsolee',
      label: 'Surface isolée',
      unit: 'm²',
      icon: 'mdi-home-outline',
      valeurActuelle: kpi.data.value?.surfaceIsolee,
    },
    {
      key: 'volumeInstalle',
      label: 'Volume installé',
      unit: 'dép.',
      icon: 'mdi-package-variant-closed',
      valeurActuelle: kpi.data.value?.volumeInstalle?.installe,
    },
    {
      key: 'nombreLots',
      label: 'Nombre de lots',
      unit: 'lots',
      icon: 'mdi-layers-outline',
      valeurActuelle: kpi.data.value?.nombreLots,
    },
    {
      key: 'lotsTotal',
      label: 'Lots total',
      unit: 'lots',
      icon: 'mdi-layers-triple-outline',
      valeurActuelle: kpi.data.value?.nombreLots,
    },
    {
      key: 'lotsDeposes',
      label: 'Lots déposés',
      unit: 'lots',
      icon: 'mdi-layers-triple',
      valeurActuelle: kpi.data.value?.lotsDeposes,
    },
  ])

  const showObjMenu = ref(false)
  const objectifModalOpen = ref(false)
  const objectifCible = ref(null)

  // ── Actualiser — IMAGE 6 : refetch complet VueQuery ───────────────────────────
  async function actualiser() {
    isRefreshing.value = true
    try {
      await queryClient.invalidateQueries()
      await queryClient.refetchQueries()
    } finally {
      setTimeout(() => {
        isRefreshing.value = false
      }, 600)
    }
  }

  function ouvrirObjectifGlobal(k) {
    objectifCible.value = k
    objectifModalOpen.value = true
  }

  // ── KPI Cards ─────────────────────────────────────────────────────────────────
  const kpiCards = computed(() => {
    const d = kpi.data.value
    if (!d) return []
    return [
      {
        key: 'chiffreAffaires',
        label: 'CA Global',
        value: fmtShort(d.chiffreAffaires),
        rawValue: d.chiffreAffaires,
        delta: d.deltaChiffreAffaires,
        deltaPos: d.deltaChiffreAffaires >= 0,
        color: '#7c3aed',
        unit: '',
        drillKey: 'chiffreAffaires',
      },
      {
        key: 'volumeInstalle',
        label: 'Vol. CAE Installé',
        value: fmt(d.volumeInstalle?.installe),
        rawValue: d.volumeInstalle?.installe,
        delta: d.deltaVolumeInstalle,
        deltaPos: d.deltaVolumeInstalle >= 0,
        color: '#10b981',
        unit: ' GWh',
        drillKey: 'lots',
      },
      {
        key: 'volumeCAE',
        label: 'Vol. CAE Déposé',
        value: fmt(d.volumeInstalle?.depose),
        rawValue: d.volumeInstalle?.depose,
        delta: d.deltaVolumeCae,
        deltaPos: d.deltaVolumeCae >= 0,
        color: '#3730a3',
        unit: ' GWh',
        drillKey: 'volumeCAE',
      },
      {
        key: 'nombreLots',
        label: 'Montant Prime',
        value: fmt(d.nombreLots * 13),
        rawValue: d.nombreLots * 13,
        delta: d.deltaSurface,
        deltaPos: d.deltaSurface >= 0,
        color: '#f97316',
        unit: ' k€',
        drillKey: 'zones',
      },
      {
        key: 'opportunites',
        label: 'Nb Opportunités',
        value: fmt(d.opportunites),
        rawValue: d.opportunites,
        delta: d.deltaOpportunites,
        deltaPos: d.deltaOpportunites >= 0,
        color: '#2563eb',
        unit: '',
        drillKey: 'sousStatuts',
      },
      {
        key: 'surfaceIsolee',
        label: 'Surface Isolée',
        value: fmt(d.surfaceIsolee),
        rawValue: d.surfaceIsolee,
        delta: d.deltaSurface,
        deltaPos: d.deltaSurface >= 0,
        color: '#06b6d4',
        unit: ' m²',
        drillKey: 'zones',
      },
      {
        key: 'lotsTotal',
        label: 'Lots Total',
        value: fmt(d.nombreLots),
        rawValue: d.nombreLots,
        delta: d.deltaLotsTotal,
        deltaPos: d.deltaLotsTotal >= 0,
        color: '#ec4899',
        unit: '',
        drillKey: 'lots',
      },
      {
        key: 'lotsDeposes',
        label: 'Lots Déposés',
        value: fmt(d.lotsDeposes),
        rawValue: d.lotsDeposes,
        delta: d.deltaLotsDeposes,
        deltaPos: d.deltaLotsDeposes >= 0,
        color: '#65a30d',
        unit: '',
        drillKey: 'lots',
      },
    ]
  })

  // ── ObjectifModal ─────────────────────────────────────────────────────────────
  const kpiModalOpen = ref(false)
  const kpiCible = ref(null)
  function ouvrirObjectif(card) {
    if (!card.key) return
    kpiCible.value = { key: card.key, label: card.label, rawValue: card.rawValue }
    kpiModalOpen.value = true
  }

  // ── Multi-selects — positions calculées pour Teleport ─────────────────────────
  const typesActeur = MOCK_TYPES_ACTEUR
  const acteurs = MOCK_ACTEURS

  const selTypes = ref([])
  const selActors = ref([])
  const showTypeDD = ref(false)
  const showActorDD = ref(false)
  const actorSearch = ref('')

  // Refs DOM des triggers pour calculer position dropdown
  const typeDropStyle = ref({})
  const actorDropStyle = ref({})

  // APRÈS — recalcule à chaque scroll
  function calcDropPos(el, styleRef) {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropH = Math.min(260, window.innerHeight * 0.45)
    const NAV_HEIGHT = 56 // hauteur de la navbar en px

    if (spaceBelow >= dropH + 8) {
      const topPos = Math.max(rect.bottom + 4, NAV_HEIGHT + 4) // ← jamais sous la nav
      styleRef.value = {
        top: `${topPos}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        maxHeight: `${dropH}px`,
      }
    } else {
      styleRef.value = {
        bottom: `${window.innerHeight - rect.top + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        maxHeight: `${dropH}px`,
      }
    }
  }

  // ← AJOUTER : recalcul live pendant le scroll
  function onScroll() {
    if (showTypeDD.value && typeTriggerEl.value) calcDropPos(typeTriggerEl.value, typeDropStyle)
    if (showActorDD.value && actorTriggerEl.value) calcDropPos(actorTriggerEl.value, actorDropStyle)
  }

  onMounted(() => window.addEventListener('scroll', onScroll, true))
  onUnmounted(() => window.removeEventListener('scroll', onScroll, true))

  // Refs des éléments trigger
  const typeTriggerEl = ref(null)
  const actorTriggerEl = ref(null)

  // APRÈS — on mémorise l'élément trigger pour le scroll
  function toggleTypeDD(e) {
    showActorDD.value = false
    showTypeDD.value = !showTypeDD.value
    if (showTypeDD.value) {
      typeTriggerEl.value = e.currentTarget // ← AJOUTER
      nextTick(() => calcDropPos(typeTriggerEl.value, typeDropStyle))
    }
  }

  function toggleActorDD(e) {
    showTypeDD.value = false
    showActorDD.value = !showActorDD.value
    if (showActorDD.value) {
      actorTriggerEl.value = e.currentTarget // ← AJOUTER
      nextTick(() => calcDropPos(actorTriggerEl.value, actorDropStyle))
    }
  }

  // Fermeture via clic sur la page
  function handleRootClick() {
    showTypeDD.value = false
    showActorDD.value = false
  }

  // ── Filtres acteurs ────────────────────────────────────────────────────────────
  const availableActeurs = computed(() =>
    selTypes.value.length ? acteurs.filter((a) => selTypes.value.includes(a.type)) : acteurs
  )

  const visibleActorTypes = computed(() => [...new Set(availableActeurs.value.map((a) => a.type))])

  function filteredActorsByType(tid) {
    return availableActeurs.value.filter(
      (a) => a.type === tid && a.name.toLowerCase().includes(actorSearch.value.toLowerCase())
    )
  }

  function toggleType(id) {
    const idx = selTypes.value.indexOf(id)
    if (idx >= 0) {
      selTypes.value.splice(idx, 1)
      // Nettoyer les acteurs qui ne correspondent plus
      selActors.value = selActors.value.filter((aid) => {
        const a = acteurs.find((x) => x.id === aid)
        return a && selTypes.value.includes(a.type)
      })
    } else {
      selTypes.value.push(id)
    }
  }
  function removeType(id) {
    toggleType(id)
  }

  function toggleActor(id) {
    const idx = selActors.value.indexOf(id)
    if (idx >= 0) selActors.value.splice(idx, 1)
    else selActors.value.push(id)
  }
  function removeActor(id) {
    toggleActor(id)
  }

  function selectAllTypes() {
    selTypes.value = typesActeur.map((t) => t.id)
    showTypeDD.value = false
  }
  function selectAllActors() {
    selActors.value = availableActeurs.value.map((a) => a.id)
    showActorDD.value = false
  }

  // Acteurs effectifs — filtrage dynamique IMAGE 4 & 5
  const acteursEffectifs = computed(() => {
    if (selActors.value.length) return acteurs.filter((a) => selActors.value.includes(a.id))
    if (selTypes.value.length) return acteurs.filter((a) => selTypes.value.includes(a.type))
    return acteurs
  })

  const acteursBadgeCount = computed(() => {
    const n = acteursEffectifs.value.length
    return n === acteurs.length
      ? 'Tous les acteurs'
      : `${n} acteur${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}`
  })

  const acteursBadge = computed(() =>
    acteursEffectifs.value.length < acteurs.length
      ? acteursEffectifs.value.map((a) => a.name).join(' · ')
      : ''
  )

  // ── ApexCharts — config de base ────────────────────────────────────────────────
  // Hauteur dynamique : plus dense avec peu d'acteurs (IMAGE 5 barres larges)
  const chartH = computed(() => {
    const n = acteursEffectifs.value.length
    return n <= 2 ? 300 : n <= 5 ? 270 : 250
  })

  // columnWidth dynamique : barres plus larges avec peu d'acteurs
  const colWidth = computed(() => {
    const n = acteursEffectifs.value.length
    if (n <= 1) return '45%'
    if (n <= 3) return '55%'
    if (n <= 6) return '65%'
    return '72%'
  })

  const baseOpts = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      animations: { speed: 400 },
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.05)',
      strokeDashArray: 3,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '10px', colors: '#64748b' }, rotate: -35, maxHeight: 65 },
    },
  }

  const actNames = computed(() => acteursEffectifs.value.map((a) => a.name))

  // ── Graphe 1 : CA (violet) | Opps (orange) — IMAGE 1 & 4 & 5 ─────────────────
  const actCAOpts = computed(() => ({
    ...baseOpts,
    colors: ['#7c3aed', '#f97316'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: colWidth.value, grouped: true } },
    xaxis: { ...baseOpts.xaxis, categories: actNames.value },
    yaxis: [
      {
        seriesName: 'CA (€)',
        labels: {
          style: { fontSize: '10px', colors: '#64748b' },
          formatter: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k€' : v + '€'),
        },
      },
      {
        seriesName: 'Opportunités',
        opposite: true,
        labels: { style: { fontSize: '10px', colors: '#64748b' } },
      },
    ],
    tooltip: {
      ...baseOpts.tooltip,
      y: { formatter: (v, { seriesIndex }) => (seriesIndex === 0 ? fmtShort(v) : `${v} opps`) },
    },
  }))
  const actCASeries = computed(() => [
    { name: 'CA (€)', data: acteursEffectifs.value.map((a) => a.ca) },
    { name: 'Opportunités', data: acteursEffectifs.value.map((a) => a.opp) },
  ])

  // ── Graphe 2 : CAE installé (vert) | déposé (bleu nuit) ──────────────────────
  const actCAEOpts = computed(() => ({
    ...baseOpts,
    colors: ['#10b981', '#3730a3'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: colWidth.value, grouped: true } },
    xaxis: { ...baseOpts.xaxis, categories: actNames.value },
    yaxis: { labels: { style: { fontSize: '10px', colors: '#64748b' } } },
    tooltip: { ...baseOpts.tooltip, y: { formatter: (v) => `${v} GWh/an` } },
  }))
  const actCAESeries = computed(() => [
    { name: 'Installé', data: acteursEffectifs.value.map((a) => a.caeI) },
    { name: 'Déposé', data: acteursEffectifs.value.map((a) => a.caeD) },
  ])

  // ── Graphe 3 : Surface (cyan) | Opps (rose) ───────────────────────────────────
  const actSurfOpts = computed(() => ({
    ...baseOpts,
    colors: ['#06b6d4', '#ec4899'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: colWidth.value, grouped: true } },
    xaxis: { ...baseOpts.xaxis, categories: actNames.value },
    yaxis: [
      { seriesName: 'Surface (m²)', labels: { style: { fontSize: '10px', colors: '#64748b' } } },
      {
        seriesName: 'Opportunités',
        opposite: true,
        labels: { style: { fontSize: '10px', colors: '#64748b' } },
      },
    ],
    tooltip: {
      ...baseOpts.tooltip,
      y: { formatter: (v, { seriesIndex }) => (seriesIndex === 0 ? `${fmt(v)} m²` : `${v} opps`) },
    },
  }))
  const actSurfSeries = computed(() => [
    { name: 'Surface (m²)', data: acteursEffectifs.value.map((a) => a.surf) },
    { name: 'Opportunités', data: acteursEffectifs.value.map((a) => a.opp) },
  ])

  // ── Sous-statuts ───────────────────────────────────────────────────────────────
  const sousStatutsFull = MOCK_SOUS_STATUTS_FULL
  const ssOpts = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      animations: { speed: 400 },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        distributed: true,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '10px', fontWeight: 700, colors: ['#1e293b'] },
    },
    colors: sousStatutsFull.map((s) => s.c),
    xaxis: {
      categories: sousStatutsFull.map((s) => s.l),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '10px', colors: '#64748b' }, rotate: -38, maxHeight: 70 },
    },
    yaxis: { labels: { style: { fontSize: '10px', colors: '#64748b' } } },
    legend: { show: false },
    grid: { borderColor: 'rgba(0,0,0,0.04)', strokeDashArray: 3 },
    tooltip: { theme: 'light' },
  }
  const ssSeries = [{ name: 'Nombre de statut', data: sousStatutsFull.map((s) => s.n) }]

  // ── Zones géographiques ────────────────────────────────────────────────────────
  const zonesGeo = MOCK_ZONES_GEO
  const zoneBase = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      animations: { speed: 400 },
    },
    grid: { borderColor: 'rgba(0,0,0,0.04)', strokeDashArray: 3 },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: 'light' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', grouped: true } },
    xaxis: {
      categories: zonesGeo.noms,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px', colors: '#64748b' } },
    },
  }

  const zoneCaeOpts = {
    ...zoneBase,
    colors: ['#10b981', '#3730a3'],
    yaxis: { labels: { style: { fontSize: '10px', colors: '#64748b' } } },
  }
  const zoneCaeSeries = [
    { name: 'Installé', data: zonesGeo.caeI },
    { name: 'Déposé', data: zonesGeo.caeD },
  ]

  const zoneSurfOpts = {
    ...zoneBase,
    colors: ['#7c3aed', '#f97316'],
    yaxis: [
      { labels: { style: { fontSize: '10px', colors: '#64748b' } } },
      { opposite: true, labels: { style: { fontSize: '10px', colors: '#64748b' } } },
    ],
  }
  const zoneSurfSeries = [
    { name: 'Surface (m²)', data: zonesGeo.surf },
    { name: 'Opportunités', data: zonesGeo.opp },
  ]

  // ── Drill-Down ─────────────────────────────────────────────────────────────────
  const drill = reactive({
    open: false,
    titre: '',
    sousTitre: '',
    donnees: [],
    colonnes: [],
    nomFichier: 'helios_export',
  })

  const drillConfigs = computed(() => ({
    sousStatuts: {
      titre: 'Opportunités par sous-statut',
      sousTitre: '',
      nomFichier: 'helios_sous_statuts',
      colonnes: [
        { key: 'statut', label: 'Statut', align: 'left' },
        { key: 'valeur', label: 'Valeur', align: 'right' },
      ],
      donnees: sousStatutsFull.map((s) => ({ statut: s.l, valeur: s.n })),
    },
    chiffreAffaires: {
      titre: 'CA par type de facturation',
      sousTitre: '',
      nomFichier: 'helios_ca',
      colonnes: [
        { key: 'type', label: 'Type', align: 'left' },
        { key: 'montant', label: 'Montant', align: 'right', format: fmtEur },
      ],
      donnees: (facturation.data.value ?? []).map((f) => ({ type: f.name, montant: f.value })),
    },
    zones: {
      titre: 'Surface isolée par zone',
      sousTitre: '',
      nomFichier: 'helios_zones',
      colonnes: [
        { key: 'zone', label: 'Zone', align: 'left' },
        { key: 'surface', label: 'Surface', align: 'right', format: fmtSurf },
      ],
      donnees: (MOCK_ZONES ?? []).map((z) => ({ zone: z.zone, surface: z.surface })),
    },
    oppsParZone: {
      titre: 'Opportunités par zone',
      sousTitre: '',
      nomFichier: 'helios_opps_zones',
      colonnes: [
        { key: 'zone', label: 'Zone', align: 'left' },
        { key: 'opportunites', label: 'Opportunités', align: 'right' },
        { key: 'validees', label: 'Validées', align: 'right' },
      ],
      donnees: (MOCK_ZONES ?? []).map((z) => ({
        zone: z.zone,
        opportunites: z.opps,
        validees: z.validees,
      })),
    },
    volumeCAE: {
      titre: 'Évolution Volume CAE & CA',
      sousTitre: '',
      nomFichier: 'helios_trend',
      colonnes: [
        { key: 'mois', label: 'Mois', align: 'left' },
        { key: 'cae', label: 'CAE (kWh×1000)', align: 'right' },
        { key: 'ca', label: 'CA (k€)', align: 'right' },
      ],
      donnees: (trend.data.value ?? []).map((d) => ({ mois: d.m, cae: d.cae, ca: d.ca })),
    },
    lots: {
      titre: 'Lots installés vs déposés',
      sousTitre: '',
      nomFichier: 'helios_lots',
      colonnes: [
        { key: 'mois', label: 'Mois', align: 'left' },
        { key: 'installes', label: 'Installés', align: 'right' },
        { key: 'deposes', label: 'Déposés', align: 'right' },
      ],
      donnees: (lotsTrend.data.value ?? []).map((d) => ({
        mois: d.m,
        installes: d.installes,
        deposes: d.deposes,
      })),
    },
  }))

  function ouvrirDrill(type) {
    const cfg = drillConfigs.value[type]
    if (cfg) Object.assign(drill, { open: true, ...cfg })
  }
</script>

<style scoped>
  .dash-root {
    min-height: 100vh;
    background: #f8f9fb;
  }

  /* ── Breadcrumb ──────────────────────────────────────────────────────────── */
  .crm-bc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 22px 0;
    font-size: 12px;
    color: #64748b;
  }
  .crm-bc-active {
    color: #7c3aed;
    font-weight: 600;
  }

  /* ── Page Header ─────────────────────────────────────────────────────────── */
  .crm-ph {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 22px 14px;
  }
  .crm-ph-title {
    font-size: 19px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .crm-ph-sub {
    font-size: 12px;
    color: #64748b;
    margin: 2px 0 0;
  }

  /* Objectifs dropdown */
  .crm-obj-wrap {
    position: relative;
  }
  .crm-overlay {
    position: fixed;
    inset: 0;
    z-index: 299;
  }
  .crm-obj-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 300;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.14);
    min-width: 220px;
    padding: 6px 0;
    overflow: hidden;
  }
  .crm-obj-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    padding: 6px 14px 4px;
    margin: 0;
  }
  .crm-obj-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 7px 14px;
    font-size: 12px;
    color: #1e293b;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }
  .crm-obj-item:hover {
    background: #f1f5f9;
  }

  /* ── Filtres header — IMAGE 6 ─────────────────────────────────────────────── */
  .crm-hacts {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .crm-flbl {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
  }

  .crm-date-input {
    background: #fff;
    border: 1px solid #d1d5db;
    color: #1e293b;
    border-radius: 7px;
    padding: 6px 10px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .crm-date-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
  }

  /* Select avec chevron visible — IMAGE 6 */
  .crm-ssel-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .crm-ssel {
    appearance: none;
    -webkit-appearance: none;
    background: #fff;
    border: 1px solid #d1d5db;
    color: #1e293b;
    border-radius: 7px;
    padding: 6px 32px 6px 10px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .crm-ssel:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
  }
  .crm-ssel-arrow {
    position: absolute;
    right: 8px;
    pointer-events: none;
    width: 16px;
    height: 16px;
    color: #6b7280;
  }

  /* Bouton Actualiser — IMAGE 6 */
  .crm-btnref {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #7c3aed;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 7px 14px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.15s,
      opacity 0.15s;
    white-space: nowrap;
  }
  .crm-btnref:hover {
    background: #5b21b6;
  }
  .crm-btnref:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .crm-ref-icon {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    stroke: white;
    transition: transform 0.4s;
  }
  .crm-ref-spin {
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ── KPI Grid ────────────────────────────────────────────────────────────── */
  .crm-kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
    gap: 10px;
    padding: 0 22px 16px;
  }

  .crm-kpi {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 13px 14px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition:
      box-shadow 0.2s,
      border-color 0.2s,
      transform 0.15s;
  }
  .crm-kpi:hover {
    border-color: #c4b5fd;
    box-shadow: 0 2px 12px rgba(91, 33, 182, 0.08);
    transform: translateY(-1px);
  }
  .crm-kpi::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--kc, #7c3aed);
  }
  .crm-kpi--skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    min-height: 88px;
  }
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .kpi-obj-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 13px;
    color: #94a3b8;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
    padding: 2px;
    line-height: 1;
  }
  .crm-kpi:hover .kpi-obj-btn {
    opacity: 0.5;
  }
  .kpi-obj-btn:hover {
    opacity: 1 !important;
  }

  .crm-kl {
    font-size: 10px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
    font-weight: 600;
  }
  .crm-kv {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
  }
  .crm-ku {
    font-size: 10px;
    color: #64748b;
    font-weight: 400;
    margin-left: 2px;
  }
  .crm-kd {
    font-size: 11px;
    margin-top: 5px;
    font-weight: 500;
  }
  .kd-up {
    color: #059669;
  }
  .kd-dn {
    color: #dc2626;
  }
  .kpi-obj-badge {
    display: inline-flex;
    align-items: center;
    font-size: 9px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 4px;
  }
  .badge-ok {
    background: rgba(5, 150, 105, 0.12);
    color: #059669;
  }
  .badge-warning {
    background: rgba(217, 119, 6, 0.12);
    color: #d97706;
  }
  .badge-danger {
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
  }

  /* ── Corps ───────────────────────────────────────────────────────────────── */
  .crm-body {
    padding: 0 22px 50px;
  }

  /* ── Panel acteur ────────────────────────────────────────────────────────── */
  .crm-ap {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px 18px;
    margin-bottom: 12px;
  }
  .crm-ap-head {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 13px;
  }
  .crm-ap-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }
  .crm-ap-sels {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }
  .crm-sg {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 260px;
    flex: 1;
  }
  .crm-sg-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .crm-act-info {
    font-size: 11px;
    color: #64748b;
    padding-top: 20px;
    max-width: 340px;
    line-height: 1.6;
    margin: 0;
    opacity: 0.8;
  }

  /* ── Select trigger — IMAGE 2 ─────────────────────────────────────────────── */
  .crm-msw {
    position: relative;
  }

  .crm-mst {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 38px;
    background: #fff;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    padding: 5px 10px 5px 10px;
    cursor: pointer;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
    user-select: none;
    gap: 6px;
  }
  .crm-mst:hover {
    border-color: #7c3aed;
  }
  .crm-mst--open {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
  }

  .crm-mst-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    flex: 1;
    min-width: 0;
  }
  .crm-mph {
    color: #94a3b8;
    font-size: 12px;
  }
  .crm-mpill {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background: #ede9fe;
    color: #7c3aed;
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .crm-mpill--actor {
    background: #dbeafe;
    color: #2563eb;
  }
  .crm-pill-rm {
    cursor: pointer;
    opacity: 0.5;
    font-size: 13px;
    line-height: 1;
    margin-left: 1px;
  }
  .crm-pill-rm:hover {
    opacity: 1;
  }

  /* Chevron SVG — IMAGE 6 */
  .crm-mst-chevron {
    width: 16px;
    height: 16px;
    color: #6b7280;
    flex-shrink: 0;
    transition: transform 0.2s;
    pointer-events: none;
  }
  .crm-mst-chevron--open {
    transform: rotate(180deg);
    color: #7c3aed;
  }

  /* ── Dropdown fixe — position:fixed via Teleport, passe au-dessus de tout — IMAGE 2 */
  .crm-mdd-fixed {
    position: fixed;
    z-index: 9999;
    background: #fff;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.14);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .crm-mdd-search {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 11px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }
  .crm-mdd-search input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: transparent;
  }

  .crm-mdd-scroll {
    overflow-y: auto;
    flex: 1;
  }

  .crm-mopt {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    cursor: pointer;
    font-size: 13px;
    color: #1e293b;
    transition: background 0.1s;
  }
  .crm-mopt:hover {
    background: #f8f7ff;
  }
  .crm-mopt--sel {
    background: #ede9fe;
    color: #5b21b6;
    font-weight: 600;
  }

  /* Checkbox custom */
  .crm-mchk {
    width: 16px;
    height: 16px;
    border: 1.5px solid #d1d5db;
    border-radius: 4px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    transition:
      background 0.15s,
      border-color 0.15s;
    background: #fff;
  }
  .crm-mchk--on {
    background: #7c3aed;
    border-color: #7c3aed;
  }
  .crm-mchk svg {
    width: 10px;
    height: 10px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }

  /* Groupe — IMAGE 3 */
  .crm-mgrp {
    padding: 6px 13px 3px;
    font-size: 10px;
    font-weight: 800;
    color: #7c3aed;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: #faf5ff;
    border-top: 1px solid #ede9fe;
  }
  .crm-mgrp:first-child {
    border-top: none;
  }

  .crm-mdd-footer {
    padding: 8px 13px;
    font-size: 11px;
    color: #7c3aed;
    cursor: pointer;
    border-top: 1px solid #f1f5f9;
    font-weight: 700;
    flex-shrink: 0;
    transition: background 0.1s;
  }
  .crm-mdd-footer:hover {
    background: #f5f3ff;
  }
  .crm-mdd-empty {
    padding: 14px 13px;
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
  }

  /* ── Section headers ─────────────────────────────────────────────────────── */
  .crm-sh {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    margin-top: 8px;
  }
  .crm-sh-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .crm-badge {
    background: #ede9fe;
    color: #7c3aed;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 9px;
    border-radius: 20px;
  }

  /* ── Cards ───────────────────────────────────────────────────────────────── */
  .crm-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 15px 16px 10px;
    transition:
      box-shadow 0.2s,
      border-color 0.2s;
    margin-bottom: 12px;
  }
  /* Chart cards : padding-bottom réduit pour plus de densité — IMAGE 1 */
  .crm-card--chart {
    padding-bottom: 4px;
  }
  .crm-card:hover {
    border-color: #c4b5fd;
    box-shadow: 0 2px 12px rgba(91, 33, 182, 0.05);
  }

  .crm-ch {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 8px;
  }
  .crm-ct {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
  }
  .crm-cm {
    font-size: 10px;
    color: #64748b;
    margin-top: 2px;
  }

  .crm-leg {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 6px;
  }
  .crm-li {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }
  .crm-lsq {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .total-badge {
    font-size: 11px;
    color: #64748b;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .total-badge strong {
    font-weight: 800;
    color: #1e293b;
    margin-left: 3px;
  }

  /* ── Grilles ─────────────────────────────────────────────────────────────── */
  .crm-g2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .crm-g3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  /* ── Footer ──────────────────────────────────────────────────────────────── */
  .crm-footer {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
    padding: 14px 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .crm-footer-dot {
    color: #059669;
    font-size: 8px;
  }

  /* ── Responsive ──────────────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .crm-g3 {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 700px) {
    .crm-g2,
    .crm-g3 {
      grid-template-columns: 1fr;
    }
    .crm-ph,
    .crm-hacts {
      flex-direction: column;
    }
  }

  /* Animation entrée */
  .crm-ap,
  .crm-card {
    animation: fadeUp 0.22s ease both;
  }
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
