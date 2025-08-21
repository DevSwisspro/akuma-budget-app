-- =====================================================
-- SCRIPT COMPLET DE RESTRUCTURATION SCHEMA SUPABASE
-- Base de données Akuma Budget - Types et Catégories Fixes
-- Date: 2025-08-19
-- =====================================================

-- 1. SUPPRESSION DES ANCIENNES TABLES SI EXISTANTES
-- =====================================================

DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE; 
DROP TABLE IF EXISTS custom_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS types CASCADE;

-- 2. CRÉATION DES NOUVELLES TABLES
-- =====================================================

-- Table des types de transaction (prédéfinis)
CREATE TABLE types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories (prédéfinies, liées aux types)
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

-- Table des transactions (liée aux utilisateurs)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    type_id INTEGER NOT NULL REFERENCES types(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte de cohérence : la catégorie doit correspondre au type
    CONSTRAINT valid_category_type CHECK (
        (type_id, category_id) IN (
            SELECT t.id, c.id 
            FROM types t 
            JOIN categories c ON c.type_id = t.id
        )
    )
);

-- Table des budgets (optionnelle, liée aux utilisateurs et catégories)
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id, period)
);

-- 3. INSERTION DES DONNÉES PRÉDÉFINIES (SEED)
-- =====================================================

-- Types de transaction
INSERT INTO types (name, description, icon, color) VALUES
('revenu', 'Revenus et entrées d''argent', '💰', 'green'),
('depense_fixe', 'Dépenses fixes récurrentes', '🏠', 'blue'),
('depense_variable', 'Dépenses variables', '🛒', 'orange'),
('epargne', 'Épargne et réserves', '🏦', 'purple'),
('investissement', 'Investissements et placements', '📈', 'indigo'),
('dette', 'Dettes et emprunts', '💳', 'red'),
('remboursement', 'Remboursements de dettes', '💸', 'pink');

-- Catégories Revenu (type_id = 1)
INSERT INTO categories (name, type_id, description, icon) VALUES
('Salaire', 1, 'Salaire principal', '💼'),
('Bonus/Primes', 1, 'Primes et bonus ponctuels', '🎁'),
('Activités secondaires', 1, 'Freelance, missions, etc.', '💻'),
('Revenus locatifs', 1, 'Revenus d''immobilier locatif', '🏘️'),
('Dividendes/Intérêts bancaires', 1, 'Revenus financiers', '🏛️'),
('Plus-values/Crypto', 1, 'Gains en capital et crypto', '₿'),
('Allocations familiales', 1, 'Aides familiales', '👶'),
('Indemnités', 1, 'Indemnités diverses', '🎖️'),
('Remboursements', 1, 'Remboursements reçus', '↩️'),
('Cadeaux/Donations reçues', 1, 'Dons et cadeaux en argent', '🎀');

-- Catégories Dépenses Fixes (type_id = 2)  
INSERT INTO categories (name, type_id, description, icon) VALUES
('Logement', 2, 'Loyer, charges, hypothèque', '🏠'),
('Assurances', 2, 'Assurances diverses', '🛡️'),
('Abonnements', 2, 'Abonnements récurrents', '📱'),
('Transports', 2, 'Transports en commun, carburant', '🚌'),
('Crédits', 2, 'Remboursements de crédits', '🏦'),
('Frais bancaires', 2, 'Frais de compte, cartes', '💳'),
('Téléphone', 2, 'Forfaits téléphoniques', '📞'),
('Impôts', 2, 'Impôts et taxes', '🏛️');

-- Catégories Dépenses Variables (type_id = 3)
INSERT INTO categories (name, type_id, description, icon) VALUES
('Alimentation', 3, 'Courses alimentaires', '🛒'),
('Restaurants', 3, 'Restaurants et livraisons', '🍽️'),
('Transports', 3, 'Taxi, Uber, transports occasionnels', '🚕'),
('Santé hors assurance', 3, 'Frais médicaux non couverts', '🏥'),
('Loisirs', 3, 'Cinéma, spectacles, hobbies', '🎭'),
('Vacances', 3, 'Voyages et vacances', '✈️'),
('Shopping', 3, 'Vêtements, accessoires', '👕'),
('Animaux', 3, 'Frais vétérinaires, nourriture', '🐕'),
('Entretien logement', 3, 'Réparations, aménagements', '🔧'),
('Achats imprévus', 3, 'Achats non planifiés', '❓'),
('Événements spéciaux', 3, 'Mariages, anniversaires', '🎉');

-- Catégories Épargne (type_id = 4)
INSERT INTO categories (name, type_id, description, icon) VALUES
('Fonds d''urgence', 4, 'Réserve d''urgence', '🚨'),
('Compte épargne', 4, 'Épargne classique', '🏦'),
('3ème pilier', 4, 'Prévoyance retraite', '🎯'),
('Projets long terme', 4, 'Épargne pour projets futurs', '🌟'),
('Fonds de remplacement', 4, 'Remplacement équipements', '🔄');

