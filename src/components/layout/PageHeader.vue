<!--
  PageHeader.vue
  ─────────────────────────────────────────────────────────────────────────────
  Composant réutilisable affiché EN HAUT de chaque <view>.
  Contient : breadcrumb + titre de page + filtres contextuels.

  POURQUOI ce composant séparé de AppTopbar ?
    - Il s'insère dans le flux normal du v-main (pas un overlay)
    - La hauteur est naturelle : s'adapte au contenu sur mobile
    - Chaque view peut passer ses propres filtres via le slot #filters
    - Zéro risque de chevauchement avec le dashboard

  UTILISATION :
    <PageHeader title="Tableau de bord">
      <template #filters>
        <v-chip ...>filtre custom</v-chip>
      </template>
    </PageHeader>
-->
<template>
  <div class="page-header">
    <!-- Breadcrumb -->
    <v-breadcrumbs :items="breadcrumbs" density="compact" class="pa-0 mb-1">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="14" />
      </template>
      <template #title="{ item }">
        <span :class="item.disabled ? 'breadcrumb-active' : 'breadcrumb-link'">
          {{ item.title }}
        </span>
      </template>
    </v-breadcrumbs>

    <!-- Titre + filtres -->
    <div class="header-body">
      <h1 class="page-title">{{ title }}</h1>

      <!-- Zone de filtres injectée par la page parent -->
      <div v-if="$slots.filters" class="filters-wrap">
        <slot name="filters" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const props = defineProps({
    /** Titre de la page affiché en h1 */
    title: { type: String, required: true },
    /** Dernière entrée du breadcrumb (si différente du title) */
    section: { type: String, default: 'Performance' },
  })

  const route = useRoute()

  const breadcrumbs = computed(() => [
    { title: 'Accueil',      disabled: false, href: '/' },
    { title: props.section,  disabled: false },
    { title: props.title,    disabled: true  },
  ])
</script>

<style scoped>
  .page-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgb(var(--v-theme-surface));
  }

  .breadcrumb-link {
    font-size: 12px;
    opacity: 0.55;
    cursor: pointer;
  }

  .breadcrumb-active {
    font-size: 12px;
    font-weight: 500;
  }

  .header-body {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.4px;
    line-height: 1.2;
    margin: 0;
  }

  .filters-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  /* Mobile : filters passent sous le titre */
  @media (max-width: 600px) {
    .header-body {
      flex-direction: column;
      align-items: flex-start;
    }

    .page-title {
      font-size: 18px;
    }
  }
</style>
