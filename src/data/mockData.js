/**
 * @file mockData.js
 * @description Centralise toutes les fausses données du projet Helios Energy Suite.
 */

// ─── Installateurs ────────────────────────────────────────────────────────────
/** @typedef {{ id:number, name:string, cae:number, ca:number, lots:number, zone:string, statut:string, since:string }} Installateur */
export const MOCK_INSTALLATEURS = [
  { id: 1, name: 'Solaris FR',    cae: 450200, ca: 1240500, lots: 32, zone: 'Île-de-France',    statut: 'actif',    since: '2022-03-15' },
  { id: 2, name: 'EcoNRJ Tech',   cae: 310000, ca: 980200,  lots: 24, zone: 'PACA',             statut: 'actif',    since: '2021-11-08' },
  { id: 3, name: 'Volt Artisan',  cae: 280400, ca: 612000,  lots: 18, zone: 'Auvergne-RA',      statut: 'actif',    since: '2023-01-22' },
  { id: 4, name: 'Helios Pro',    cae: 245000, ca: 540000,  lots: 16, zone: 'Grand Est',         statut: 'actif',    since: '2022-07-10' },
  { id: 5, name: 'GreenWatt',     cae: 198000, ca: 412000,  lots: 12, zone: 'Hauts-de-France',  statut: 'actif',    since: '2023-04-05' },
  { id: 6, name: 'Iso+',          cae: 142000, ca: 298000,  lots: 9,  zone: 'Nouvelle-Aquitaine', statut: 'actif',  since: '2023-09-18' },
  { id: 7, name: 'ThermoExpert',  cae: 128500, ca: 267000,  lots: 8,  zone: 'Bretagne',          statut: 'actif',   since: '2024-01-10' },
  { id: 8, name: 'Lumex Énergie', cae: 95000,  ca: 198000,  lots: 6,  zone: 'Pays de la Loire',  statut: 'inactif', since: '2022-05-14' },
  { id: 9, name: 'RénoVert',      cae: 78000,  ca: 162000,  lots: 5,  zone: 'Occitanie',         statut: 'actif',   since: '2024-02-28' },
  { id:10, name: 'ChaleurPlus',   cae: 52000,  ca: 108000,  lots: 3,  zone: 'Normandie',         statut: 'suspendu',since: '2021-08-30' },
]

// ─── Zones géographiques ──────────────────────────────────────────────────────
/**
 * @typedef {{ zone:string, cae:number, surface:number, opps:number, validees:number }} Zone
 * opps    = total opportunités
 * validees = opportunités validées techniquement (sous-ensemble de opps)
 */
export const MOCK_ZONES = [
  { zone: 'Île-de-France',      cae: 420000, surface: 3050, opps: 198, validees: 120, ca: 850000  },
  { zone: 'PACA',               cae: 510000, surface: 1980, opps: 162, validees: 95,  ca: 980000  },
  { zone: 'Auvergne-RA',        cae: 380000, surface: 1720, opps: 134, validees: 78,  ca: 720000  },
  { zone: 'Hauts-de-France',    cae: 220000, surface: 1540, opps: 92,  validees: 55,  ca: 420000  },
  { zone: 'Grand Est',          cae: 280000, surface: 1600, opps: 110, validees: 64,  ca: 530000  },
  { zone: 'Nouvelle-Aquitaine', cae: 177234, surface: 1890, opps: 86,  validees: 50,  ca: 340000  },
  { zone: 'Bretagne',           cae: 142000, surface: 1120, opps: 60,  validees: 34,  ca: 260000  },
  { zone: 'Occitanie',          cae: 195000, surface: 1680, opps: 78,  validees: 45,  ca: 180000  },
]
// ↑ surface totale = 14 580 m² = MOCK_KPI.surfaceIsolee ✓
// ↑ ca total = 4 280 000 € = MOCK_KPI.chiffreAffaires ✓

