# 💰 Akuma Budget

Une application moderne de gestion financière personnelle construite avec React 18, Vite et Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646cff.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.55.0-3ecf8e.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Description

Akuma Budget est une application complète de gestion financière qui vous permet de suivre vos revenus, dépenses, budgets et d'analyser vos habitudes financières avec des graphiques interactifs et un système de catégorisation avancé.

## ✨ Fonctionnalités

### 💳 Gestion des Transactions
- Ajout/modification/suppression de transactions
- 7 types de transactions prédéfinis (revenus, dépenses fixes/variables, épargne, investissements, dettes, remboursements)
- 46 catégories organisées par type
- Filtrage par période, catégorie et recherche textuelle
- Historique complet des transactions

### 📊 Visualisation des Données
- **4 types de graphiques** : Camembert, Barres, Courbe, Aire
- Graphiques interactifs avec Recharts
- Indicateurs financiers en temps réel
- Évolution temporelle des finances
- Système de favoris pour les graphiques

### 🎯 Gestion des Budgets
- Création de budgets par catégorie
- Suivi automatique des dépenses vs budget
- Alertes de dépassement de budget
- Progression visuelle avec indicateurs colorés
- Interface moderne de gestion

### 🔐 Authentification & Sécurité
- Système d'authentification Supabase
- Gestion des sessions utilisateur
- Isolation complète des données par utilisateur
- Politiques RLS (Row Level Security)
- Mode développement avec OTP de test

### 🎨 Interface Moderne
- Design responsive avec Tailwind CSS
- Mode sombre/clair automatique
- Interface moderne avec gradients et animations
- Sidebar de navigation intuitive
- Composants réutilisables

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase configuré

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone [URL_DU_REPO]
cd Akuma_Budget
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
# Créer le fichier .env
cp .env.example .env
```

Remplir le fichier `.env` avec vos clés Supabase :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Initialiser la base de données**
```bash
npm run apply-schema
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📁 Structure du Projet

```
Akuma_Budget/
├── 📂 src/
│   ├── 📂 api/
│   │   └── fixed-categories.js      # API unifiée Supabase
│   ├── 📂 components/
│   │   ├── AuthModal.jsx           # Authentification
│   │   ├── BudgetManager.jsx       # Gestion budgets
│   │   ├── CategorySelector.jsx    # Sélecteur catégories
│   │   ├── ModernSettingsModal.jsx # Paramètres
│   │   ├── TransactionForm.jsx     # Formulaire transactions
│   │   └── TransactionsList.jsx    # Liste transactions
│   ├── 📂 lib/
│   │   ├── supabase.js             # Client Supabase
│   │   └── supabase-auth.js        # Module authentification
│   ├── App.jsx                     # Application principale
│   ├── main.jsx                    # Point d'entrée
│   └── index.css                   # Styles Tailwind
├── 📂 scripts/
│   ├── apply-new-schema.js         # Application schéma BDD
│   ├── quick-db-check.js           # Vérification BDD
│   └── test-auth-system.js         # Tests authentification
├── 📂 docs/                        # Documentation
├── fix-schema-complete.sql         # Schéma SQL complet
├── package.json                    # Dépendances et scripts
└── README.md                       # Ce fichier
```

## 🛠️ Scripts Disponibles

### Développement
```bash
npm run dev              # Lancer en mode développement
npm run build            # Build de production
npm run preview          # Prévisualiser le build
npm run lint             # Analyse du code avec ESLint
```

### Base de données
```bash
npm run apply-schema     # Appliquer le schéma complet
npm run check-db         # Vérifier l'état de la BDD
npm run test:auth        # Tester l'authentification
```

### Qualité
```bash
npm run audit            # Audit complet (lint + db)
```

## 📊 Architecture des Données

### Types de Transactions (7)
| Type | Description | Icône | Couleur |
|------|-------------|-------|---------|
| `revenu` | Revenus et entrées d'argent | 💰 | green |
| `depense_fixe` | Dépenses fixes récurrentes | 🏠 | blue |
| `depense_variable` | Dépenses variables | 🛒 | orange |
| `epargne` | Épargne et réserves | 🏦 | purple |
| `investissement` | Investissements et placements | 📈 | indigo |
| `dette` | Dettes et emprunts | 💳 | red |
| `remboursement` | Remboursements de dettes | 💸 | pink |

