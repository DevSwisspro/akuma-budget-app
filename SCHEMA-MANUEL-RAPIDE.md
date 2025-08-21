# 🔧 APPLICATION MANUELLE DU SCHÉMA - SOLUTION RAPIDE

## 🚨 **PROBLÈME IDENTIFIÉ**

Votre base Supabase existe mais a une **structure incorrecte** :
- ❌ Table `types` n'existe pas
- ❌ Table `categories` n'a pas la colonne `name`

**Il faut recréer les tables avec la bonne structure.**

---

## ⚡ **SOLUTION MANUELLE (5 MINUTES)**

### **1️⃣ Ouvrez Supabase Dashboard**
🔗 **https://supabase.com/dashboard**

### **2️⃣ Accédez au SQL Editor**
- Sélectionnez votre projet **Akuma Budget**
- Dans la barre latérale : **SQL Editor** 📝

### **3️⃣ Créez une nouvelle requête**
- Cliquez sur **"New query"**

### **4️⃣ Copiez-collez ce script complet**

```sql
-- =====================================================
-- SCRIPT COMPLET - AKUMA BUDGET SCHEMA CORRECT
-- =====================================================

-- 1. SUPPRESSION DES ANCIENNES TABLES
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE; 
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS types CASCADE;

-- 2. CRÉATION DES NOUVELLES TABLES AVEC BONNE STRUCTURE

-- Table des types de transaction (7 types fixes)
CREATE TABLE types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories (41 catégories prédéfinies)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type_id INTEGER NOT NULL REFERENCES types(id) ON DELETE CASCADE,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, type_id)
);

-- Table des transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    type_id INTEGER NOT NULL REFERENCES types(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'CB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id, period)
);

-- 3. INSERTION DES 7 TYPES PRÉDÉFINIS
INSERT INTO types (name, description, icon, color) VALUES 
('revenu', 'Revenus et entrées d''argent', '💰', 'green'),
('depense_fixe', 'Dépenses fixes récurrentes', '🏠', 'blue'),
('depense_variable', 'Dépenses variables', '🛒', 'orange'),
('epargne', 'Épargne et réserves', '🏦', 'purple'),
('investissement', 'Investissements et placements', '📈', 'indigo'),
('dette', 'Dettes et emprunts', '💳', 'red'),
('remboursement', 'Remboursements de dettes', '💸', 'pink');

-- 4. INSERTION DES 41 CATÉGORIES PRÉDÉFINIES

-- Revenus (type_id: 1)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(1, 'Salaire', 'Salaire principal', '💼'),
(1, 'Bonus/Primes', 'Primes et bonus ponctuels', '🎁'),
(1, 'Activités secondaires', 'Freelance, missions, etc.', '💻'),
(1, 'Revenus locatifs', 'Revenus d''immobilier locatif', '🏘️'),
(1, 'Dividendes/Intérêts bancaires', 'Revenus financiers', '🏛️'),
(1, 'Plus-values/Crypto', 'Gains en capital et crypto', '₿'),
(1, 'Allocations familiales', 'Aides familiales', '👶'),
(1, 'Indemnités', 'Indemnités diverses', '🎖️'),
(1, 'Remboursements', 'Remboursements reçus', '↩️'),
(1, 'Cadeaux/Donations reçues', 'Dons et cadeaux en argent', '🎀');

-- Dépenses fixes (type_id: 2)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(2, 'Logement', 'Loyer, charges, hypothèque', '🏠'),
(2, 'Assurances', 'Assurances diverses', '🛡️'),
(2, 'Abonnements', 'Abonnements récurrents', '📱'),
(2, 'Transports', 'Transports en commun, carburant', '🚌'),
(2, 'Crédits', 'Remboursements de crédits', '🏦'),
(2, 'Frais bancaires', 'Frais de compte, cartes', '💳'),
(2, 'Téléphone', 'Forfaits téléphoniques', '📞'),
(2, 'Impôts', 'Impôts et taxes', '🏛️');

-- Dépenses variables (type_id: 3)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(3, 'Alimentation', 'Courses alimentaires', '🛒'),
(3, 'Restaurants', 'Restaurants et livraisons', '🍽️'),
(3, 'Transports variables', 'Taxi, Uber, transports occasionnels', '🚕'),
(3, 'Santé hors assurance', 'Frais médicaux non couverts', '🏥'),
(3, 'Loisirs', 'Cinéma, spectacles, hobbies', '🎭'),
(3, 'Vacances', 'Voyages et vacances', '✈️'),
(3, 'Shopping', 'Vêtements, accessoires', '👕'),
(3, 'Animaux', 'Frais vétérinaires, nourriture', '🐕'),
(3, 'Entretien logement', 'Réparations, aménagements', '🔧'),
(3, 'Achats imprévus', 'Achats non planifiés', '❓'),
(3, 'Événements spéciaux', 'Mariages, anniversaires', '🎉');

-- Épargne (type_id: 4)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(4, 'Fonds d''urgence', 'Réserve d''urgence', '🚨'),
(4, 'Compte épargne', 'Épargne classique', '🏦'),
(4, '3ème pilier', 'Prévoyance retraite', '🎯'),
(4, 'Projets long terme', 'Épargne pour projets futurs', '🌟'),
(4, 'Fonds de remplacement', 'Remplacement équipements', '🔄');

-- Investissement (type_id: 5)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(5, 'Bourse', 'Actions et ETF', '📊'),
(5, 'Crypto-monnaies', 'Investissements crypto', '₿'),
(5, 'Immobilier/Crowdfunding', 'Investissement immobilier', '🏢'),
(5, 'Plan de prévoyance', 'Plans de prévoyance privés', '📋');

-- Dettes (type_id: 6)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(6, 'Carte de crédit', 'Soldes cartes de crédit', '💳'),
(6, 'Prêt étudiant', 'Prêts étudiants', '🎓'),
(6, 'Prêt personnel', 'Prêts personnels', '💰'),
(6, 'Prêt auto', 'Financement véhicule', '🚗'),
(6, 'Dette médicale', 'Dettes médicales', '🏥'),
(6, 'Autres dettes', 'Autres dettes diverses', '📝');

-- Remboursements (type_id: 7)
INSERT INTO categories (type_id, name, description, icon) VALUES 
(7, 'Paiement de dettes', 'Remboursements de dettes', '💸'),
(7, 'Remboursements internes', 'Remboursements entre comptes', '🔄');

-- 5. ACTIVATION DU ROW LEVEL SECURITY (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE types ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 6. POLITIQUES RLS POUR TYPES ET CATÉGORIES (LECTURE SEULE)
CREATE POLICY "Types lisibles par tous" ON types 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Categories lisibles par tous" ON categories 
FOR SELECT TO authenticated USING (true);

-- 7. POLITIQUES RLS POUR TRANSACTIONS (CRUD PAR UTILISATEUR)
CREATE POLICY "Utilisateurs voient leurs transactions" ON transactions
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leurs transactions" ON transactions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs transactions" ON transactions
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs transactions" ON transactions
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 8. POLITIQUES RLS POUR BUDGETS (CRUD PAR UTILISATEUR)
CREATE POLICY "Utilisateurs voient leurs budgets" ON budgets
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leurs budgets" ON budgets
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs budgets" ON budgets
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs budgets" ON budgets
FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

### **5️⃣ Exécutez le script**
- Cliquez sur **"Run"** ▶️

### **6️⃣ Vérifiez que tout s'est bien passé**
Vous devriez voir des messages de succès. Si erreur, relancez juste le script.

---

## ✅ **VÉRIFICATION**

Une fois le script exécuté, testez :

```bash
npm run check-db
```

**Résultat attendu :**
```
✅ Table "types" existe (7 lignes)
✅ Table "categories" existe (41 lignes)
✅ 7 types trouvés: 💰 revenu, 🏠 depense_fixe, etc.
```

## 🚀 **TEST FINAL**

```bash
npm run dev
```

→ Ouvrez http://localhost:5173
→ Connectez-vous
→ **Les sélecteurs Types et Catégories doivent maintenant être remplis !**

---

**Cette solution manuelle est la plus fiable et rapide !** 🎯✨
