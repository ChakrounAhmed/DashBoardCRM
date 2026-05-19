<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Installateurs</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" size="small" rounded="lg">
        Ajouter
      </v-btn>
    </div>

    <v-skeleton-loader v-if="isLoading" type="table" />
    <v-alert v-else-if="isError" type="error" rounded="xl">{{ error?.message }}</v-alert>

    <v-row v-else>
      <v-col v-for="it in data" :key="it.id" cols="12" sm="6" lg="4">
        <v-card rounded="xl" elevation="0" class="inst-card">
          <v-card-text class="pa-5">
            <div class="inst-header">
              <div class="inst-avatar">{{ initials(it.name) }}</div>
              <div>
                <p class="inst-name">{{ it.name }}</p>
                <p class="inst-zone">{{ it.zone }}</p>
              </div>
              <v-spacer />
              <v-chip :color="statutColor(it.statut)" size="x-small" label>{{ it.statut }}</v-chip>
            </div>
            <v-divider class="my-3" />
            <div class="inst-stats">
              <div class="stat">
                <p class="stat-val">{{ fmt(it.cae) }}</p>
                <p class="stat-label">kWh CAE</p>
              </div>
              <div class="stat">
                <p class="stat-val">{{ fmtEurShort(it.ca) }}</p>
                <p class="stat-label">CA</p>
              </div>
              <div class="stat">
                <p class="stat-val">{{ it.lots }}</p>
                <p class="stat-label">Lots</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { useInstallateurs } from '@/composables/useInstallateurs.js'

  const { data, isLoading, isError, error } = useInstallateurs()

  const fmtNum = new Intl.NumberFormat('fr-FR')
  const fmt = (n) => fmtNum.format(n)
  const fmtEurShort = (n) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M €` : `${(n / 1000).toFixed(0)}k €`
  const initials = (name) => name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()
  const statutColor = (s) => ({ actif: 'success', inactif: 'warning', suspendu: 'error' }[s] ?? 'default')
</script>

<style scoped>
  .page-container { padding: 24px; }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .page-title { font-size: 20px; font-weight: 700; margin: 0; }
  .inst-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
  .inst-header { display: flex; align-items: center; gap: 10px; }
  .inst-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(91,79,232,0.15), rgba(46,204,143,0.15));
    color: #5b4fe8; font-size: 12px; font-weight: 700;
    display: grid; place-items: center; flex-shrink: 0;
  }
  .inst-name { font-size: 14px; font-weight: 600; margin: 0; }
  .inst-zone { font-size: 11px; opacity: 0.55; margin: 0; }
  .inst-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .stat { text-align: center; padding: 8px; border-radius: 8px; background: rgba(var(--v-theme-surface-variant), 1); }
  .stat-val { font-size: 14px; font-weight: 700; margin: 0; font-variant-numeric: tabular-nums; }
  .stat-label { font-size: 10px; opacity: 0.55; margin: 0; text-transform: uppercase; letter-spacing: 0.04em; }
</style>
