<template>
  <div class="page-container">
    <h2 class="page-title mb-6">Facturation</h2>

    <v-row>
      <v-col cols="12" md="4" v-for="f in MOCK_FACTURATION" :key="f.name">
        <v-card rounded="xl" elevation="0" class="fact-card">
          <v-card-text class="pa-5 text-center">
            <p class="fact-label">{{ f.name }}</p>
            <p class="fact-amount">{{ fmtEur(f.value) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card rounded="xl" elevation="0" class="mt-6 info-card">
      <v-card-text class="pa-6 text-center">
        <v-icon icon="mdi-file-document-outline" size="40" class="mb-3" opacity="0.3" />
        <p class="text-body-2" style="opacity:0.6">
          Les détails de facturation seront disponibles après connexion à votre backend.
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
  import { MOCK_FACTURATION } from '@/data/mockData.js'

  const fmtEur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    .format
</script>

<style scoped>
  .page-container { padding: 24px; }
  .page-title { font-size: 20px; font-weight: 700; margin: 0; }
  .fact-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
  .fact-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.55; margin: 0 0 8px; }
  .fact-amount { font-size: 28px; font-weight: 700; margin: 0; }
  .info-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
</style>
