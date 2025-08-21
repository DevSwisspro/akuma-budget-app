# 🛠️ Guide d'Application du Nouveau Schéma Supabase

## 📋 Vue d'ensemble

Ce guide vous explique comment appliquer le nouveau schéma avec **types et catégories prédéfinis** sur votre base de données Supabase.

## 🎯 Objectifs du Nouveau Schéma

✅ **Types de transaction fixes** : 7 types prédéfinis (Revenu, Dépense fixe, Dépense variable, Épargne, Investissement, Dette, Remboursement)

✅ **Catégories prédéfinies** : 41 catégories organisées par type, impossibles à modifier par les utilisateurs

✅ **Contraintes de cohérence** : Chaque transaction doit avoir un type ET une catégorie valides

✅ **RLS complet** : Isolation parfaite des données par utilisateur

✅ **Seed automatique** : Toutes les catégories sont créées automatiquement

---

## 🔐 Étape 1 : Récupération de la Clé Service Role

### 1.1 Connexion à Supabase Dashboard
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet **Akuma Budget**

### 1.2 Récupération de la clé
1. Dans le menu de gauche, allez dans **Settings** > **API**
2. Scrollez jusqu'à la section **Project API keys**
3. Copiez la clé **`service_role`** (commence par `eyJ...`)

⚠️ **ATTENTION**: Cette clé donne un accès administrateur complet à votre base de données. Ne la partagez jamais !

### 1.3 Configuration du script
1. Ouvrez le fichier `scripts/apply-schema-direct.js`
2. Ligne 16, remplacez :
   ```javascript
   serviceRoleKey: 'VOTRE_CLE_SERVICE_ROLE_ICI'
   ```
   Par :
   ```javascript
   serviceRoleKey: 'eyJ_VOTRE_VRAIE_CLE_SERVICE_ROLE_...'
   ```

---

## 🚀 Étape 2 : Application du Schéma

### 2.1 Ajout du script au package.json
```bash
npm run apply-schema-direct
```

Si ce script n'existe pas, ajoutez-le dans `package.json` :
```json
{
  "scripts": {
    "apply-schema-direct": "node scripts/apply-schema-direct.js apply",
    "verify-schema-direct": "node scripts/apply-schema-direct.js verify"
  }
}
```

### 2.2 Exécution
```bash
# Appliquer le nouveau schéma complet
npm run apply-schema-direct

# Ou vérifier seulement l'état actuel
npm run verify-schema-direct
```

### 2.3 Résultat attendu
```
🚀 Application du nouveau schéma par étapes...

⚡ 1/15 - Suppression des anciennes tables...
   ✅ Succès

⚡ 2/15 - Création table types...
   ✅ Succès

⚡ 3/15 - Création table categories...
   ✅ Succès

[...]

🏁 RÉSULTATS FINAUX:
✅ Étapes réussies: 15
❌ Étapes échouées: 0

🎉 SCHÉMA APPLIQUÉ AVEC SUCCÈS !

🔍 Vérification du nouveau schéma...
📊 SELECT COUNT(*) as types_count FROM types;
   Résultat: [{"types_count": 7}]

📊 SELECT COUNT(*) as categories_count FROM categories;
   Résultat: [{"categories_count": 41}]
```

---

## 🗃️ Étape 3 : Structure du Nouveau Schéma

### 3.1 Table `types`
```sql
id | name              | icon | color
---|-------------------|------|--------
1  | revenu           | 💰   | green
2  | depense_fixe     | 🏠   | blue
3  | depense_variable | 🛒   | orange
4  | epargne          | 🏦   | purple
5  | investissement   | 📈   | indigo
6  | dette            | 💳   | red
7  | remboursement    | 💸   | pink
```

### 3.2 Table `categories` (exemples)
```sql
id | name                    | type_id | icon | description
---|------------------------|---------|------|------------------
1  | Salaire                | 1       | 💼   | Salaire principal
2  | Bonus/Primes           | 1       | 🎁   | Primes et bonus
3  | Logement               | 2       | 🏠   | Loyer, charges
4  | Alimentation           | 3       | 🛒   | Courses alimentaires
5  | Fonds d'urgence        | 4       | 🚨   | Réserve d'urgence
[...] (41 catégories au total)
```

