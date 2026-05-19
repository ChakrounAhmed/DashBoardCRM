# ila26 — Helios iCRM Énergie

> Interface CRM enterprise pour la gestion des programmes CEE (Certificats d'Économies d'Énergie), construite avec Vue 3 + Vuetify 3.


---

## Aperçu

Helios iCRM Énergie est le frontend du CRM ila26, dédié au suivi des opérations CEE :
pilotage des volumes CAE, gestion des opportunités et des installateurs, suivi des lots
d'isolation et analyse de la facturation — le tout sur un tableau de bord interactif avec
filtres dynamiques et objectifs KPI personnalisables.

---

## Fonctionnalités

| Module | Description |
|---|---|
| **Tableau de bord** | KPIs globaux, tendances CAE/CA, pipeline opportunités, performance par acteur et par zone |
| **Opportunités** | Liste paginée avec filtres par statut, zone et installateur |
| **Installateurs** | Fiches acteurs avec statistiques CAE, CA et lots |
| **Lots** | Suivi des lots installés / déposés / en cours |
| **Facturation** | Répartition du chiffre d'affaires par type |
| **Paramètres** | Configuration de l'interface et préférences utilisateur |

### Points techniques notables

- **Filtres globaux réactifs** — période, installateurs, zones, programme CEE — propagés à tous les graphes simultanément via `dashboardStore`
- **Objectifs KPI** — définition d'une cible par indicateur (persistée en localStorage, migrable vers API)
- **Drill-down** — clic sur une KPI card pour afficher le détail en modal avec graphe de tendance
- **Multi-select acteurs** — dropdown groupé par type d'acteur avec recherche intégrée
- **Dark mode** — bascule light/dark avec persistance
- **Export** — téléchargement des données au format XLSX (`xlsx`)
- **Responsive** — adapté desktop, tablette et mobile

---

## Stack technique

### Runtime
| Dépendance | Version | Rôle |
|---|---|---|
| `vue` | 3.5 | Framework UI |
| `vuetify` | 3.8 | Composants Material Design |
| `vue-router` | 4.5 | Routing SPA avec lazy-loading |
| `pinia` | 3.0 | State management |
| `@tanstack/vue-query` | 5.28 | Cache et synchronisation des requêtes |
| `apexcharts` + `vue3-apexcharts` | 5.10 | Graphes interactifs |
| `axios` | 1.9 | Client HTTP |
| `date-fns` | 4.1 | Manipulation des dates |
| `lodash-es` | 4.17 | Utilitaires fonctionnels |
| `xlsx` | 0.18 | Export Excel |
| `@mdi/font` | 7.4 | Icônes Material Design |
| `@vueuse/core` | 14.3 | Composables utilitaires Vue |

### Tooling
| Outil | Version |
|---|---|
| Vite | 8.0 |
| ESLint + `eslint-plugin-vue` | 9.29 |
| Prettier | 3.5 |
| `unplugin-auto-import` | Auto-import Vue/Pinia |
| `unplugin-vue-components` | Auto-import composants Vuetify |
| `vite-plugin-vue-devtools` | DevTools intégrées |

---

## Prérequis

- **Node.js** `^20.19.0` ou `>=22.12.0`
- **npm** `>=10`

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-org/helios-crm.git
cd helios-crm

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application est disponible sur **http://localhost:5173**

---

## Scripts disponibles

```bash
npm run dev       # Serveur de développement Vite avec HMR
npm run build     # Build de production (output : /dist)
npm run preview   # Prévisualiser le build de production en local
npm run lint      # Analyse ESLint
npm run format    # Formatage Prettier
```

---

## Structure du projet

```
src/
├── assets/
│   └── main.css                  # Variables CSS globales, tokens ila26, reset
│
├── components/
│   ├── dashboard/
│   │   ├── KpiCard.vue           # Carte KPI avec objectif et progression
│   │   ├── DashboardCard.vue     # Conteneur générique de graphe
│   │   ├── DrillDownModal.vue    # Modal détail KPI avec tendance
│   │   └── ObjectifModal.vue     # Modal définition d'objectif KPI
│   └── layout/
│       ├── AppTopbar.vue         # Navbar ila26 (logo + nav + filtres + user)
│       ├── AppSidebar.vue        # Stub vide (sidebar remplacée par nav horizontale)
│       └── PageHeader.vue        # En-tête de page avec breadcrumb
│
├── composables/
│   ├── useDashboard.js           # KPI, tendances, sous-statuts, zones
│   ├── useInstallateurs.js       # Données installateurs
│   ├── useLots.js                # Données lots
│   ├── useOpportunites.js        # Données opportunités
│   └── useSnackbar.js            # Notifications globales
│
├── data/
│   └── mockData.js               # Données de démonstration (à remplacer par API)
│
├── plugins/
│   ├── vuetify.js                # Thème Vuetify (palette ila26 light/dark)
│   └── vueQuery.js               # Configuration TanStack VueQuery
│
├── router/
│   └── index.js                  # Routes SPA avec lazy-loading et guards
│
├── services/
│   └── api/
│       └── mockApi.js            # Couche service (mock → à remplacer par REST)
│
├── stores/
│   ├── authStore.js              # Authentification et session utilisateur
│   ├── dashboardStore.js         # Filtres globaux et objectifs KPI
│   └── uiStore.js                # Thème, snackbar, état UI
│
└── views/
    ├── DashboardView.vue         # Tableau de bord principal
    ├── OpportunitesView.vue      # Liste des opportunités
    ├── InstallateurView.vue      # Fiches installateurs
    ├── LotsView.vue              # Suivi des lots
    ├── FacturationView.vue       # Analyse facturation
    ├── ParametresView.vue        # Paramètres utilisateur
    └── NotFoundView.vue          # Page 404
```

