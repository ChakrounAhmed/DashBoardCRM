<template>
  <v-app :theme="ui.theme">
    <!-- Sidebar supprimée — nav horizontale dans AppTopbar -->
    <AppSidebar />

    <!-- Navbar ila26 sticky (topbar unique conforme image CRM + page.html) -->
    <AppTopbar />

    <!-- Contenu : no sidebar offset -->
    <v-main style="--v-layout-left:0px !important; padding-top:0 !important;">
      <RouterView />
    </v-main>

    <!-- Snackbar global -->
    <v-snackbar
      v-model="ui.snackbar.show"
      :color="ui.snackbar.color"
      location="bottom right"
      :timeout="3000"
      rounded="lg"
    >
      {{ ui.snackbar.text }}
      <template #actions>
        <v-btn icon="mdi-close" variant="text" size="small" @click="ui.hideSnackbar" />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { onMounted }         from 'vue'
import { useUiStore }        from '@/stores/uiStore.js'
import { useAuthStore }      from '@/stores/authStore.js'
import { useDashboardStore } from '@/stores/dashboardStore.js'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar  from '@/components/layout/AppTopbar.vue'

const ui        = useUiStore()
const auth      = useAuthStore()
const dashStore = useDashboardStore()

onMounted(() => {
  auth.hydrate()
  dashStore.chargerObjectifs()
})
</script>

<style>
/* Annule le décalage Vuetify dû à l'ancien drawer */
.v-application__wrap { padding-left: 0 !important; }
.v-main               { --v-layout-left: 0px !important; padding-left: 0 !important; }
/* Masque tout v-navigation-drawer résiduel */
.v-navigation-drawer  { display: none !important; }
</style>