// ─── Trend mensuel (CAE + CA) ─────────────────────────────────────────────────
/** @typedef {{ m:string, cae:number, ca:number }} TrendPoint */
export const MOCK_TREND = [
  { m: 'Avr', cae: 142, ca: 280 },
  { m: 'Mai', cae: 158, ca: 310 },
  { m: 'Juin', cae: 171, ca: 340 },
  { m: 'Juil', cae: 165, ca: 325 },
  { m: 'Août', cae: 182, ca: 360 },
  { m: 'Sep',  cae: 198, ca: 392 },
  { m: 'Oct',  cae: 174, ca: 348 },
  { m: 'Nov',  cae: 210, ca: 415 },
  { m: 'Déc',  cae: 236, ca: 472 },
  { m: 'Jan',  cae: 218, ca: 432 },
  { m: 'Fév',  cae: 245, ca: 488 },
  { m: 'Mar',  cae: 268, ca: 532 },
]

// ─── Sous-statuts des opportunités ───────────────────────────────────────────
/** @typedef {{ name:string, value:number, color:string }} SousStatut */
export const MOCK_SOUS_STATUTS = [
  { name: 'Validé Technique', value: 342, color: '#2ECC8F' },
  { name: 'Étude en cours',   value: 218, color: '#E8A020' },
  { name: 'Signature client', value: 184, color: '#5B4FE8' },
  { name: 'En attente',       value: 98,  color: '#C4C2D8' },
]

// ─── Facturation ─────────────────────────────────────────────────────────────
/** @typedef {{ name:string, value:number }} FacturationType */
export const MOCK_FACTURATION = [
  { name: 'CAE',      value: 2400000 },
  { name: 'Divers',   value: 1100000 },
  { name: 'Factures', value:  780000 }, // total = 4 280 000 € ✓
]

// ─── Trend des lots ───────────────────────────────────────────────────────────
/** @typedef {{ m:string, installes:number, deposes:number }} LotTrend */
export const MOCK_LOTS_TREND = [
  { m: 'Avr', installes: 42, deposes: 18 },
  { m: 'Mai', installes: 51, deposes: 22 },
  { m: 'Juin', installes: 48, deposes: 20 },
  { m: 'Juil', installes: 55, deposes: 24 },
  { m: 'Août', installes: 62, deposes: 28 },
  { m: 'Sep',  installes: 58, deposes: 26 },
  { m: 'Oct',  installes: 64, deposes: 30 },
  { m: 'Nov',  installes: 71, deposes: 33 },
  { m: 'Déc',  installes: 78, deposes: 36 },
  { m: 'Jan',  installes: 68, deposes: 31 },
  { m: 'Fév',  installes: 74, deposes: 34 },
  { m: 'Mar',  installes: 82, deposes: 38 },
]

// ─── Opportunités ─────────────────────────────────────────────────────────────
/** @typedef {{ id:number, ref:string, client:string, zone:string, sousStatut:string, cae:number, surface:number, installateur:string, dateCreation:string }} Opportunite */
export const MOCK_OPPORTUNITES = [
  { id: 1, ref: 'OPP-2025-001', client: 'Dupont SCI',         zone: 'Île-de-France',    sousStatut: 'Validé Technique', cae: 48000, surface: 380, installateur: 'Solaris FR',   dateCreation: '2025-01-10' },
  { id: 2, ref: 'OPP-2025-002', client: 'Résidence Mirabeau', zone: 'PACA',             sousStatut: 'Étude en cours',   cae: 62000, surface: 520, installateur: 'EcoNRJ Tech',  dateCreation: '2025-01-14' },
  { id: 3, ref: 'OPP-2025-003', client: 'Lotissement Le Pin', zone: 'Auvergne-RA',      sousStatut: 'Signature client', cae: 35000, surface: 260, installateur: 'Volt Artisan', dateCreation: '2025-01-18' },
  { id: 4, ref: 'OPP-2025-004', client: 'HLM Horizon',        zone: 'Hauts-de-France',  sousStatut: 'En attente',       cae: 28000, surface: 210, installateur: 'GreenWatt',    dateCreation: '2025-01-22' },
  { id: 5, ref: 'OPP-2025-005', client: 'Bailleur Social Est',zone: 'Grand Est',         sousStatut: 'Validé Technique', cae: 55000, surface: 440, installateur: 'Helios Pro',   dateCreation: '2025-01-28' },
  { id: 6, ref: 'OPP-2025-006', client: 'Coopérative Verte',  zone: 'Nouvelle-Aquitaine',sousStatut: 'Étude en cours',  cae: 40000, surface: 310, installateur: 'Iso+',         dateCreation: '2025-02-03' },
  { id: 7, ref: 'OPP-2025-007', client: 'SCI Atlantique',     zone: 'Bretagne',          sousStatut: 'Validé Technique', cae: 31000, surface: 240, installateur: 'ThermoExpert', dateCreation: '2025-02-07' },
  { id: 8, ref: 'OPP-2025-008', client: 'Promoteur Soleil',   zone: 'Occitanie',         sousStatut: 'Signature client', cae: 47000, surface: 375, installateur: 'RénoVert',    dateCreation: '2025-02-12' },
  { id: 9, ref: 'OPP-2025-009', client: 'Résidence Mermoz',   zone: 'Île-de-France',    sousStatut: 'En attente',       cae: 22000, surface: 170, installateur: 'Solaris FR',   dateCreation: '2025-02-18' },
  { id:10, ref: 'OPP-2025-010', client: 'Office HLM Sud',     zone: 'PACA',             sousStatut: 'Validé Technique', cae: 71000, surface: 590, installateur: 'EcoNRJ Tech',  dateCreation: '2025-02-22' },
]

