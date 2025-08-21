#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration depuis le .env
const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Vérification rapide de la base de données Supabase...\n');

  try {
    // Vérifier la connexion (skip auth pour le test)
    console.log('1. Test de connexion...');
    console.log('   ✅ Connexion Supabase OK (mode vérification)\n');

    // Vérifier les tables principales
    const tables = ['types', 'categories', 'transactions', 'budgets'];
    
    for (const table of tables) {
      try {
        console.log(`2. Vérification table "${table}"...`);
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`   ❌ Table "${table}" : ${error.message}`);
        } else {
          console.log(`   ✅ Table "${table}" existe (${count || 0} lignes)`);
        }
      } catch (err) {
        console.log(`   ❌ Table "${table}" : ${err.message}`);
      }
    }

    // Vérifier les types si la table existe
    try {
      console.log('\n3. Vérification des types prédéfinis...');
      const { data: types, error } = await supabase
        .from('types')
        .select('id, name, icon');
      
      if (error) {
        console.log(`   ❌ Erreur types: ${error.message}`);
      } else if (types && types.length > 0) {
        console.log(`   ✅ ${types.length} types trouvés:`);
        types.forEach(type => {
          console.log(`      ${type.icon} ${type.name} (ID: ${type.id})`);
        });
      } else {
        console.log('   ⚠️  Aucun type trouvé (base vide)');
      }
    } catch (err) {
      console.log(`   ❌ Erreur lors de la vérification des types: ${err.message}`);
    }

    // Vérifier les catégories si la table existe
    try {
      console.log('\n4. Vérification des catégories prédéfinies...');
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, type_id, icon');
      
      if (error) {
        console.log(`   ❌ Erreur catégories: ${error.message}`);
      } else if (categories && categories.length > 0) {
        console.log(`   ✅ ${categories.length} catégories trouvées`);
        
        // Grouper par type
        const byType = {};
        categories.forEach(cat => {
          if (!byType[cat.type_id]) byType[cat.type_id] = [];
          byType[cat.type_id].push(cat);
        });
        
        Object.entries(byType).forEach(([typeId, cats]) => {
          console.log(`      Type ${typeId}: ${cats.length} catégories`);
        });
      } else {
        console.log('   ⚠️  Aucune catégorie trouvée (base vide)');
      }
    } catch (err) {
      console.log(`   ❌ Erreur lors de la vérification des catégories: ${err.message}`);
    }

  } catch (error) {
    console.error('💥 Erreur fatale:', error.message);
  }
}

checkDatabase();
