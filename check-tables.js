import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwzqbnofamhlnmasdvyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Vérification des tables disponibles...');
  console.log('');

  // Essayer différentes tables connues
  const tablesToCheck = ['types', 'categories', 'transaction_types', 'budget_categories', 'user_sessions'];
  
  for (const table of tablesToCheck) {
    try {
      console.log(`🔄 Test table: ${table}`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(5);
        
      if (error) {
        console.log(`   ❌ Erreur: ${error.message}`);
      } else {
        console.log(`   ✅ Table trouvée! ${data.length} enregistrement(s)`);
        if (data.length > 0) {
          console.log(`   📋 Colonnes: ${Object.keys(data[0]).join(', ')}`);
          console.log(`   📄 Premier enregistrement:`);
          console.log('      ', JSON.stringify(data[0], null, 2));
        }
      }
      console.log('');
    } catch (err) {
      console.log(`   ❌ Erreur de connexion: ${err.message}`);
      console.log('');
    }
  }

  // Tester une requête directe sur auth.users si possible
  console.log('🔄 Test accès aux utilisateurs via RPC...');
  try {
    const { data, error } = await supabase.rpc('get_current_user_info');
    if (error) {
      console.log(`   ❌ RPC non disponible: ${error.message}`);
    } else {
      console.log('   ✅ RPC disponible:', data);
    }
  } catch (err) {
    console.log(`   ❌ RPC erreur: ${err.message}`);
  }
}

checkTables();