<template>
  <div class="not-found">
    <h1 class="code">404</h1>
    <h2 class="title">Page introuvable</h2>
    <p class="subtitle">La page que vous cherchez n'existe pas ou a été déplacée.</p>
    <v-btn color="primary" rounded="lg" :to="'/'">Retour à l'accueil</v-btn>
  </div>
</template>

<script setup>
</script>

<style scoped>
  .not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding: 24px;
  }
  .code { font-size: 96px; font-weight: 800; line-height: 1; opacity: 0.12; margin: 0; }
  .title { font-size: 22px; font-weight: 700; margin: 0; }
  .subtitle { font-size: 14px; opacity: 0.55; max-width: 380px; margin: 0 0 16px; }
</style>
