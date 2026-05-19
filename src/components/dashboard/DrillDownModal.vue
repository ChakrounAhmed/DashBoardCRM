<template>
  <v-dialog v-model="open" max-width="860" scrollable>
    <v-card rounded="xl" elevation="4">

      <!-- ── Header ─────────────────────────────────────────────────────── -->
      <v-card-title class="drill-header pa-5 pb-4">
        <div>
          <p class="drill-title ma-0">{{ titre }}</p>
          <p v-if="sousTitre" class="drill-subtitle ma-0 mt-1">{{ sousTitre }}</p>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="open = false" />
      </v-card-title>

      <v-divider />

      <!-- ── Corps ──────────────────────────────────────────────────────── -->
      <v-card-text class="pa-0">
        <v-skeleton-loader v-if="chargement" type="table" class="ma-4" />

        <template v-else>
          <!-- Tableau stylisé CRM -->
          <table v-if="donnees.length" class="drill-table">
            <thead>
              <tr>
                <th
                  v-for="col in colonnes"
                  :key="col.key"
                  :class="col.align === 'right' ? 'text-right' : 'text-left'"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in donnees" :key="i">
                <td
                  v-for="col in colonnes"
                  :key="col.key"
                  :class="col.align === 'right' ? 'text-right' : 'text-left'"
                >
                  <span v-if="col.badge" class="statut-badge" :style="badgeStyle(row[col.key])">
                    {{ row[col.key] }}
                  </span>
                  <span v-else>{{ col.format ? col.format(row[col.key]) : row[col.key] }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Vide -->
          <div v-if="!donnees.length" class="text-center py-10 opacity-50">
            <v-icon icon="mdi-database-off-outline" size="40" class="mb-2" />
            <p class="text-body-2">Aucune donnée disponible</p>
          </div>
        </template>
      </v-card-text>

      <!-- ── Footer avec export ─────────────────────────────────────────── -->
      <v-divider />
      <v-card-actions class="pa-4 justify-space-between">
        <span class="text-caption opacity-50">{{ donnees.length }} enregistrement{{ donnees.length > 1 ? 's' : '' }}</span>
        <div class="d-flex ga-2">
          <v-btn
            prepend-icon="mdi-microsoft-excel"
            size="small"
            variant="tonal"
            color="success"
            rounded="lg"
            @click="exportExcel"
          >
            Exporter Excel
          </v-btn>
          <v-btn variant="tonal" size="small" rounded="lg" @click="open = false">
            Fermer
          </v-btn>
        </div>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  titre:      { type: String,  required: true },
  sousTitre:  { type: String,  default: '' },
  donnees:    { type: Array,   default: () => [] },
  colonnes:   { type: Array,   default: () => [] }, // [{ key, label, align?, format?, badge? }]
  chargement: { type: Boolean, default: false },
  nomFichier: { type: String,  default: 'helios_export' },
})

const emit = defineEmits(['update:modelValue'])
const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// Couleurs badges statut
const statutColors = {
  'Validé Technique': { bg: 'rgba(46,204,143,0.12)', color: '#27ae74' },
  'Étude en cours':   { bg: 'rgba(232,160,32,0.12)', color: '#c47d0a' },
  'Signature client': { bg: 'rgba(91,79,232,0.12)',  color: '#5B4FE8' },
  'En attente':       { bg: 'rgba(196,194,216,0.2)', color: '#6B6880' },
  'actif':            { bg: 'rgba(46,204,143,0.12)', color: '#27ae74' },
  'inactif':          { bg: 'rgba(196,194,216,0.2)', color: '#6B6880' },
  'suspendu':         { bg: 'rgba(217,79,48,0.12)',  color: '#d94f30' },
}

function badgeStyle(val) {
  const s = statutColors[val] ?? { bg: 'rgba(196,194,216,0.15)', color: '#6B6880' }
  return { background: s.bg, color: s.color }
}

function exportExcel() {
  if (!props.donnees.length) return
  // Données brutes sans formatage
  const raw = props.donnees.map(row =>
    Object.fromEntries(props.colonnes.map(c => [c.label, row[c.key]]))
  )
  const ws = XLSX.utils.json_to_sheet(raw)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Données')
  XLSX.writeFile(wb, `${props.nomFichier}_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
</script>

<style scoped>
.drill-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.drill-title {
  font-size: 17px;
  font-weight: 700;
  color: #1E1A3A;
  letter-spacing: -0.2px;
}

.drill-subtitle {
  font-size: 12px;
  color: #6B6880;
}

/* ── Tableau CRM ─────────────────────────────────────────────────────────── */
.drill-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.drill-table thead tr {
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
}

.drill-table thead th {
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 700;
  color: #1E1A3A;
  white-space: nowrap;
}

.drill-table tbody tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background 0.12s;
}

.drill-table tbody tr:last-child {
  border-bottom: none;
}

.drill-table tbody tr:hover {
  background: rgba(91, 79, 232, 0.04);
}

.drill-table tbody td {
  padding: 13px 20px;
  color: #1E1A3A;
  vertical-align: middle;
}

.text-right { text-align: right; }
.text-left  { text-align: left; }

/* Badge statut */
.statut-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
