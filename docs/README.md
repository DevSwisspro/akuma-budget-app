# Akuma Budget

Application de gestion de budget personnelle développée avec React et Vite.

## Fonctionnalités

- 📊 **Gestion des transactions** : Ajout, modification et suppression de transactions
- 📈 **Graphiques interactifs** : Camembert des dépenses et évolution temporelle
- 🔍 **Filtres avancés** : Par date, catégorie, type de transaction, moyen de paiement
- ⚙️ **Paramètres personnalisables** : Catégories et budgets configurables
- 💰 **Devise CHF** : Formatage automatique en francs suisses

## Technologies utilisées

- **React 18** - Framework frontend
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utilitaire
- **Recharts** - Bibliothèque de graphiques
- **Lucide React** - Icônes

## Installation

1. Cloner le projet
2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Lance le linter ESLint

## Structure du projet

```
src/
├── App.jsx          # Composant principal
├── main.jsx         # Point d'entrée
└── index.css        # Styles globaux
```

## Fonctionnalités principales

### Gestion des transactions
- Types : Revenus, Dépenses fixes, Dépenses variables
- Catégories personnalisables par type
- Moyens de paiement : Cash, CB, Twint, Virement, Autre
- Normalisation automatique des catégories

### Visualisation
- Camembert des dépenses par catégorie
- Graphique d'évolution temporelle (revenus, dépenses, solde)
- Résumé des totaux (revenus, dépenses, solde)

### Filtres
- Recherche textuelle
- Filtrage par année et mois
- Filtrage par catégorie et type
- Filtrage par moyen de paiement

### Paramètres
- Gestion des catégories par type de transaction
- Configuration des budgets mensuels par catégorie