// ─── Lots ─────────────────────────────────────────────────────────────────────
/** @typedef {{ id:number, ref:string, adresse:string, zone:string, installateur:string, surface:number, statut:string, date:string }} Lot */
export const MOCK_LOTS = [
  { id: 1, ref: 'LOT-001', adresse: '12 rue de la Paix, Paris',       zone: 'Île-de-France',    installateur: 'Solaris FR',    surface: 120, statut: 'installé',  date: '2025-01-05' },
  { id: 2, ref: 'LOT-002', adresse: '8 av des Mimosas, Nice',          zone: 'PACA',             installateur: 'EcoNRJ Tech',   surface: 95,  statut: 'installé',  date: '2025-01-08' },
  { id: 3, ref: 'LOT-003', adresse: '24 rue Ampère, Lyon',             zone: 'Auvergne-RA',      installateur: 'Volt Artisan',  surface: 108, statut: 'déposé',    date: '2025-01-12' },
  { id: 4, ref: 'LOT-004', adresse: '3 impasse des Chênes, Lille',     zone: 'Hauts-de-France',  installateur: 'GreenWatt',     surface: 88,  statut: 'en cours',  date: '2025-01-15' },
  { id: 5, ref: 'LOT-005', adresse: '17 bd Haussmann, Strasbourg',     zone: 'Grand Est',         installateur: 'Helios Pro',    surface: 142, statut: 'installé',  date: '2025-01-20' },
  { id: 6, ref: 'LOT-006', adresse: '5 rue des Pins, Bordeaux',        zone: 'Nouvelle-Aquitaine',installateur: 'Iso+',          surface: 76,  statut: 'déposé',    date: '2025-01-25' },
  { id: 7, ref: 'LOT-007', adresse: '29 av du Peuple Breton, Rennes',  zone: 'Bretagne',          installateur: 'ThermoExpert',  surface: 98,  statut: 'installé',  date: '2025-02-02' },
  { id: 8, ref: 'LOT-008', adresse: '11 rue du Capitole, Toulouse',    zone: 'Occitanie',         installateur: 'RénoVert',     surface: 115, statut: 'en cours',  date: '2025-02-06' },
  { id: 9, ref: 'LOT-009', adresse: '6 rue Léopold, Nantes',           zone: 'Pays de la Loire',  installateur: 'Lumex Énergie', surface: 84,  statut: 'installé',  date: '2025-02-10' },
  { id:10, ref: 'LOT-010', adresse: '32 rue Saint-Nicolas, Rouen',     zone: 'Normandie',         installateur: 'ChaleurPlus',  surface: 67,  statut: 'déposé',    date: '2025-02-14' },
]

// ─── KPI globaux ──────────────────────────────────────────────────────────────
/** @typedef {{ volumeCae:number, chiffreAffaires:number, opportunites:number, surfaceIsolee:number, volumeInstalle:{installe:number,depose:number}, nombreLots:number }} KpiGlobal */
export const MOCK_KPI = {
  volumeCae: 1987234,
  chiffreAffaires: 4280000,
  opportunites: 842,
  surfaceIsolee: 14580,
  volumeInstalle: { installe: 64, depose: 28 },
  nombreLots: 1204,
  lotsDeposes: 342,
  deltaVolumeCae: 12.4,
  deltaChiffreAffaires: 8.2,
  deltaOpportunites: -1.2,
  deltaSurface: 5.7,
  deltaVolumeInstalle: 3.4,
  deltaNombreLots: 6.1,
  deltaLotsTotal: 5.3,
  deltaLotsDeposes: 4.8,
  
}

