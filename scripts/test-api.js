#!/usr/bin/env node

/**
 * Test rapide de l'API fixed-categories
 * Pour vérifier que le frontend peut lire les types et catégories
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAPI() {
  console.log('🧪 Test de l\'API fixed-categories...\n');

  try {
    // Test 1: Lecture des types
    console.log('1. Test de lecture des types...');
    const { data: types, error: typesError } = await supabase
      .from('types')
      .select('*')
      .order('name');

    if (typesError) {
      console.log(`   ❌ Erreur types: ${typesError.message}`);
      return;
    }

    console.log(`   ✅ ${types.length} types trouvés:`);
    types.forEach(type => {
      console.log(`      ${type.icon} ${type.name} (ID: ${type.id})`);
    });

    // Test 2: Lecture des catégories
    console.log('\n2. Test de lecture des catégories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        )
      `)
      .order('name');

    if (categoriesError) {
      console.log(`   ❌ Erreur catégories: ${categoriesError.message}`);
      return;
    }

    console.log(`   ✅ ${categories.length} catégories trouvées`);
    
    // Grouper par type
    const byType = {};
    categories.forEach(cat => {
      const typeName = cat.types?.name || 'Type inconnu';
      if (!byType[typeName]) byType[typeName] = [];
      byType[typeName].push(cat);
    });

    Object.entries(byType).forEach(([typeName, cats]) => {
      console.log(`      ${typeName}: ${cats.length} catégories`);
    });

    // Test 3: Test d'une requête de catégories par type
    if (types.length > 0) {
      console.log('\n3. Test de filtrage par type...');
      const firstTypeId = types[0].id;
      const { data: filteredCategories, error: filterError } = await supabase
        .from('categories')
        .select('*')
        .eq('type_id', firstTypeId);

      if (filterError) {
        console.log(`   ❌ Erreur filtrage: ${filterError.message}`);
      } else {
        console.log(`   ✅ ${filteredCategories.length} catégories pour le type "${types[0].name}"`);
        filteredCategories.forEach(cat => {
          console.log(`      ${cat.icon} ${cat.name}`);
        });
      }
    }

    // Test 4: Test des politiques RLS (doit échouer sans authentification)
    console.log('\n4. Test des politiques RLS...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .limit(1);

    if (transactionsError) {
      if (transactionsError.message.includes('RLS') || transactionsError.message.includes('policy')) {
        console.log('   ✅ RLS activé (normal sans authentification)');
      } else {
        console.log(`   ⚠️  Erreur inattendue: ${transactionsError.message}`);
      }
    } else {
      console.log('   ⚠️  RLS peut-être désactivé (données accessibles sans auth)');
    }

    console.log('\n🎉 TESTS TERMINÉS AVEC SUCCÈS !');
    console.log('✅ L\'API est prête pour le frontend React');
    console.log('✅ Types et catégories lisibles');
    console.log('✅ Structure de base correcte');

  } catch (error) {
    console.error('\n💥 ERREUR DURANT LES TESTS:', error.message);
    console.log('\n🔧 VÉRIFICATIONS:');
    console.log('1. Le schéma est-il appliqué ? (npm run apply-schema-auto)');
    console.log('2. La connexion Supabase fonctionne-t-elle ?');
    console.log('3. Les tables existent-elles avec les bonnes colonnes ?');
  }
}

testAPI();