---

## Routes

| URL | Vue | Description |
|---|---|---|
| `/` | `DashboardView` | Tableau de bord (page d'accueil) |
| `/opportunites` | `OpportunitesView` | Liste des opportunités CEE |
| `/installateurs` | `InstallateurView` | Fiches des installateurs |
| `/lots` | `LotsView` | Lots d'isolation |
| `/facturation` | `FacturationView` | Analyse du CA |
| `/parametres` | `ParametresView` | Paramètres de l'interface |

---

## Architecture des données (état actuel — mock)

Le fichier `src/services/api/mockApi.js` centralise toutes les requêtes de données.
Chaque fonction est conçue pour être remplacée par un appel REST réel **sans modifier
les composables ni les vues**.

```javascript
// Exemple de migration : une seule ligne à changer dans le composable
// Avant (mock)
import { fetchInstallateurs } from '@/services/api/mockApi.js'

// Après (API réelle)
import { fetchInstallateurs } from '@/services/api/installateurs.js'
```

Les filtres globaux (`dateDebut`, `dateFin`, `periode`, `installateurs`, `zones`) sont
centralisés dans `dashboardStore` et utilisés comme `queryKey` TanStack Query — tout
changement de filtre déclenche automatiquement le rechargement des données concernées.

### APIs backend à implémenter

| Endpoint | Données |
|---|---|
| `GET /api/v1/kpi` | KPIs agrégés avec deltas |
| `GET /api/v1/trend/cae-ca` | Séries temporelles CAE + CA |
| `GET /api/v1/trend/lots` | Évolution lots installés/déposés |
| `GET /api/v1/acteurs` | Acteurs + performances |
| `GET /api/v1/opportunites/sous-statuts` | Distribution pipeline |
| `GET /api/v1/zones` | Agrégats par zone géographique |
| `GET /api/v1/opportunites` | Liste paginée + filtres |
| `GET /api/v1/installateurs` | Liste des installateurs |
| `GET /api/v1/lots` | Liste des lots |
| `GET /api/v1/facturation/repartition` | Répartition CA |
| `GET /api/v1/objectifs` | Objectifs KPI (migration localStorage) |

> La documentation complète des APIs (structures JSON, paramètres, schéma BDD PostgreSQL,
> plan de migration) est disponible dans `API_BACKEND_ILA26_CRM.md`.

---

## Charte graphique

| Token | Valeur | Usage |
|---|---|---|
| `--nav-bg` | `#3b0d8c` | Fond navbar principale |
| `--ila-primary` | `#7c3aed` | Couleur primaire (boutons, accents, liens actifs) |
| `--ila-soft` | `#ede9fe` | Fond doux violet (badges, highlights) |
| `--ila-green` | `#059669` | Accent positif / succès |
| `background` | `#f8f9fb` | Fond général de l'application |

Le thème sombre est géré via Vuetify avec des tokens complémentaires définis dans
`src/plugins/vuetify.js`.

---

## Développement

### Ajouter un nouveau graphe

1. Créer la fonction de fetch dans `src/services/api/mockApi.js`
2. Ajouter le composable dans `src/composables/` en utilisant `useQuery`
3. Consommer le composable dans la vue concernée
4. Brancher les filtres globaux via `dashboardStore.filtres` comme `queryKey`

### Ajouter une vue

1. Créer `src/views/MaVue.vue`
2. Ajouter la route dans `src/router/index.js`
3. Ajouter le lien dans `AppTopbar.vue` → tableau `navLinks`

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
VITE_API_BASE_URL=https://api.ila26.com/v1
VITE_APP_VERSION=2.0.0
```

Puis dans `axios` :
```javascript
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
```

---

## Build de production

```bash
npm run build
```

Les fichiers sont générés dans le dossier `/dist`, prêts à être déployés sur
n'importe quel serveur statique (Nginx, Apache, Vercel, Netlify, etc.).

### Exemple de configuration Nginx

```nginx
server {
  listen 80;
  root /var/www/helios-crm/dist;
  index index.html;

  # SPA : toutes les routes vers index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache statique pour les assets Vite (hashed)
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## Contributeurs

| Nom | Rôle |
|---|---|
| Nizar HAKIM | Product Owner / Lead développement |

---

## Licence

Propriétaire — © 2025 ila26 iCRM Énergie. Tous droits réservés.  
Ce projet est confidentiel. Toute reproduction ou distribution sans autorisation est interdite.
