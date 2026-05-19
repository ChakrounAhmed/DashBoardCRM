<template>
  <!-- ═══════════════════════════════════════════════════════════════════
       NAVBAR ila26 — réplique pixel-perfect du CRM réel (image)
       Structure : une seule barre sticky avec logo + ctx + navlinks + actions
       Pas de sous-nav séparée : tout dans la navbar comme dans page.html
  ═══════════════════════════════════════════════════════════════════════ -->
  <header class="crm-nav">
    <!-- Brand ila26 -->
    <div class="crm-brand">
      <div class="brand-logo">
        <span class="brand-ila">ila</span><span class="brand-box">26</span>
      </div>
      <div class="brand-sub">iCRM ÉNERGIE</div>
    </div>

    <!-- Contexte CAE España | Énergie -->
    <div class="crm-ctx">
      <span class="ctx-entity">CAE España</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 3.5L5 6.5L8 3.5" stroke="white" stroke-width="1.5" />
      </svg>
      <span class="crm-ctx-sep">|</span>
      <span class="ctx-module">Énergie</span>
    </div>

    <!-- Liens navigation (style page.html : uppercase dans la nav violet) -->
    <nav class="crm-navlinks">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="crm-navlink"
        active-class="crm-navlink--active"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <!-- Actions droite -->
    <div class="crm-actions">
      <span class="crm-version">v2.0.20</span>

      <!-- Sélecteur programme (style image CRM : fond semi-transparent) -->
      <select v-model="programmeActif" class="crm-psel">
        <option v-for="p in programmes" :key="p" :value="p">{{ p }}</option>
      </select>

      <!-- Thème -->
      <button
        class="crm-icon-btn"
        :title="ui.theme === 'light' ? 'Mode sombre' : 'Mode clair'"
        @click="ui.toggleTheme"
      >
        <svg
          v-if="ui.theme === 'light'"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <svg
          v-else
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
        </svg>
      </button>

      <!-- Notifications (style image : badge rouge) -->
      <button class="crm-icon-btn notif-btn" title="Notifications">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span class="notif-dot">3</span>
      </button>

      <!-- Objectifs KPI (accessible depuis la nav) -->
      <div class="crm-obj-wrap">
        <button class="crm-icon-btn" title="Objectifs KPI" @click="showObjMenu = !showObjMenu">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </button>
        <div v-if="showObjMenu" class="crm-obj-dropdown">
          <p class="crm-obj-title">Définir un objectif</p>
          <button
            v-for="k in kpiList"
            :key="k.key"
            class="crm-obj-item"
            @click="
              ouvrirObjectif(k),
              showObjMenu = false
            "
          >
            <v-icon :icon="k.icon" size="13" class="me-2" style="color: #a78bfa" />
            {{ k.label }}
          </button>
        </div>
        <div v-if="showObjMenu" class="crm-overlay" @click="showObjMenu = false" />
      </div>

      <!-- + Ajouter -->
      <button
        class="crm-btn-add"
        @click="ui.showSnackbar('Fonctionnalité disponible après connexion au backend', 'info')"
      >
        + Ajouter
      </button>

      <!-- Drapeau langue (style image CRM) -->
      <div class="crm-lang">
        <span class="fr-flag">
          <span class="flag-b" style="background: #002395"></span>
          <span class="flag-b" style="background: #fff"></span>
          <span class="flag-b" style="background: #ed2939"></span>
        </span>
        <span class="lang-txt">Français</span>
      </div>

      <!-- Avatar user (style image : violet avec initiales) -->
      <div class="crm-avatar" :title="auth.user?.name ?? 'Nizar HAKIM'">
        {{ auth.userInitials ?? 'NH' }}
      </div>
    </div>
  </header>

  <!-- Modal objectif (inchangé) -->
  <ObjectifModal
    v-if="objectifCible"
    v-model="objectifModalOpen"
    :kpi-key="objectifCible.key"
    :kpi-label="objectifCible.label"
    :kpi-unit="objectifCible.unit"
    :valeur-actuelle="objectifCible.valeurActuelle"
    :objectif-existant="dashStore.objectifs[objectifCible.key]"
    @enregistrer="({ kpiKey: k, objectif: o }) => dashStore.definirObjectif(k, o)"
    @supprimer="(k) => dashStore.supprimerObjectif(k)"
  />
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useUiStore } from '@/stores/uiStore.js'
  import { useAuthStore } from '@/stores/authStore.js'
  import { useDashboardStore } from '@/stores/dashboardStore.js'
  import { useDashboard } from '@/composables/useDashboard.js'
  import ObjectifModal from '@/components/dashboard/ObjectifModal.vue'

  const ui = useUiStore()
  const auth = useAuthStore()
  const dashStore = useDashboardStore()
  const { kpi } = useDashboard()

  const showObjMenu = ref(false)
  const objectifModalOpen = ref(false)
  const objectifCible = ref(null)
  const programmeActif = ref('RES020 – AISLAMIENTO RESIDENCIAL <25%')

  const programmes = [
    'RES020 – AISLAMIENTO RESIDENCIAL <25%',
    'RES030 – AISLAMIENTO RESIDENCIAL <35%',
    'RES040 – AISLAMIENTO RESIDENCIAL <45%',
  ]

  // Liens nav — identiques à page.html
  const navLinks = [
    { label: 'Opportunité', to: '/opportunites' },
    { label: 'Contacts', to: '/contacts' },
    { label: 'Planning', to: '/planning' },
    { label: 'Facturation', to: '/facturation' },
    { label: 'Lot de dépôts', to: '/lots' },
    { label: 'Mandant', to: '/installateurs' },
    { label: 'Tableau de bord', to: '/' },
  ]

  const kpiList = computed(() => [
    {
      key: 'volumeCAE',
      label: 'Volume CAE',
      unit: 'kWh',
      icon: 'mdi-lightning-bolt',
      valeurActuelle: kpi.data.value?.volumeCae,
    },
    {
      key: 'chiffreAffaires',
      label: "Chiffre d'affaires",
      unit: '€',
      icon: 'mdi-currency-eur',
      valeurActuelle: kpi.data.value?.chiffreAffaires,
    },
    {
      key: 'opportunites',
      label: 'Opportunités',
      unit: 'opps',
      icon: 'mdi-briefcase-outline',
      valeurActuelle: kpi.data.value?.opportunites,
    },
    {
      key: 'surfaceIsolee',
      label: 'Surface isolée',
      unit: 'm²',
      icon: 'mdi-home-outline',
      valeurActuelle: kpi.data.value?.surfaceIsolee,
    },
    {
      key: 'volumeInstalle',
      label: 'Volume installé',
      unit: 'dép.',
      icon: 'mdi-package-variant-closed',
      valeurActuelle: kpi.data.value?.volumeInstalle?.installe,
    },
    {
      key: 'nombreLots',
      label: 'Nombre de lots',
      unit: 'lots',
      icon: 'mdi-layers-outline',
      valeurActuelle: kpi.data.value?.nombreLots,
    },
  ])

  function ouvrirObjectif(k) {
    objectifCible.value = k
    objectifModalOpen.value = true
  }