### 3.3 Table `transactions` (nouvelle structure)
```sql
id          | UUID (PK)
user_id     | UUID (FK auth.users) 
amount      | DECIMAL(12,2)
description | TEXT
type_id     | INTEGER (FK types)
category_id | INTEGER (FK categories)
transaction_date | DATE
created_at  | TIMESTAMP
updated_at  | TIMESTAMP
```

### 3.4 Contraintes et RLS
- ✅ **Contrainte de cohérence** : `category_id` doit correspondre au `type_id`
- ✅ **RLS actif** sur toutes les tables sensibles
- ✅ **Politiques utilisateur** : chaque utilisateur voit uniquement ses données
- ✅ **Types/catégories publiques** : lisibles par tous les utilisateurs authentifiés

---

## 🔄 Étape 4 : Migration des Données Existantes (Optionnel)

Si vous avez des transactions existantes à migrer, nous devrons créer un script de migration spécifique.

**⚠️ IMPORTANT** : Le nouveau schéma supprime les anciennes tables. Sauvegardez vos données importantes avant l'application !

---

## 🧪 Étape 5 : Tests de Validation

### 5.1 Vérification manuelle dans Supabase
1. Allez dans **Table Editor**
2. Vérifiez que les tables `types`, `categories`, `transactions`, `budgets` existent
3. Vérifiez que `types` contient 7 lignes
4. Vérifiez que `categories` contient 41 lignes

### 5.2 Test dans l'application
```bash
npm run dev
```

1. **Connexion** : Connectez-vous à l'application
2. **Ajout transaction** : Le sélecteur doit montrer les nouveaux types et catégories
3. **Cohérence** : Vérifiez que les catégories changent selon le type sélectionné
4. **Sauvegarde** : Créez une transaction et vérifiez qu'elle s'enregistre correctement

---

## 🛠️ Résolution de Problèmes

### Erreur "serviceRoleKey non configurée"
➡️ **Solution** : Suivez l'étape 1.3 pour configurer la vraie clé

### Erreur "HTTP 401 Unauthorized"
➡️ **Solution** : Vérifiez que la clé service_role est correcte

### Erreur "Table already exists"
➡️ **Solution** : Normal si vous relancez le script. Les DROP TABLE gèrent cela.

### Erreur "Function exec does not exist"
➡️ **Solution** : Utilisez `apply-schema-direct.js` au lieu de `apply-fixed-schema.js`

---

## 📚 Fichiers Impliqués

- `fix-schema-complete.sql` - Script SQL complet
- `scripts/apply-schema-direct.js` - Script d'application avec clé manuelle
- `src/api/fixed-categories.js` - Nouvelle API React pour types/catégories fixes
- `src/components/CategorySelector.jsx` - Nouveau sélecteur de catégories

---

## ✅ Checklist de Validation

- [ ] Clé service_role récupérée et configurée
- [ ] Script `apply-schema-direct.js` exécuté avec succès
- [ ] 7 types créés dans la table `types`
- [ ] 41 catégories créées dans la table `categories`
- [ ] RLS activé sur toutes les tables
- [ ] Application React démarre sans erreur
- [ ] Sélecteurs de catégories fonctionnent
- [ ] Création de transaction fonctionne
- [ ] Données isolées par utilisateur

---

## 🎉 Résultat Final

Une fois terminé, vous aurez :

🔒 **Base de données sécurisée** avec types et catégories fixes
📊 **41 catégories prédéfinies** organisées en 7 types
🎯 **Interface utilisateur cohérente** avec sélecteurs intelligents
🛡️ **Isolation complète** des données par utilisateur
🚫 **Impossible de créer/supprimer** des catégories personnalisées

**Votre application sera prête pour la production !** 🚀
