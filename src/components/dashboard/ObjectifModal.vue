<template>
  <v-dialog v-model="open" max-width="520" persistent>
    <v-card rounded="xl">

      <!-- Titre -->
      <v-card-title class="d-flex align-center justify-space-between pa-5 pb-3">
        <div>
          <p class="text-subtitle-1 font-weight-bold ma-0" style="color:#1E1A3A">
            Définir un objectif
          </p>
          <p class="text-caption text-medium-emphasis ma-0">{{ kpiLabel }}</p>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="open = false" />
      </v-card-title>

      <v-divider />

      <!-- Formulaire -->
      <v-card-text class="pa-5">
        <v-row dense>
          <!-- Entreprise -->
          <v-col cols="12">
            <v-select
              v-model="form.entreprise"
              label="Entreprise"
              :items="entreprises"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            />
          </v-col>

          <!-- Type de période -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.typePeriode"
              label="Type de période"
              :items="typesPeriode"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            />
          </v-col>

          <!-- Période -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.periode"
              label="Période"
              :items="periodes"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            />
          </v-col>

          <!-- Valeur cible -->
          <v-col cols="12">
            <v-text-field
              v-model.number="form.valeurCible"
              :label="`Valeur cible${kpiUnit ? ` (${kpiUnit})` : ''}`"
              type="number"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              min="0"
            />
            <p class="text-caption text-medium-emphasis mt-1 mb-0">
              Valeur actuelle réelle :
              <strong>{{ fmtValeur(valeurActuelle) }} {{ kpiUnit }}</strong>
            </p>
          </v-col>
        </v-row>

        <!-- Bloc Target Details -->
        <v-sheet
          v-if="form.valeurCible"
          rounded="lg"
          class="pa-3 mt-4"
          style="background: rgba(91,79,232,0.07); border: 1px solid rgba(91,79,232,0.15)"
        >
          <p class="text-caption font-weight-bold mb-2" style="color:#5B4FE8">
            Target Details :
          </p>
          <v-table density="compact" bg-color="transparent">
            <tbody>
              <tr>
                <td class="text-caption opacity-70">Target Value</td>
                <td class="text-caption font-weight-bold" style="color:#5B4FE8">
                  {{ fmtValeur(form.valeurCible) }} {{ kpiUnit }}
                </td>
              </tr>
              <tr>
                <td class="text-caption opacity-70">Période</td>
                <td class="text-caption font-weight-bold">{{ form.periode }}</td>
              </tr>
              <tr v-if="valeurActuelle && form.valeurCible">
                <td class="text-caption opacity-70">Progression actuelle</td>
                <td class="text-caption font-weight-bold" :style="{ color: couleurPct }">
                  {{ pctActuel }}%
                </td>
              </tr>
            </tbody>
          </v-table>
          <p class="text-caption mt-2 mb-0 opacity-60">
            ⓘ Cet objectif sera visible sur chaque KPI card du tableau de bord.
          </p>
        </v-sheet>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="pa-4 justify-end gap-2">
        <v-btn variant="text" @click="open = false">Annuler</v-btn>
        <v-btn
          v-if="objectifExistant"
          variant="tonal"
          color="error"
          @click="supprimer"
        >
          Supprimer
        </v-btn>
        <v-btn
          color="primary"
          rounded="lg"
          variant="flat"
          :disabled="!form.valeurCible || form.valeurCible <= 0"
          @click="enregistrer"
        >
          Enregistrer l'objectif
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue:       { type: Boolean, required: true },
  kpiKey:           { type: String,  required: true },
  kpiLabel:         { type: String,  required: true },
  kpiUnit:          { type: String,  default: '' },
  valeurActuelle:   { type: Number,  default: null },
  objectifExistant: { type: Object,  default: null },
})

const emit = defineEmits(['update:modelValue', 'enregistrer', 'supprimer'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// Données du formulaire
const form = reactive({
  entreprise:  'Toutes les entreprises',
  typePeriode: 'Période prédéfinie',
  periode:     'Mensuel',
  valeurCible: null,
})

// Options des selects
const entreprises  = ['Toutes les entreprises', 'Helios Île-de-France', 'Helios PACA', 'Helios Est']
const typesPeriode = ['Période prédéfinie', 'Personnalisée']
const periodes     = ['Hebdo', 'Mensuel', 'Annuel']

// Pré-remplir si objectif existant
watch(() => props.objectifExistant, (obj) => {
  if (obj) {
    form.entreprise  = obj.entreprise  ?? 'Toutes les entreprises'
    form.typePeriode = obj.typePeriode ?? 'Période prédéfinie'
    form.periode     = obj.periode     ?? 'Mensuel'
    form.valeurCible = obj.valeurCible ?? null
  } else {
    form.entreprise  = 'Toutes les entreprises'
    form.typePeriode = 'Période prédéfinie'
    form.periode     = 'Mensuel'
    form.valeurCible = null
  }
}, { immediate: true })

// Formatter
const numFmt = new Intl.NumberFormat('fr-FR')
const fmtValeur = (n) => (n != null ? numFmt.format(n) : '—')

// Calcul progression actuelle
const pctActuel = computed(() => {
  if (!props.valeurActuelle || !form.valeurCible) return null
  return Math.round((props.valeurActuelle / form.valeurCible) * 100)
})

const couleurPct = computed(() => {
  const p = pctActuel.value
  if (p === null) return 'inherit'
  if (p >= 90) return '#27ae74'
  if (p >= 70) return '#c47d0a'
  return '#d94f30'
})

function enregistrer() {
  emit('enregistrer', {
    kpiKey:   props.kpiKey,
    objectif: { ...form },
  })
  open.value = false
}

function supprimer() {
  emit('supprimer', props.kpiKey)
  open.value = false
}
</script>
