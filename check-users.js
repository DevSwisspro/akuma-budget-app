import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 Vérification des utilisateurs inscrits dans Supabase...');
  console.log('');

  try {
    // Essayer de vérifier via les tables publiques d'abord
    console.log('🔄 Vérification via la table user_profiles...');
    
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');
      
    if (profileError) {
      console.log('❌ Erreur table user_profiles:', profileError.message);
    } else if (profiles && profiles.length > 0) {
      console.log('👥 PROFILS UTILISATEURS TROUVÉS:');
      console.log('================================');
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ID: ${profile.id}`);
        console.log(`   Email: ${profile.email || 'Non spécifié'}`);
        console.log(`   Nom: ${profile.first_name || ''} ${profile.last_name || ''}`);
        console.log(`   Devise: ${profile.preferred_currency || 'CHF'}`);
        console.log(`   Créé: ${new Date(profile.created_at).toLocaleString('fr-FR')}`);
        console.log('');
      });
      console.log(`📊 TOTAL: ${profiles.length} profil(s) utilisateur(s)`);
    } else {
      console.log('ℹ️  Aucun profil utilisateur trouvé dans user_profiles');
    }

    // Vérifier aussi les transactions pour voir l'activité
    console.log('');
    console.log('🔄 Vérification des transactions...');
    
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('user_id, created_at')
      .limit(10);
      
    if (txError) {
      console.log('❌ Erreur table transactions:', txError.message);
    } else if (transactions && transactions.length > 0) {
      console.log(`💳 ${transactions.length} transaction(s) trouvée(s)`);
      console.log('Dernières activités:');
      transactions.forEach((tx, index) => {
        console.log(`${index + 1}. User ID: ${tx.user_id} - ${new Date(tx.created_at).toLocaleString('fr-FR')}`);
      });
    } else {
      console.log('ℹ️  Aucune transaction trouvée');
    }

    // Vérifier les budgets
    console.log('');
    console.log('🔄 Vérification des budgets...');
    
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('user_id, name, created_at')
      .limit(5);
      
    if (budgetError) {
      console.log('❌ Erreur table budgets:', budgetError.message);
    } else if (budgets && budgets.length > 0) {
      console.log(`🎯 ${budgets.length} budget(s) trouvé(s)`);
      budgets.forEach((budget, index) => {
        console.log(`${index + 1}. "${budget.name}" - User: ${budget.user_id}`);
      });
    } else {
      console.log('ℹ️  Aucun budget trouvé');
    }
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

checkUsers();