</script>

<style scoped>
  /* ═══════════════════════════════════════════════════════════════════════
   NAVBAR ila26 — conforme à l'image du CRM réel + page.html
   Fond : #3b0d8c (violet très sombre)
   Hauteur : 56px, sticky top:0
═══════════════════════════════════════════════════════════════════════ */
  .crm-nav {
    position: sticky;
    top: 0;
    z-index: 200;
    height: 56px;
    background: #3b0d8c;
    display: flex;
    align-items: center;
    padding: 0 18px;
    gap: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  }

  /* ── Brand ila26 ─────────────────────────────────────────────────────── */
  .crm-brand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 16px;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    flex-shrink: 0;
  }
  .brand-logo {
    display: flex;
    align-items: center;
    line-height: 1;
  }
  .brand-ila {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
  }
  .brand-box {
    background: #7c3aed;
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    margin-left: 1px;
  }
  .brand-sub {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  /* ── Contexte ────────────────────────────────────────────────────────── */
  .crm-ctx {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 14px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 12px;
    font-weight: 500;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    flex-shrink: 0;
    white-space: nowrap;
  }
  .ctx-entity {
    font-weight: 600;
  }
  .ctx-module {
    opacity: 0.75;
  }
  .crm-ctx-sep {
    opacity: 0.3;
  }

  /* ── Navigation links — style page.html exactement ──────────────────── */
  .crm-navlinks {
    display: flex;
    align-items: stretch;
    flex: 1;
    margin-left: 4px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .crm-navlinks::-webkit-scrollbar {
    display: none;
  }

  .crm-navlink {
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 56px;
    color: rgba(255, 255, 255, 0.55);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition:
      color 0.15s,
      border-color 0.15s;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .crm-navlink:hover {
    color: #fff;
  }
  .crm-navlink--active {
    color: #fff !important;
    border-bottom-color: #a78bfa;
  }

  /* ── Actions droite ──────────────────────────────────────────────────── */
  .crm-actions {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-left: auto;
    flex-shrink: 0;
  }
  .crm-version {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
  }

  /* Programme select */
  .crm-psel {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
    border-radius: 6px;
    padding: 5px 9px;
    font-size: 11px;
    outline: none;
    cursor: pointer;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .crm-psel option {
    background: #3b0d8c;
    color: #fff;
  }

  /* Icône btn générique */
  .crm-icon-btn {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
    display: grid;
    place-items: center;
    transition:
      background 0.15s,
      color 0.15s;
    flex-shrink: 0;
    position: relative;
  }
  .crm-icon-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  /* Notification badge */
  .notif-btn {
    position: relative;
  }
  .notif-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 14px;
    height: 14px;
    background: #ef4444;
    border-radius: 50%;
    font-size: 8px;
    font-weight: 700;
    color: #fff;
    display: grid;
    place-items: center;
    border: 1.5px solid #3b0d8c;
  }

  /* Objectifs dropdown */
  .crm-obj-wrap {
    position: relative;
  }
  .crm-overlay {
    position: fixed;
    inset: 0;
    z-index: 299;
  }
  .crm-obj-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 300;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.14);
    min-width: 220px;
    padding: 6px 0;
    overflow: hidden;
  }
  .crm-obj-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    padding: 6px 14px 4px;
    margin: 0;
  }
  .crm-obj-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 7px 14px;
    font-size: 12px;
    color: #1e293b;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }
  .crm-obj-item:hover {
    background: #f1f5f9;
  }

  /* Bouton + Ajouter */
  .crm-btn-add {
    background: #7c3aed;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .crm-btn-add:hover {
    background: #5b21b6;
  }

  /* Langue + drapeau (style image CRM) */
  .crm-lang {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 11px;
    cursor: pointer;
  }
  .fr-flag {
    width: 18px;
    height: 12px;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .flag-b {
    flex: 1;
  }
  .lang-txt {
    font-size: 11px;
    white-space: nowrap;
  }

  /* Avatar utilisateur */
  .crm-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #7c3aed;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
  }

  /* ── Mobile ──────────────────────────────────────────────────────────── */
  @media (max-width: 860px) {
    .crm-navlinks {
      display: none;
    }
    .crm-ctx {
      display: none;
    }
    .crm-psel {
      max-width: 140px;
    }
    .lang-txt {
      display: none;
    }
  }
</style>