-- Catégories Investissement (type_id = 5)
INSERT INTO categories (name, type_id, description, icon) VALUES
('Bourse', 5, 'Actions et ETF', '📊'),
('Crypto-monnaies', 5, 'Investissements crypto', '₿'),
('Immobilier/Crowdfunding', 5, 'Investissement immobilier', '🏢'),
('Plan de prévoyance', 5, 'Plans de prévoyance privés', '📋');

-- Catégories Dettes (type_id = 6)
INSERT INTO categories (name, type_id, description, icon) VALUES
('Carte de crédit', 6, 'Soldes cartes de crédit', '💳'),
('Prêt étudiant', 6, 'Prêts étudiants', '🎓'),
('Prêt personnel', 6, 'Prêts personnels', '💰'),
('Prêt auto', 6, 'Financement véhicule', '🚗'),
('Dette médicale', 6, 'Dettes médicales', '🏥'),
('Autres dettes', 6, 'Autres dettes diverses', '📝');

-- Catégories Remboursements (type_id = 7)
INSERT INTO categories (name, type_id, description, icon) VALUES
('Paiement de dettes', 7, 'Remboursements de dettes', '💸'),
('Remboursements internes', 7, 'Remboursements entre comptes', '🔄');

-- 4. CONFIGURATION DES POLITIQUES RLS
-- =====================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Les types et catégories sont publiques (lecture seule pour tous)
ALTER TABLE types ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Politiques pour les types (lecture seule pour tous les utilisateurs authentifiés)
CREATE POLICY "Types lisibles par tous les utilisateurs authentifiés" ON types
    FOR SELECT
    TO authenticated
    USING (true);

-- Politiques pour les catégories (lecture seule pour tous les utilisateurs authentifiés)  
CREATE POLICY "Categories lisibles par tous les utilisateurs authentifiés" ON categories
    FOR SELECT  
    TO authenticated
    USING (true);

-- Politiques pour les transactions (CRUD pour propriétaire seulement)
CREATE POLICY "Utilisateurs voient leurs propres transactions" ON transactions
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leurs propres transactions" ON transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs propres transactions" ON transactions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs propres transactions" ON transactions
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Politiques pour les budgets (CRUD pour propriétaire seulement)
CREATE POLICY "Utilisateurs voient leurs propres budgets" ON budgets
    FOR SELECT
    TO authenticated  
    USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leurs propres budgets" ON budgets
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs propres budgets" ON budgets
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs propres budgets" ON budgets
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. CRÉATION DES INDEX POUR PERFORMANCES
-- =====================================================

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type_id ON transactions(type_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_categories_type_id ON categories(type_id);

-- 6. TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les tables avec updated_at
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at 
    BEFORE UPDATE ON budgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. VUES UTILES POUR L'APPLICATION
-- =====================================================

-- Vue complète des transactions avec noms de types et catégories
CREATE OR REPLACE VIEW transactions_view AS
SELECT 
    t.id,
    t.user_id,
    t.amount,
    t.description,
    t.transaction_date,
    t.created_at,
    t.updated_at,
    typ.id as type_id,
    typ.name as type_name,
    typ.icon as type_icon,
    typ.color as type_color,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color
FROM transactions t
JOIN types typ ON t.type_id = typ.id
JOIN categories c ON t.category_id = c.id;

-- Vue des budgets avec noms de catégories
CREATE OR REPLACE VIEW budgets_view AS
SELECT 
    b.id,
    b.user_id,
    b.amount,
    b.period,
    b.is_active,
    b.created_at,
    b.updated_at,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    t.id as type_id,
    t.name as type_name,
    t.icon as type_icon,
    t.color as type_color
FROM budgets b
JOIN categories c ON b.category_id = c.id
JOIN types t ON c.type_id = t.id;

-- 8. FONCTIONS UTILES POUR L'APPLICATION
-- =====================================================

-- Fonction pour obtenir les catégories par type
CREATE OR REPLACE FUNCTION get_categories_by_type(type_name_param TEXT)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(100),
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.description, c.icon, c.color
    FROM categories c
    JOIN types t ON c.type_id = t.id
    WHERE t.name = type_name_param
    ORDER BY c.name;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour valider qu'une catégorie appartient à un type
CREATE OR REPLACE FUNCTION validate_category_type(category_id_param INTEGER, type_id_param INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM categories 
        WHERE id = category_id_param 
        AND type_id = type_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIN DU SCRIPT - SCHEMA COMPLET PRÊT
-- =====================================================

-- Vérification finale
SELECT 'Schema setup completed successfully' as status;
SELECT COUNT(*) as total_types FROM types;
SELECT COUNT(*) as total_categories FROM categories;