// ─── Acteurs (pour filtres dashboard) ────────────────────────────────────────
export const MOCK_TYPES_ACTEUR = [
  { id: 'installateur', label: 'Installateur' },
  { id: 'regie',        label: 'Régie' },
  { id: 'controleur',   label: 'Contrôleur' },
  { id: 'mandataire',   label: 'Mandataire' },
  { id: 'delegataire',  label: 'Délégataire' },
  { id: 'bureau_etude', label: "Bureau d'étude" },
]

export const MOCK_ACTEURS = [
  { id:'a1',  name:'Énergie Sud',    type:'installateur', ca:820000, opp:420, caeI:62, caeD:71, surf:16200 },
  { id:'a2',  name:'ThermoPlus',     type:'installateur', ca:640000, opp:340, caeI:48, caeD:56, surf:13800 },
  { id:'a3',  name:'IsolaPro',       type:'installateur', ca:580000, opp:310, caeI:42, caeD:49, surf:11400 },
  { id:'a4',  name:'VertIso',        type:'installateur', ca:430000, opp:214, caeI:32, caeD:34, surf:6800  },
  { id:'a5',  name:'SAMIBE ENERGIA', type:'installateur', ca:390000, opp:186, caeI:28, caeD:32, surf:7200  },
  { id:'a6',  name:'Régie Nord',     type:'regie',        ca:310000, opp:152, caeI:22, caeD:26, surf:5800  },
  { id:'a7',  name:'Régie Centre',   type:'regie',        ca:260000, opp:134, caeI:18, caeD:21, surf:4900  },
  { id:'a8',  name:'Régie Sud',      type:'regie',        ca:190000, opp:98,  caeI:14, caeD:17, surf:3600  },
  { id:'a9',  name:'Ctrl Habitat',   type:'controleur',   ca:0,      opp:580, caeI:0,  caeD:0,  surf:0     },
  { id:'a10', name:'VérifPro',       type:'controleur',   ca:0,      opp:440, caeI:0,  caeD:0,  surf:0     },
  { id:'a11', name:'SudMandat',      type:'mandataire',   ca:280000, opp:198, caeI:20, caeD:24, surf:7400  },
  { id:'a12', name:'ACCIONA ESCO',   type:'delegataire',  ca:450000, opp:230, caeI:35, caeD:42, surf:9200  },
  { id:'a13', name:'BET Thermique',  type:'bureau_etude', ca:150000, opp:92,  caeI:0,  caeD:0,  surf:0     },
]

export const ACTEUR_COLORS = {
  installateur: '#7c3aed',
  regie:        '#059669',
  controleur:   '#2563eb',
  mandataire:   '#d97706',
  delegataire:  '#0891b2',
  bureau_etude: '#dc2626',
}

export const MOCK_SOUS_STATUTS_FULL = [
  { l:'Prospect',          n:312, c:'#64748b' },
  { l:'Qualification',     n:248, c:'#4338ca' },
  { l:'Éligibilité',       n:196, c:'#7c3aed' },
  { l:'Audit terrain',     n:158, c:'#2563eb' },
  { l:'Devis envoyé',      n:130, c:'#0891b2' },
  { l:'Accord client',     n:104, c:'#059669' },
  { l:'Dossier constitué', n:87,  c:'#65a30d' },
  { l:'Révisions dépôts',  n:74,  c:'#d97706' },
  { l:'En instruction',    n:61,  c:'#f59e0b' },
  { l:'Prime accordée',    n:52,  c:'#db2777' },
  { l:'Travaux réalisés',  n:43,  c:'#7c3aed' },
  { l:'Clôturé',           n:38,  c:'#4338ca' },
  { l:'Refusé',            n:31,  c:'#dc2626' },
]

export const MOCK_ZONES_GEO = {
  noms:  ['Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest'],
  caeI:  [52, 44, 49, 39],
  caeD:  [61, 52, 57, 40],
  surf:  [14200, 12800, 11600, 9600],
  opp:   [340, 290, 380, 274],
}
