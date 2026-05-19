<template>
  <div class="page-container">
    <h2 class="page-title mb-6">Paramètres</h2>

    <v-card rounded="xl" elevation="0" class="settings-card">
      <v-list lines="two">
        <v-list-subheader>Apparence</v-list-subheader>
        <v-list-item title="Thème" subtitle="Basculer entre le mode clair et sombre">
          <template #append>
            <v-switch
              :model-value="ui.theme === 'dark'"
              color="primary"
              hide-details
              @update:model-value="ui.toggleTheme"
            />
          </template>
        </v-list-item>

        <v-divider />
        <v-list-subheader>Compte</v-list-subheader>
        <v-list-item title="Utilisateur" :subtitle="auth.user?.email ?? 'shirley@helios-energy.fr'" />
        <v-list-item title="Rôle" :subtitle="auth.user?.role ?? 'Admin'" />
        <v-divider />

        <v-list-item title="Se déconnecter" prepend-icon="mdi-logout" @click="handleLogout" class="text-error" />
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
  import { useAuthStore } from '@/stores/authStore.js'
  import { useUiStore } from '@/stores/uiStore.js'
  import { useSnackbar } from '@/composables/useSnackbar.js'
  import { useRouter } from 'vue-router'

  const auth = useAuthStore()
  const ui = useUiStore()
  const router = useRouter()
  const snackbar = useSnackbar()

  function handleLogout() {
    auth.logout()
    snackbar.info('Vous êtes déconnecté.')
    router.push('/')
  }
</script>

<style scoped>
  .page-container { padding: 24px; }
  .page-title { font-size: 20px; font-weight: 700; margin: 0; }
  .settings-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
</style>
