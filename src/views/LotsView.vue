<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Lots</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" size="small" rounded="lg">Nouveau lot</v-btn>
    </div>

    <v-card rounded="xl" elevation="0" class="table-card">
      <v-skeleton-loader v-if="isLoading" type="table" />
      <v-alert v-else-if="isError" type="error" rounded="xl">{{ error?.message }}</v-alert>
      <v-data-table
        v-else
        :headers="headers"
        :items="data ?? []"
        density="comfortable"
        hover
      >
        <template #item.statut="{ value }">
          <v-chip :color="statutColor(value)" size="x-small" label>{{ value }}</v-chip>
        </template>
        <template #item.surface="{ value }">{{ fmt(value) }} m²</template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
  import { useLots } from '@/composables/useLots.js'

  const { data, isLoading, isError, error } = useLots()

  const fmtNum = new Intl.NumberFormat('fr-FR')
  const fmt = (n) => fmtNum.format(n)
  const statutColor = (s) => ({ installé: 'success', déposé: 'primary', 'en cours': 'warning' }[s] ?? 'default')

  const headers = [
    { title: 'Réf.', key: 'ref' },
    { title: 'Adresse', key: 'adresse' },
    { title: 'Zone', key: 'zone' },
    { title: 'Installateur', key: 'installateur' },
    { title: 'Surface', key: 'surface', align: 'end' },
    { title: 'Statut', key: 'statut' },
    { title: 'Date', key: 'date' },
  ]
</script>

<style scoped>
  .page-container { padding: 24px; }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .page-title { font-size: 20px; font-weight: 700; margin: 0; }
  .table-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); overflow: hidden; }
</style>
