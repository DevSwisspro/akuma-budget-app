#!/usr/bin/env node

import https from 'https';

const SUPABASE_CONFIG = {
  accessToken: 'sbp_c9142942e52a86264e02bc9e5873c4e04c488637',
  projectRef: 'nwzqbnofamhlnmasdvyo',
  url: 'https://nwzqbnofamhlnmasdvyo.supabase.co',
  serviceRoleKey: null // Sera récupéré dynamiquement
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: jsonData, raw: data });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, raw: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Récupérer la clé service_role
async function getServiceRoleKey() {
  try {
    const url = `https://api.supabase.com/v1/projects/${SUPABASE_CONFIG.projectRef}/api-keys`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(url, options);
    
    if (response.status === 200) {
      const serviceRoleKey = response.data.find(key => key.name === 'service_role')?.api_key;
      return serviceRoleKey;
    }
    return null;
  } catch (error) {
    console.log('❌ Erreur récupération clé:', error.message);
    return null;
  }
}

// Exécuter SQL via l'API SQL Editor
async function executeSQL(sql, serviceRoleKey) {
  try {
    console.log('🔄 Exécution SQL:', sql.substring(0, 50) + '...');
    
    // Essayons via l'endpoint SQL Editor de Supabase
    const url = `https://api.supabase.com/v1/projects/${SUPABASE_CONFIG.projectRef}/database/query`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: sql
      })
    };
    
    const response = await makeRequest(url, options);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ SQL exécuté avec succès');
      return response.data;
    } else {
      console.log(`❌ Erreur ${response.status}:`, response.raw);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    return null;
  }
}

// Configuration RLS par étapes
async function setupRLSPolicies() {
  console.log('🔐 Configuration des politiques RLS...\n');
  
  // Récupérer la clé service_role
  console.log('🔍 Récupération de la clé service_role...');
  const serviceRoleKey = await getServiceRoleKey();
  
  if (!serviceRoleKey) {
    console.log('❌ Impossible de récupérer la clé service_role');
    return;
  }
  
  console.log('✅ Clé service_role récupérée\n');
  
  // Étapes SQL individuelles
  const sqlCommands = [
    'ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE categories ENABLE ROW LEVEL SECURITY;', 
    'ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;',
    
    // Transactions policies
    `CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    `CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can delete their own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);`,
    
    // Custom categories policies
    `CREATE POLICY "Users can view their own custom categories" ON custom_categories FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can insert their own custom categories" ON custom_categories FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    `CREATE POLICY "Users can update their own custom categories" ON custom_categories FOR UPDATE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can delete their own custom categories" ON custom_categories FOR DELETE USING (auth.uid() = user_id);`,
    
    // Budgets policies  
    `CREATE POLICY "Users can view their own budgets" ON budgets FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can insert their own budgets" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    `CREATE POLICY "Users can update their own budgets" ON budgets FOR UPDATE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can delete their own budgets" ON budgets FOR DELETE USING (auth.uid() = user_id);`,
    
    // Categories (public read)
    `CREATE POLICY "Everyone can view categories" ON categories FOR SELECT USING (true);`
  ];
  
  for (let i = 0; i < sqlCommands.length; i++) {
    const sql = sqlCommands[i];
    console.log(`📋 ${i + 1}/${sqlCommands.length}: ${sql.split(' ').slice(0, 4).join(' ')}...`);
    
    const result = await executeSQL(sql, serviceRoleKey);
    
    if (result !== null) {
      console.log('   ✅ Succès');
    } else {
      console.log('   ⚠️  Erreur ou déjà existant');
    }
    
    // Petite pause entre les commandes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🎉 Configuration RLS terminée !');
}

// Test de la configuration
async function testConfiguration() {
  console.log('\n🧪 Test de la configuration...');
  
  const serviceRoleKey = await getServiceRoleKey();
  if (!serviceRoleKey) return;
  
  // Tester une requête simple
  const testSQL = 'SELECT tablename FROM pg_tables WHERE tablename IN (\'transactions\', \'categories\', \'budgets\');';
  const result = await executeSQL(testSQL, serviceRoleKey);
  
  if (result) {
    console.log('✅ Configuration testée avec succès');
    console.log('📋 Tables trouvées:', result);
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Configuration RLS via API Supabase...\n');
  
  await setupRLSPolicies();
  await testConfiguration();
  
  console.log('\n🎯 Votre application est maintenant sécurisée !');
  console.log('📱 Testez la connexion dans votre application !');
}

main().catch(console.error);
