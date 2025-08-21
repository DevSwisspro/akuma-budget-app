#!/usr/bin/env node

/**
 * Script sécurisé pour appliquer le schéma via l'API REST Supabase
 * Sans nécessiter la clé service_role
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Données des types à insérer
const TYPES_DATA = [
  { id: 1, name: 'revenu', description: 'Revenus et entrées d\'argent', icon: '💰', color: 'green' },
  { id: 2, name: 'depense_fixe', description: 'Dépenses fixes récurrentes', icon: '🏠', color: 'blue' },
  { id: 3, name: 'depense_variable', description: 'Dépenses variables', icon: '🛒', color: 'orange' },
  { id: 4, name: 'epargne', description: 'Épargne et réserves', icon: '🏦', color: 'purple' },
  { id: 5, name: 'investissement', description: 'Investissements et placements', icon: '📈', color: 'indigo' },
  { id: 6, name: 'dette', description: 'Dettes et emprunts', icon: '💳', color: 'red' },
  { id: 7, name: 'remboursement', description: 'Remboursements de dettes', icon: '💸', color: 'pink' }
];

// Données des catégories à insérer
const CATEGORIES_DATA = [
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

async function checkAndFixSchema() {
  console.log('🔧 Vérification et correction du schéma Supabase...\n');

  try {
    // 1. Vérifier les types existants
    console.log('1. Vérification des types...');
    const { data: existingTypes, error: typesError } = await supabase
      .from('types')
      .select('*');

    if (typesError) {
      console.log(`   ❌ Erreur types: ${typesError.message}`);
      return;
    }

    console.log(`   📊 ${existingTypes.length} types trouvés dans la base`);

    // 2. Si pas de types, les insérer
    if (existingTypes.length === 0) {
      console.log('2. Insertion des types prédéfinis...');
      
      for (const typeData of TYPES_DATA) {
        try {
          const { error } = await supabase
            .from('types')
            .insert([typeData]);
          
          if (error) {
            console.log(`   ⚠️  Erreur insertion type ${typeData.name}: ${error.message}`);
          } else {
            console.log(`   ✅ Type "${typeData.name}" inséré`);
          }
        } catch (err) {
          console.log(`   ❌ Erreur: ${err.message}`);
        }
      }
    } else {
      console.log('   ℹ️  Types déjà présents, passage à l\'étape suivante');
    }

    // 3. Vérifier les catégories
    console.log('\n3. Vérification des catégories...');
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.log(`   ❌ Erreur catégories: ${categoriesError.message}`);
      
      // Si erreur de colonne, il faut peut-être recreer la table
      if (categoriesError.message.includes('column') && categoriesError.message.includes('does not exist')) {
        console.log('   🔧 Structure de table incorrecte détectée');
        console.log('   ⚠️  ATTENTION: Vous devez appliquer le schéma complet via Supabase Dashboard');
        console.log('   📋 Étapes:');
        console.log('   1. Allez dans Supabase Dashboard > SQL Editor');
        console.log('   2. Exécutez le contenu du fichier fix-schema-complete.sql');
        return;
      }
    } else {
      console.log(`   📊 ${existingCategories.length} catégories trouvées`);
      
      // Compter par type
      const byType = {};
      existingCategories.forEach(cat => {
        if (!byType[cat.type_id]) byType[cat.type_id] = 0;
        byType[cat.type_id]++;
      });
      
      Object.entries(byType).forEach(([typeId, count]) => {
        const typeName = TYPES_DATA.find(t => t.id == typeId)?.name || `Type ${typeId}`;
        console.log(`      ${typeName}: ${count} catégories`);
      });
    }

    // 4. Vérifier si on peut insérer des catégories manquantes
    if (existingCategories && existingCategories.length < CATEGORIES_DATA.length) {
      console.log('\n4. Insertion des catégories manquantes...');
      
      for (const categoryData of CATEGORIES_DATA) {
        const exists = existingCategories.find(c => 
          c.name === categoryData.name && c.type_id === categoryData.type_id
        );
        
        if (!exists) {
          try {
            const { error } = await supabase
              .from('categories')
              .insert([categoryData]);
            
            if (error) {
              console.log(`   ⚠️  Erreur insertion "${categoryData.name}": ${error.message}`);
            } else {
              console.log(`   ✅ Catégorie "${categoryData.name}" insérée`);
            }
          } catch (err) {
            console.log(`   ❌ Erreur: ${err.message}`);
          }
        }
      }
    }

    // 5. Vérification finale
    console.log('\n5. Vérification finale...');
    const { data: finalTypes } = await supabase.from('types').select('*');
    const { data: finalCategories } = await supabase.from('categories').select('*');
    
    console.log(`   ✅ ${finalTypes?.length || 0} types au total`);
    console.log(`   ✅ ${finalCategories?.length || 0} catégories au total`);

    if (finalTypes?.length === 7 && finalCategories?.length >= 41) {
      console.log('\n🎉 SCHÉMA CORRECT ET COMPLET !');
    } else {
      console.log('\n⚠️  Schéma incomplet. Exécutez fix-schema-complete.sql manuellement.');
    }

  } catch (error) {
    console.error('\n💥 ERREUR FATALE:', error.message);
    console.log('\n🔧 SOLUTION:');
    console.log('1. Vérifiez la connexion Supabase');
    console.log('2. Exécutez fix-schema-complete.sql dans Supabase Dashboard > SQL Editor');
  }
}

// Exécution
checkAndFixSchema();
