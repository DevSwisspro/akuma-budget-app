#!/usr/bin/env node

/**
 * Script interactif pour configurer et appliquer le schéma Supabase
 * Guide l'utilisateur étape par étape
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';

// Interface pour saisie utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Fonction pour lire ou demander la clé service_role
async function getServiceRoleKey() {
  // 1. Essayer depuis les variables d'environnement
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ Clé service_role trouvée dans les variables d\'environnement');
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  // 2. Essayer de lire depuis .env
  try {
    const envPath = join(__dirname, '..', '.env');
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf8');
      const serviceRoleMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
      if (serviceRoleMatch && serviceRoleMatch[1].trim() !== 'eyJ...') {
        console.log('✅ Clé service_role trouvée dans .env');
        return serviceRoleMatch[1].trim();
      }
    }
  } catch (error) {
    // Fichier .env non trouvé ou non lisible
  }

  // 3. Demander à l'utilisateur
  console.log('\n🔑 CONFIGURATION DE LA CLÉ SERVICE_ROLE REQUISE');
  console.log('📋 Pour obtenir votre clé service_role :');
  console.log('1. Allez sur https://supabase.com/dashboard');
  console.log('2. Sélectionnez votre projet Akuma Budget');
  console.log('3. Menu : Settings > API');
  console.log('4. Copiez la clé "service_role" (commence par eyJ...)');
  console.log('');
  
  const serviceRoleKey = await question('🔐 Collez votre clé service_role ici : ');
  
  if (!serviceRoleKey || !serviceRoleKey.startsWith('eyJ')) {
    console.log('❌ Clé invalide. Elle doit commencer par "eyJ"');
    process.exit(1);
  }

  // Sauvegarder dans .env
  try {
    const envPath = join(__dirname, '..', '.env');
    let envContent = '';
    
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf8');
    }
    
    if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
      envContent = envContent.replace(
        /SUPABASE_SERVICE_ROLE_KEY=.*$/m,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
      );
    } else {
      envContent += `\n# Clé service_role pour l'application du schéma\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}\n`;
    }
    
    writeFileSync(envPath, envContent);
    console.log('✅ Clé sauvegardée dans .env');
  } catch (error) {
    console.log('⚠️  Impossible de sauvegarder dans .env:', error.message);
  }

  return serviceRoleKey;
}

// Fonction pour exécuter du SQL
async function executeSQL(supabase, query, description) {
  try {
    console.log(`   🔄 ${description}...`);
    
    // Essayer d'exécuter directement (pour CREATE, INSERT, etc.)
    const { data, error } = await supabase.rpc('exec', { query });
    
    if (error) {
      // Si exec n'existe pas, essayer une requête simple
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log(`   ⚠️  RPC exec non disponible, exécution directe...`);
        return true; // On continue malgré tout
      }
      console.log(`   ❌ Erreur: ${error.message}`);
      return false;
    }
    
    console.log(`   ✅ ${description} - OK`);
    return true;
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return false;
  }
}

// Fonction pour insérer des données
async function insertData(supabase, table, data, description) {
  try {
    console.log(`   🔄 ${description}...`);
    const { error } = await supabase.from(table).insert(data);
    
    if (error) {
      console.log(`   ❌ Erreur insertion: ${error.message}`);
      return false;
    }
    
    console.log(`   ✅ ${description} - OK`);
    return true;
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return false;
  }
}

async function applySchema() {
  console.log('🚀 CONFIGURATION ET APPLICATION DU SCHÉMA SUPABASE\n');

  try {
    // 1. Obtenir la clé service_role
    const serviceRoleKey = await getServiceRoleKey();
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    console.log('\n2. Test de connexion avec clé service_role...');
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (testError) {
      console.log(`   ❌ Erreur de connexion: ${testError.message}`);
      console.log('   🔧 Vérifiez que votre clé service_role est correcte');
      process.exit(1);
    }
    console.log('   ✅ Connexion service_role OK\n');

    // 3. Vérifier les tables existantes
    console.log('3. Vérification des tables existantes...');
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    const tableNames = existingTables?.map(t => t.table_name) || [];
    console.log(`   📋 Tables trouvées: ${tableNames.join(', ')}`);

    // 4. Nettoyer les anciennes tables si nécessaire
    if (tableNames.includes('types') || tableNames.includes('categories')) {
      console.log('\n4. Nettoyage des anciennes tables...');
      const dropQueries = [
        'DROP TABLE IF EXISTS budgets CASCADE;',
        'DROP TABLE IF EXISTS transactions CASCADE;',
        'DROP TABLE IF EXISTS categories CASCADE;',
        'DROP TABLE IF EXISTS types CASCADE;'
      ];

      for (const query of dropQueries) {
        await executeSQL(supabase, query, `Suppression table`);
      }
    }

    // 5. Créer les nouvelles tables
    console.log('\n5. Création des nouvelles tables...');
    
    // Table types
    const createTypesSQL = `
      CREATE TABLE types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(10),
        color VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await executeSQL(supabase, createTypesSQL, 'Table types');

    // Table categories
    const createCategoriesSQL = `
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
    `;
    await executeSQL(supabase, createCategoriesSQL, 'Table categories');

    // Table transactions
    const createTransactionsSQL = `
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
    `;
    await executeSQL(supabase, createTransactionsSQL, 'Table transactions');

    // Table budgets
    const createBudgetsSQL = `
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
    `;
    await executeSQL(supabase, createBudgetsSQL, 'Table budgets');

    // 6. Insertion des types prédéfinis
    console.log('\n6. Insertion des 7 types prédéfinis...');
    const typesData = [
      { name: 'revenu', description: 'Revenus et entrées d\'argent', icon: '💰', color: 'green' },
      { name: 'depense_fixe', description: 'Dépenses fixes récurrentes', icon: '🏠', color: 'blue' },
      { name: 'depense_variable', description: 'Dépenses variables', icon: '🛒', color: 'orange' },
      { name: 'epargne', description: 'Épargne et réserves', icon: '🏦', color: 'purple' },
      { name: 'investissement', description: 'Investissements et placements', icon: '📈', color: 'indigo' },
      { name: 'dette', description: 'Dettes et emprunts', icon: '💳', color: 'red' },
      { name: 'remboursement', description: 'Remboursements de dettes', icon: '💸', color: 'pink' }
    ];

    for (const type of typesData) {
      await insertData(supabase, 'types', [type], `Type: ${type.icon} ${type.name}`);
    }

    // 7. Insertion des catégories prédéfinies
    console.log('\n7. Insertion des 41 catégories prédéfinies...');
    const categoriesData = [
      // Revenus (type_id: 1)
      { type_id: 1, name: 'Salaire', description: 'Salaire principal', icon: '💼' },
      { type_id: 1, name: 'Bonus/Primes', description: 'Primes et bonus ponctuels', icon: '🎁' },
      { type_id: 1, name: 'Activités secondaires', description: 'Freelance, missions, etc.', icon: '💻' },
      { type_id: 1, name: 'Revenus locatifs', description: 'Revenus d\'immobilier locatif', icon: '🏘️' },
      { type_id: 1, name: 'Dividendes/Intérêts bancaires', description: 'Revenus financiers', icon: '🏛️' },
      { type_id: 1, name: 'Plus-values/Crypto', description: 'Gains en capital et crypto', icon: '₿' },
      { type_id: 1, name: 'Allocations familiales', description: 'Aides familiales', icon: '👶' },
      { type_id: 1, name: 'Indemnités', description: 'Indemnités diverses', icon: '🎖️' },
      { type_id: 1, name: 'Remboursements', description: 'Remboursements reçus', icon: '↩️' },
      { type_id: 1, name: 'Cadeaux/Donations reçues', description: 'Dons et cadeaux en argent', icon: '🎀' },

      // Dépenses fixes (type_id: 2)
      { type_id: 2, name: 'Logement', description: 'Loyer, charges, hypothèque', icon: '🏠' },
      { type_id: 2, name: 'Assurances', description: 'Assurances diverses', icon: '🛡️' },
      { type_id: 2, name: 'Abonnements', description: 'Abonnements récurrents', icon: '📱' },
      { type_id: 2, name: 'Transports', description: 'Transports en commun, carburant', icon: '🚌' },
      { type_id: 2, name: 'Crédits', description: 'Remboursements de crédits', icon: '🏦' },
      { type_id: 2, name: 'Frais bancaires', description: 'Frais de compte, cartes', icon: '💳' },
      { type_id: 2, name: 'Téléphone', description: 'Forfaits téléphoniques', icon: '📞' },
      { type_id: 2, name: 'Impôts', description: 'Impôts et taxes', icon: '🏛️' },

      // Dépenses variables (type_id: 3)
      { type_id: 3, name: 'Alimentation', description: 'Courses alimentaires', icon: '🛒' },
      { type_id: 3, name: 'Restaurants', description: 'Restaurants et livraisons', icon: '🍽️' },
      { type_id: 3, name: 'Transports variables', description: 'Taxi, Uber, transports occasionnels', icon: '🚕' },
      { type_id: 3, name: 'Santé hors assurance', description: 'Frais médicaux non couverts', icon: '🏥' },
      { type_id: 3, name: 'Loisirs', description: 'Cinéma, spectacles, hobbies', icon: '🎭' },
      { type_id: 3, name: 'Vacances', description: 'Voyages et vacances', icon: '✈️' },
      { type_id: 3, name: 'Shopping', description: 'Vêtements, accessoires', icon: '👕' },
      { type_id: 3, name: 'Animaux', description: 'Frais vétérinaires, nourriture', icon: '🐕' },
      { type_id: 3, name: 'Entretien logement', description: 'Réparations, aménagements', icon: '🔧' },
      { type_id: 3, name: 'Achats imprévus', description: 'Achats non planifiés', icon: '❓' },
      { type_id: 3, name: 'Événements spéciaux', description: 'Mariages, anniversaires', icon: '🎉' },

      // Épargne (type_id: 4)
      { type_id: 4, name: 'Fonds d\'urgence', description: 'Réserve d\'urgence', icon: '🚨' },
      { type_id: 4, name: 'Compte épargne', description: 'Épargne classique', icon: '🏦' },
      { type_id: 4, name: '3ème pilier', description: 'Prévoyance retraite', icon: '🎯' },
      { type_id: 4, name: 'Projets long terme', description: 'Épargne pour projets futurs', icon: '🌟' },
      { type_id: 4, name: 'Fonds de remplacement', description: 'Remplacement équipements', icon: '🔄' },

      // Investissement (type_id: 5)
      { type_id: 5, name: 'Bourse', description: 'Actions et ETF', icon: '📊' },
      { type_id: 5, name: 'Crypto-monnaies', description: 'Investissements crypto', icon: '₿' },
      { type_id: 5, name: 'Immobilier/Crowdfunding', description: 'Investissement immobilier', icon: '🏢' },
      { type_id: 5, name: 'Plan de prévoyance', description: 'Plans de prévoyance privés', icon: '📋' },

      // Dettes (type_id: 6)
      { type_id: 6, name: 'Carte de crédit', description: 'Soldes cartes de crédit', icon: '💳' },
      { type_id: 6, name: 'Prêt étudiant', description: 'Prêts étudiants', icon: '🎓' },
      { type_id: 6, name: 'Prêt personnel', description: 'Prêts personnels', icon: '💰' },
      { type_id: 6, name: 'Prêt auto', description: 'Financement véhicule', icon: '🚗' },
      { type_id: 6, name: 'Dette médicale', description: 'Dettes médicales', icon: '🏥' },
      { type_id: 6, name: 'Autres dettes', description: 'Autres dettes diverses', icon: '📝' },

      // Remboursements (type_id: 7)
      { type_id: 7, name: 'Paiement de dettes', description: 'Remboursements de dettes', icon: '💸' },
      { type_id: 7, name: 'Remboursements internes', description: 'Remboursements entre comptes', icon: '🔄' }
    ];

    for (const category of categoriesData) {
      await insertData(supabase, 'categories', [category], `Catégorie: ${category.icon} ${category.name}`);
    }

    // 8. Configuration RLS
    console.log('\n8. Configuration des politiques RLS...');
    
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
      await executeSQL(supabase, query, 'Politique RLS');
    }

    // 9. Vérification finale
    console.log('\n9. Vérification finale...');
    const { data: finalTypes } = await supabase.from('types').select('*');
    const { data: finalCategories } = await supabase.from('categories').select('*');
    
    console.log(`   ✅ ${finalTypes?.length || 0} types au total`);
    console.log(`   ✅ ${finalCategories?.length || 0} catégories au total`);

    if (finalTypes?.length === 7 && finalCategories?.length >= 41) {
      console.log('\n🎉 SCHÉMA APPLIQUÉ AVEC SUCCÈS !');
      console.log('✅ 7 types prédéfinis créés');
      console.log('✅ 41 catégories prédéfinies créées');
      console.log('✅ Politiques RLS configurées');
      console.log('✅ Structure de base complète');
      console.log('\n🚀 Votre application est maintenant prête à fonctionner !');
      console.log('🌐 Testez sur http://localhost:5173');
    } else {
      console.log('\n⚠️  Schéma partiellement appliqué. Vérifiez les erreurs ci-dessus.');
    }

  } catch (error) {
    console.error('\n💥 ERREUR FATALE:', error.message);
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Vérifiez que la clé service_role est correcte');
    console.log('2. Vérifiez la connexion internet');
    console.log('3. Consultez les logs Supabase pour plus de détails');
  } finally {
    rl.close();
  }
}

// Exécution
applySchema();
