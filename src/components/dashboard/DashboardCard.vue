<template>
  <v-card class="dashboard-card" rounded="xl" elevation="0" :class="cardClass">
    <v-card-text class="pa-5">
      <header class="card-header">
        <div>
          <h3 class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </div>
        <div class="card-header-actions">
          <slot name="action" />
          <!-- Bouton export Excel (visible au hover si exportDonnees fourni) -->
          <v-btn
            v-if="exportDonnees?.length"
            icon="mdi-table-arrow-right"
            size="x-small"
            variant="text"
            density="compact"
            class="export-card-btn"
            title="Exporter en Excel"
            @click.stop="exporterCarte"
          />
        </div>
      </header>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
import * as XLSX from 'xlsx'
import { useUiStore } from '@/stores/uiStore.js'

const props = defineProps({
  title:         { type: String, required: true },
  subtitle:      { type: String, default: null },
  cardClass:     { type: String, default: '' },
  exportDonnees: { type: Array,  default: null },
  exportNom:     { type: String, default: 'helios_export' },
})

const ui = useUiStore()

function exporterCarte() {
  if (!props.exportDonnees?.length) return
  const ws = XLSX.utils.json_to_sheet(props.exportDonnees)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Données')
  XLSX.writeFile(wb, `${props.exportNom}_${new Date().toISOString().slice(0, 10)}.xlsx`)
  ui.showSnackbar('✓ Export Excel téléchargé', 'success')
}
</script>

<style scoped>
.dashboard-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 8px;
}

.card-title    { font-size: 13px; font-weight: 600; letter-spacing: -0.1px; margin: 0; }
.card-subtitle { font-size: 11px; opacity: 0.55; margin: 3px 0 0; }

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

/* Export btn — visible uniquement au hover de la card */
.export-card-btn {
  opacity: 0;
  transition: opacity 0.15s;
}

.dashboard-card:hover .export-card-btn {
  opacity: 0.55;
}

.export-card-btn:hover {
  opacity: 1 !important;
}
</style>
