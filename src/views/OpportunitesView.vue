<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Opportunités</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" size="small" rounded="lg">
        Nouvelle opportunité
      </v-btn>
    </div>

    <!-- Filters -->
    <div class="filter-bar mb-4">
      <v-text-field
        v-model="search"
        placeholder="Rechercher…"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        rounded="lg"
        bg-color="surface-variant"
        style="max-width: 280px"
      />
      <v-select
        v-model="filterStatut"
        :items="statutItems"
        label="Sous-statut"
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        rounded="lg"
        bg-color="surface-variant"
        style="max-width: 200px"
        clearable
      />
    </div>

    <v-card rounded="xl" elevation="0" class="table-card">
      <v-skeleton-loader v-if="isLoading" type="table" />
      <v-alert v-else-if="isError" type="error" rounded="xl">
        {{ error?.message }}
      </v-alert>
      <v-data-table
        v-else
        :headers="headers"
        :items="filteredItems"
        :search="search"
        density="comfortable"
        hover
        class="helios-table"
      >
        <template #item.sousStatut="{ value }">
          <v-chip :color="statutColor(value)" size="x-small" label>{{ value }}</v-chip>
        </template>
        <template #item.cae="{ value }">
          {{ fmt(value) }} kWh
        </template>
        <template #item.surface="{ value }">
          {{ fmt(value) }} m²
        </template>
        <template #item.actions>
          <v-btn icon="mdi-eye-outline" variant="text" size="small" density="compact" />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useOpportunites } from '@/composables/useOpportunites.js'

  const { data, isLoading, isError, error } = useOpportunites()
  const search = ref('')
  const filterStatut = ref(null)

  const fmtNum = new Intl.NumberFormat('fr-FR')
  const fmt = (n) => fmtNum.format(n)

  const statutItems = ['Validé Technique', 'Étude en cours', 'Signature client', 'En attente']

  const statutColor = (s) => ({
    'Validé Technique': 'success',
    'Étude en cours': 'warning',
    'Signature client': 'primary',
    'En attente': 'secondary',
  }[s] ?? 'default')

  const filteredItems = computed(() => {
    let items = data.value ?? []
    if (filterStatut.value) items = items.filter((i) => i.sousStatut === filterStatut.value)
    return items
  })

  const headers = [
    { title: 'Réf.', key: 'ref', sortable: true },
    { title: 'Client', key: 'client' },
    { title: 'Zone', key: 'zone' },
    { title: 'Sous-statut', key: 'sousStatut' },
    { title: 'CAE', key: 'cae', align: 'end' },
    { title: 'Surface', key: 'surface', align: 'end' },
    { title: 'Installateur', key: 'installateur' },
    { title: 'Date', key: 'dateCreation' },
    { title: '', key: 'actions', sortable: false },
  ]
</script>

<style scoped>
  .page-container { padding: 24px; }
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .page-title { font-size: 20px; font-weight: 700; margin: 0; }
  .filter-bar { display: flex; gap: 10px; flex-wrap: wrap; }
  .table-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); overflow: hidden; }
</style>
