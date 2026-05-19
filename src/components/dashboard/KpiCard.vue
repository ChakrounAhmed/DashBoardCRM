<template>
  <v-card class="kpi-card" rounded="xl" elevation="0" style="cursor:pointer" @click="$emit('click')">
    <v-card-text class="pa-5">

      <!-- Header: label + icône + bouton objectif -->
      <div class="kpi-header">
        <p class="kpi-label">{{ label }}</p>
        <div class="kpi-header-right">
          <v-btn
            v-if="kpiKey"
            icon="mdi-target"
            size="x-small"
            variant="text"
            density="compact"
            class="objectif-btn"
            :title="`Définir un objectif — ${label}`"
            @click.stop="modalOpen = true"
          />
          <div v-if="icon" class="kpi-icon" :class="`kpi-icon--${tone}`">
            <v-icon :icon="icon" size="16" />
          </div>
        </div>
      </div>

      <!-- Valeur principale -->
      <div class="kpi-value-row">
        <span class="kpi-value">{{ value }}</span>
        <span v-if="unit" class="kpi-unit">{{ unit }}</span>
      </div>

      <!-- Badge delta -->
      <div
        v-if="delta !== undefined"
        class="kpi-delta"
        :class="positive ? 'kpi-delta--up' : 'kpi-delta--down'"
      >
        <v-icon :icon="positive ? 'mdi-arrow-top-right' : 'mdi-arrow-bottom-right'" size="12" />
        {{ Math.abs(delta).toFixed(2) }}%
      </div>

      <!-- Badge objectif -->
      <div
        v-if="pct !== null"
        class="objectif-badge"
        :class="`badge--${statut}`"
      >
        <v-icon icon="mdi-flag-outline" size="10" class="me-1" />
        {{ pct }}% obj. {{ periodeLabel }}
      </div>

    </v-card-text>

    <ObjectifModal
      v-if="kpiKey"
      v-model="modalOpen"
      :kpi-key="kpiKey"
      :kpi-label="label"
      :kpi-unit="kpiUnit"
      :valeur-actuelle="valeurNumerique"
      :objectif-existant="dashStore.objectifs[kpiKey]"
      @enregistrer="({ kpiKey: k, objectif: o }) => dashStore.definirObjectif(k, o)"
      @supprimer="(k) => dashStore.supprimerObjectif(k)"
    />
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore.js'
import ObjectifModal from './ObjectifModal.vue'

const props = defineProps({
  label:           { type: String,  required: true },
  value:           { type: String,  required: true },
  unit:            { type: String,  default: null },
  delta:           { type: Number,  default: undefined },
  icon:            { type: String,  default: null },
  tone: {
    type:      String,
    default:   'neutral',
    validator: (v) => ['primary', 'accent', 'neutral'].includes(v),
  },
  kpiKey:          { type: String,  default: null },
  valeurNumerique: { type: Number,  default: null },
  kpiUnit:         { type: String,  default: '' },
})

defineEmits(['click'])

const dashStore  = useDashboardStore()
const modalOpen  = ref(false)
const positive   = computed(() => (props.delta ?? 0) >= 0)

const statut = computed(() =>
  props.kpiKey ? dashStore.statutObjectif(props.kpiKey, props.valeurNumerique) : 'none'
)
const pct = computed(() =>
  props.kpiKey ? dashStore.pctObjectif(props.kpiKey, props.valeurNumerique) : null
)
const periodeLabel = computed(() =>
  (dashStore.objectifs[props.kpiKey]?.periode ?? '').toLowerCase()
)
</script>

<style scoped>
.kpi-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: box-shadow 0.18s, transform 0.18s;
}
.kpi-card:hover {
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.12) !important;
  transform: translateY(-1px);
}
.kpi-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}
.kpi-header-right {
  display: flex;
  align-items: center;
  gap: 2px;
}
.kpi-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.6;
  margin: 0;
  line-height: 1.3;
}
.objectif-btn { opacity: 0.3; transition: opacity 0.15s; }
.kpi-card:hover .objectif-btn { opacity: 0.7; }
.objectif-btn:hover { opacity: 1 !important; }
.kpi-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: grid; place-items: center; flex-shrink: 0;
}
.kpi-icon--primary { background: rgba(91,79,232,0.12); color: #5b4fe8; }
.kpi-icon--accent  { background: rgba(46,204,143,0.12); color: #2ecc8f; }
.kpi-icon--neutral {
  background: rgba(var(--v-theme-surface-variant), 1);
  color: rgba(var(--v-theme-on-surface-variant), 0.7);
}
.kpi-value-row { display: flex; align-items: baseline; gap: 5px; }
.kpi-value { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; font-variant-numeric: tabular-nums; }
.kpi-unit  { font-size: 11px; font-weight: 500; opacity: 0.55; }
.kpi-delta {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 11px; font-weight: 600; padding: 2px 7px;
  border-radius: 6px; margin-top: 10px;
}
.kpi-delta--up   { background: rgba(46,204,143,0.14); color: #27ae74; }
.kpi-delta--down { background: rgba(217,79,48,0.1);   color: #d94f30; }
.objectif-badge {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 600;
  padding: 2px 7px; border-radius: 6px;
  margin-top: 5px; margin-left: 4px;
}
.badge--ok      { background: rgba(46,204,143,0.14); color: #27ae74; }
.badge--warning { background: rgba(232,160,32,0.14);  color: #c47d0a; }
.badge--danger  { background: rgba(217,79,48,0.12);   color: #d94f30; }
</style>