### Catégories par Type (46 total)
- **💰 Revenus (10)** : Salaire, Bonus, Activités secondaires, Revenus locatifs, etc.
- **🏠 Dépenses Fixes (8)** : Logement, Assurances, Abonnements, Transports, etc.
- **🛒 Dépenses Variables (11)** : Alimentation, Restaurants, Loisirs, Vacances, etc.
- **🏦 Épargne (5)** : Fonds d'urgence, Compte épargne, 3ème pilier, etc.
- **📈 Investissement (4)** : Bourse, Crypto-monnaies, Immobilier, etc.
- **💳 Dettes (6)** : Carte de crédit, Prêts, Dettes médicales, etc.
- **💸 Remboursements (2)** : Paiements de dettes, Remboursements internes

## 🔧 Technologies Utilisées

### Frontend
- **React 18.2.0** - Framework UI moderne
- **Vite 4.4.5** - Build tool et dev server ultra-rapide
- **Tailwind CSS 3.3.3** - Framework CSS utility-first
- **Lucide React** - Icônes modernes et consistantes
- **Recharts 2.8.0** - Graphiques interactifs

### Backend & Base de données
- **Supabase 2.55.0** - Backend-as-a-Service
- **PostgreSQL** - Base de données relationnelle
- **Row Level Security (RLS)** - Sécurité au niveau ligne

### Outils de développement
- **ESLint** - Analyse statique du code
- **PostCSS + Autoprefixer** - Optimisation CSS
- **dotenv** - Gestion des variables d'environnement

## 🎯 Optimisations Récentes

### Performance (Août 2025)
- ✅ **Bundle optimisé** : Suppression de 25+ imports inutilisés
- ✅ **Mémoire** : Élimination de 10+ variables non utilisées  
- ✅ **React Hooks** : Optimisation avec useCallback
- ✅ **ESLint** : Réduction de 54 à 3 issues (94% d'amélioration)
- ✅ **Compatibilité** : Normalisation des fins de ligne

## 🚦 Statut du Projet

- **Version actuelle** : 1.0.0
- **Statut** : ✅ **Prêt pour la production**
- **Dernière mise à jour** : 20 août 2025
- **Tests** : ✅ Fonctionnel sur localhost:5173
- **Base de données** : ✅ 7 types + 46 catégories configurées
- **Authentification** : ✅ Système Supabase opérationnel

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Utilisation

### Première utilisation
1. **Se connecter** : Créer un compte ou se connecter
2. **Ajouter des transactions** : Utiliser le formulaire d'ajout
3. **Créer des budgets** : Aller dans la section budgets
4. **Visualiser** : Explorer les différents graphiques
5. **Configurer** : Personnaliser dans les paramètres

### Fonctionnalités avancées
- **Recherche** : Utiliser la barre de recherche pour filtrer
- **Période** : Changer la période d'affichage (mois, trimestre, année, personnalisé)
- **Favoris** : Marquer vos graphiques préférés
- **Exportation** : (Prochainement) Export CSV/PDF

## 🐛 Résolution de problèmes

### Base de données vide
```bash
npm run check-db        # Diagnostiquer
npm run apply-schema    # Appliquer le schéma
```

### Erreurs d'authentification
- Vérifier les clés Supabase dans `.env`
- Contrôler les politiques RLS dans le dashboard Supabase

### Interface qui ne se charge pas
- Vérifier la console navigateur pour les erreurs
- S'assurer que toutes les dépendances sont installées

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 👥 Auteurs

- **Assistant IA** - Développement et optimisation
- **Équipe de développement** - Architecture et conception

## 🔗 Liens Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation React](https://react.dev)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Recharts](https://recharts.org/en-US/)

---

**Akuma Budget** - Votre partenaire pour une gestion financière moderne et efficace ! 💰✨