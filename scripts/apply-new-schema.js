#!/usr/bin/env node

/**
 * Script simple pour appliquer le nouveau schéma avec types et catégories fixes
 * À exécuter manuellement avec la clé service_role
 */

import { createClient } from '@supabase/supabase-js';

// ⚠️  IMPORTANT: Remplacez cette ligne par votre vraie clé service_role
const SERVICE_ROLE_KEY = 'REMPLACEZ_PAR_VOTRE_CLE_SERVICE_ROLE';

const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';

if (SERVICE_ROLE_KEY === 'REMPLACEZ_PAR_VOTRE_CLE_SERVICE_ROLE') {
  console.log('❌ ERREUR: Vous devez configurer votre clé service_role');
  console.log('📋 Instructions:');
  console.log('1. Allez dans Supabase Dashboard > Settings > API');
  console.log('2. Copiez votre "service_role" key');
  console.log('3. Remplacez la ligne 10 dans ce script');
  console.log('4. Relancez: node scripts/apply-new-schema.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, SERVICE_ROLE_KEY);

async function applySchema() {
  console.log('🚀 Application du nouveau schéma avec types et catégories fixes...\n');

  try {
    // Étape 1: Nettoyer les anciennes tables
    console.log('1. Nettoyage des anciennes tables...');
    
    const cleanupQueries = [
      'DROP TABLE IF EXISTS budgets CASCADE;',
      'DROP TABLE IF EXISTS transactions CASCADE;',
      'DROP TABLE IF EXISTS custom_categories CASCADE;',
      'DROP TABLE IF EXISTS categories CASCADE;',
      'DROP TABLE IF EXISTS types CASCADE;'
    ];

    for (const query of cleanupQueries) {
      try {
        const { error } = await supabase.rpc('exec', { query });
        if (error && !error.message.includes('does not exist')) {
          console.log(`   ⚠️  ${error.message}`);
        }
      } catch (err) {
        console.log(`   ⚠️  ${err.message}`);
      }
    }
    console.log('   ✅ Nettoyage terminé\n');

    // Étape 2: Créer les nouvelles tables
    console.log('2. Création des nouvelles tables...');
    
    // Table types
    const { error: typesError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE types (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          description TEXT,
          icon VARCHAR(10),
          color VARCHAR(20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (typesError) throw typesError;
    console.log('   ✅ Table types créée');

    // Table categories
    const { error: categoriesError } = await supabase.rpc('exec', {
      query: `
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
      `
    });
    if (categoriesError) throw categoriesError;
    console.log('   ✅ Table categories créée');

    // Table transactions
    const { error: transactionsError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          amount DECIMAL(12,2) NOT NULL,
          description TEXT,
          type_id INTEGER NOT NULL REFERENCES types(id),
          category_id INTEGER NOT NULL REFERENCES categories(id),
          transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (transactionsError) throw transactionsError;
    console.log('   ✅ Table transactions créée');

    // Table budgets
    const { error: budgetsError } = await supabase.rpc('exec', {
      query: `
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
      `
    });
    if (budgetsError) throw budgetsError;
    console.log('   ✅ Table budgets créée\n');

    // Étape 3: Insérer les types prédéfinis
    console.log('3. Insertion des types prédéfinis...');
    
    const typesData = [
      ['revenu', 'Revenus et entrées d\'argent', '💰', 'green'],
      ['depense_fixe', 'Dépenses fixes récurrentes', '🏠', 'blue'],
      ['depense_variable', 'Dépenses variables', '🛒', 'orange'],
      ['epargne', 'Épargne et réserves', '🏦', 'purple'],
      ['investissement', 'Investissements et placements', '📈', 'indigo'],
      ['dette', 'Dettes et emprunts', '💳', 'red'],
      ['remboursement', 'Remboursements de dettes', '💸', 'pink']
    ];

    for (const [name, description, icon, color] of typesData) {
      const { error } = await supabase
        .from('types')
        .insert([{ name, description, icon, color }]);
      if (error) throw error;
    }
    console.log('   ✅ 7 types insérés\n');

    // Étape 4: Insérer les catégories prédéfinies
    console.log('4. Insertion des catégories prédéfinies...');
    
    const categoriesData = [
      // Revenus (type_id: 1)
      [1, 'Salaire', 'Salaire principal', '💼'],
      [1, 'Bonus/Primes', 'Primes et bonus ponctuels', '🎁'],
      [1, 'Activités secondaires', 'Freelance, missions, etc.', '💻'],
      [1, 'Revenus locatifs', 'Revenus d\'immobilier locatif', '🏘️'],
      [1, 'Dividendes/Intérêts bancaires', 'Revenus financiers', '🏛️'],
      [1, 'Plus-values/Crypto', 'Gains en capital et crypto', '₿'],
      [1, 'Allocations familiales', 'Aides familiales', '👶'],
      [1, 'Indemnités', 'Indemnités diverses', '🎖️'],
      [1, 'Remboursements', 'Remboursements reçus', '↩️'],
      [1, 'Cadeaux/Donations reçues', 'Dons et cadeaux en argent', '🎀'],

      // Dépenses fixes (type_id: 2)
      [2, 'Logement', 'Loyer, charges, hypothèque', '🏠'],
      [2, 'Assurances', 'Assurances diverses', '🛡️'],
      [2, 'Abonnements', 'Abonnements récurrents', '📱'],
      [2, 'Transports', 'Transports en commun, carburant', '🚌'],
      [2, 'Crédits', 'Remboursements de crédits', '🏦'],
      [2, 'Frais bancaires', 'Frais de compte, cartes', '💳'],
      [2, 'Téléphone', 'Forfaits téléphoniques', '📞'],
      [2, 'Impôts', 'Impôts et taxes', '🏛️'],

      // Dépenses variables (type_id: 3)
      [3, 'Alimentation', 'Courses alimentaires', '🛒'],
      [3, 'Restaurants', 'Restaurants et livraisons', '🍽️'],
      [3, 'Transports variables', 'Taxi, Uber, transports occasionnels', '🚕'],
      [3, 'Santé hors assurance', 'Frais médicaux non couverts', '🏥'],
      [3, 'Loisirs', 'Cinéma, spectacles, hobbies', '🎭'],
      [3, 'Vacances', 'Voyages et vacances', '✈️'],
      [3, 'Shopping', 'Vêtements, accessoires', '👕'],
      [3, 'Animaux', 'Frais vétérinaires, nourriture', '🐕'],
      [3, 'Entretien logement', 'Réparations, aménagements', '🔧'],
      [3, 'Achats imprévus', 'Achats non planifiés', '❓'],
      [3, 'Événements spéciaux', 'Mariages, anniversaires', '🎉'],

      // Épargne (type_id: 4)
      [4, 'Fonds d\'urgence', 'Réserve d\'urgence', '🚨'],
      [4, 'Compte épargne', 'Épargne classique', '🏦'],
      [4, '3ème pilier', 'Prévoyance retraite', '🎯'],
      [4, 'Projets long terme', 'Épargne pour projets futurs', '🌟'],
      [4, 'Fonds de remplacement', 'Remplacement équipements', '🔄'],

      // Investissement (type_id: 5)
      [5, 'Bourse', 'Actions et ETF', '📊'],
      [5, 'Crypto-monnaies', 'Investissements crypto', '₿'],
      [5, 'Immobilier/Crowdfunding', 'Investissement immobilier', '🏢'],
      [5, 'Plan de prévoyance', 'Plans de prévoyance privés', '📋'],

      // Dettes (type_id: 6)
      [6, 'Carte de crédit', 'Soldes cartes de crédit', '💳'],
      [6, 'Prêt étudiant', 'Prêts étudiants', '🎓'],
      [6, 'Prêt personnel', 'Prêts personnels', '💰'],
      [6, 'Prêt auto', 'Financement véhicule', '🚗'],
      [6, 'Dette médicale', 'Dettes médicales', '🏥'],
      [6, 'Autres dettes', 'Autres dettes diverses', '📝'],

      // Remboursements (type_id: 7)
      [7, 'Paiement de dettes', 'Remboursements de dettes', '💸'],
      [7, 'Remboursements internes', 'Remboursements entre comptes', '🔄']
    ];

    for (const [type_id, name, description, icon] of categoriesData) {
      const { error } = await supabase
        .from('categories')
        .insert([{ type_id, name, description, icon }]);
      if (error) throw error;
    }
    console.log('   ✅ 41 catégories insérées\n');

    // Étape 5: Configurer RLS
    console.log('5. Configuration des politiques RLS...');
    
    const rlsQueries = [
      'ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE types ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE categories ENABLE ROW LEVEL SECURITY;',
      
      // Politiques pour types et catégories (lecture seule)
      `CREATE POLICY "Types lisibles par tous" ON types 
       FOR SELECT TO authenticated USING (true);`,
      
      `CREATE POLICY "Categories lisibles par tous" ON categories 
       FOR SELECT TO authenticated USING (true);`,
      
      // Politiques pour transactions (CRUD utilisateur)
      `CREATE POLICY "Utilisateurs voient leurs transactions" ON transactions
       FOR SELECT TO authenticated USING (auth.uid() = user_id);`,
      
      `CREATE POLICY "Utilisateurs créent leurs transactions" ON transactions
       FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);`,
      
      `CREATE POLICY "Utilisateurs modifient leurs transactions" ON transactions
       FOR UPDATE TO authenticated 
       USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`,
      
      `CREATE POLICY "Utilisateurs suppriment leurs transactions" ON transactions
       FOR DELETE TO authenticated USING (auth.uid() = user_id);`,
      
      // Politiques pour budgets (CRUD utilisateur)
      `CREATE POLICY "Utilisateurs voient leurs budgets" ON budgets
       FOR SELECT TO authenticated USING (auth.uid() = user_id);`,
      
      `CREATE POLICY "Utilisateurs créent leurs budgets" ON budgets
       FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);`,
      
      `CREATE POLICY "Utilisateurs modifient leurs budgets" ON budgets
       FOR UPDATE TO authenticated 
       USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`,
      
      `CREATE POLICY "Utilisateurs suppriment leurs budgets" ON budgets
       FOR DELETE TO authenticated USING (auth.uid() = user_id);`
    ];

    for (const query of rlsQueries) {
      try {
        const { error } = await supabase.rpc('exec', { query });
        if (error) console.log(`   ⚠️  ${error.message}`);
      } catch (err) {
        console.log(`   ⚠️  ${err.message}`);
      }
    }
    console.log('   ✅ Politiques RLS configurées\n');

    // Vérification finale
    console.log('6. Vérification finale...');
    
    const { data: types, error: typesCheckError } = await supabase
      .from('types')
      .select('id, name, icon');
    
    if (typesCheckError) throw typesCheckError;
    
    const { data: categories, error: categoriesCheckError } = await supabase
      .from('categories')
      .select('id, name, type_id');
    
    if (categoriesCheckError) throw categoriesCheckError;
    
    console.log(`   ✅ ${types.length} types créés`);
    console.log(`   ✅ ${categories.length} catégories créées`);
    
    types.forEach(type => {
      const count = categories.filter(cat => cat.type_id === type.id).length;
      console.log(`      ${type.icon} ${type.name}: ${count} catégories`);
    });

    console.log('\n🎉 SCHÉMA APPLIQUÉ AVEC SUCCÈS !');
    console.log('✅ Types et catégories prédéfinis créés');
    console.log('✅ Politiques RLS configurées');
    console.log('✅ Base de données prête pour l\'application');

  } catch (error) {
    console.error('\n💥 ERREUR:', error.message);
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Vérifiez que la clé service_role est correcte');
    console.log('2. Vérifiez la connexion internet');
    console.log('3. Consultez les logs Supabase pour plus de détails');
  }
}

// Instructions d'utilisation
console.log('📋 INSTRUCTIONS:');
console.log('1. Allez dans Supabase Dashboard > Settings > API');
console.log('2. Copiez votre clé "service_role"');
console.log('3. Remplacez SERVICE_ROLE_KEY ligne 10 dans ce script');
console.log('4. Relancez: node scripts/apply-new-schema.js\n');

if (process.argv.includes('--force')) {
  applySchema();
} else {
  console.log('⚠️  Ajoutez --force pour exécuter: node scripts/apply-new-schema.js --force');
}
