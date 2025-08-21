# 🗄️ Base de Données Supabase - Application de Budget Personnel

## 📋 Vue d'ensemble

Cette base de données est conçue pour une application de gestion de budget personnel complète, avec support pour :
- ✅ Authentification utilisateur (Supabase Auth)
- ✅ Catégories prédéfinies et personnalisées
- ✅ Transactions financières détaillées
- ✅ Gestion des budgets
- ✅ Sécurité Row Level Security (RLS)
- ✅ Fonctions utilitaires et vues

## 🏗️ Structure de la Base de Données

### 1. **Table `user_profiles`**
Extension du profil utilisateur Supabase Auth
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users.id)
- email (TEXT)
- first_name, last_name (TEXT)
- currency (TEXT, défaut: 'CHF')
- language (TEXT, défaut: 'fr')
- timezone (TEXT, défaut: 'Europe/Zurich')
```

### 2. **Table `categories`** (Prédéfinies)
Catégories standard disponibles pour tous les utilisateurs
```sql
- id (UUID, PK)
- type (ENUM: revenu, depense_fixe, depense_variable, epargne, investissement, dette, remboursement)
- nom (TEXT)
- description (TEXT)
- icon (TEXT, défaut: '📦')
- is_default (BOOLEAN, défaut: true)
```

### 3. **Table `custom_categories`** (Personnalisées)
Catégories créées par les utilisateurs
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users.id)
- type (ENUM: même que categories)
- nom (TEXT)
- description (TEXT)
- icon (TEXT)
```

### 4. **Table `transactions`**
Transactions financières des utilisateurs
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users.id)
- type (ENUM: même que categories)
- categorie_id (UUID, FK → categories.id OU custom_categories.id)
- montant (NUMERIC(10,2), non nul)
- date (DATE)
- description (TEXT)
- moyen_paiement (TEXT, défaut: 'virement')
```

### 5. **Table `budgets`**
Budgets définis par les utilisateurs
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users.id)
- categorie_id (UUID, FK → categories.id OU custom_categories.id)
- montant (NUMERIC(10,2), > 0)
- type (ENUM: monthly, weekly, yearly)
```

## 🎯 Types de Catégories Prédéfinies

### **Revenus** 💰
- Salaire, Bonus/primes, Activités secondaires
- Revenus locatifs, Dividendes/intérêts
- Plus-values/crypto, Allocations familiales
- Indemnités, Remboursements, Cadeaux

### **Dépenses Fixes** 🏠
- Logement, Assurances, Abonnements
- Transports fixes, Crédits, Frais bancaires
- Téléphone, Impôts

### **Dépenses Variables** 🛒
- Alimentation, Restaurants, Transports variables
- Santé hors assurance, Loisirs, Vacances
- Shopping, Animaux, Entretien logement
- Achats imprévus, Événements spéciaux

### **Épargne** 💎
- Fonds d'urgence, Compte épargne
- 3ème pilier, Projets long terme

### **Investissement** 📈
- Bourse, Crypto-monnaies
- Immobilier/crowdfunding, Plan de prévoyance

### **Dettes** 💳
- Carte de crédit, Prêt étudiant
- Prêt personnel, Prêt auto
- Dette médicale, Autres dettes

### **Remboursements** ↩️
- Remboursements internes

## 🔒 Sécurité (Row Level Security)

Toutes les tables utilisateur sont protégées par RLS :
- ✅ Chaque utilisateur ne voit que ses propres données
- ✅ Politiques SELECT, INSERT, UPDATE, DELETE
- ✅ Utilisation de `auth.uid()` pour l'isolation

## 🛠️ Fonctions Utilitaires

### **`get_user_categories(user_uuid UUID)`**
Retourne toutes les catégories disponibles pour un utilisateur (prédéfinies + personnalisées)

### **`get_user_balance(user_uuid UUID, start_date DATE, end_date DATE)`**
Calcule le solde d'un utilisateur sur une période donnée

## 📊 Vues Utiles

### **`transactions_with_categories`**
Transactions avec détails des catégories (nom, icône, type)

### **`budgets_with_categories`**
Budgets avec détails des catégories

## 🚀 Installation

### 1. **Créer un projet Supabase**
- Aller sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Noter l'URL et la clé anonyme

### 2. **Exécuter le script SQL**
- Ouvrir l'éditeur SQL dans Supabase
- Copier-coller le contenu de `supabase-complete-schema.sql`
- Exécuter le script

### 3. **Configurer l'application**
```bash
# Créer le fichier .env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

## 📱 Utilisation dans l'Application

### **Récupérer les catégories d'un utilisateur**
```javascript
const { data: categories } = await supabase
  .rpc('get_user_categories', { user_uuid: user.id })
```

### **Créer une transaction**
```javascript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: user.id,
    type: 'depense_variable',
    categorie_id: categoryId,
    montant: 50.00,
    date: '2025-01-15',
    description: 'Courses alimentaires'
  })
```

### **Calculer le solde**
```javascript
const { data: balance } = await supabase
  .rpc('get_user_balance', { 
    user_uuid: user.id,
    start_date: '2025-01-01',
    end_date: '2025-01-31'
  })
```

## 🔄 Évolution de la Base

### **Ajouter de nouvelles catégories prédéfinies**
```sql
INSERT INTO categories (type, nom, description, icon) VALUES
('depense_variable', 'Nouvelle catégorie', 'Description', '🎯');
```

### **Ajouter de nouveaux types**
```sql
-- Modifier l'enum
ALTER TYPE category_type ADD VALUE 'nouveau_type';
```

## 📈 Performances

### **Index créés automatiquement**
- Index sur `user_id` pour toutes les tables utilisateur
- Index sur `date` pour les transactions
- Index composites pour les requêtes fréquentes

### **Optimisations recommandées**
- Utiliser les vues pour les requêtes complexes
- Limiter les requêtes avec `LIMIT` et `OFFSET`
- Utiliser les fonctions RPC pour les calculs

## 🛡️ Bonnes Pratiques

### **Sécurité**
- ✅ Toujours utiliser RLS
- ✅ Valider les données côté serveur
- ✅ Utiliser des transactions pour les opérations multiples

### **Performance**
- ✅ Utiliser les index appropriés
- ✅ Paginer les résultats
- ✅ Mettre en cache les données statiques

### **Maintenance**
- ✅ Sauvegarder régulièrement
- ✅ Monitorer les performances
- ✅ Documenter les changements

## 🔧 Dépannage

### **Erreur RLS**
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'transactions';
```

### **Erreur de contrainte**
```sql
-- Vérifier les contraintes
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'transactions';
```

### **Erreur de type**
```sql
-- Vérifier les enums
SELECT * FROM pg_enum WHERE enumtypid = 'category_type'::regtype;
```

---

## 📞 Support

Pour toute question ou problème :
1. Vérifier la documentation Supabase
2. Consulter les logs dans le dashboard Supabase
3. Tester les requêtes dans l'éditeur SQL

**Base de données prête pour la production ! 🎉**
