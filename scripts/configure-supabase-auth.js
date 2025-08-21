#!/usr/bin/env node

import https from 'https';

// Configuration avec votre token API personnel
const SUPABASE_CONFIG = {
  accessToken: 'sbp_c9142942e52a86264e02bc9e5873c4e04c488637',
  projectRef: 'nwzqbnofamhlnmasdvyo',
  url: 'https://nwzqbnofamhlnmasdvyo.supabase.co',
  // Nous allons chercher la service_role key via l'API Management
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

// Fonction pour obtenir les clés API du projet
async function getProjectApiKeys() {
  try {
    console.log('🔍 Récupération des clés API du projet...');
    
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
      console.log('✅ Clés API récupérées');
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

// Fonction pour désactiver la confirmation email
async function disableEmailConfirmation() {
  try {
    console.log('📧 Désactivation de la confirmation email...');
    
    const url = `https://api.supabase.com/v1/projects/${SUPABASE_CONFIG.projectRef}/config/auth`;
    const options = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SUPABASE_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ENABLE_EMAIL_CONFIRMATIONS: false,
        ENABLE_EMAIL_AUTOCONFIRM: true
      })
    };
    
    const response = await makeRequest(url, options);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ Confirmation email désactivée');
      return true;
    } else {
      console.log(`❌ Erreur ${response.status}:`, response.raw);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    return false;
  }
}

// Fonction pour exécuter du SQL avec la service_role key
async function executeSQLWithServiceRole(sql, serviceRoleKey) {
  try {
    console.log('🔄 Exécution SQL:', sql.substring(0, 80) + '...');
    
    const url = `${SUPABASE_CONFIG.url}/rest/v1/rpc/exec`;
    const options = {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
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

// SQL pour configurer RLS
const RLS_SETUP_SQL = `
-- Activer RLS sur toutes les tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;

DROP POLICY IF EXISTS "Users can view their own custom categories" ON custom_categories;
DROP POLICY IF EXISTS "Users can insert their own custom categories" ON custom_categories;
DROP POLICY IF EXISTS "Users can update their own custom categories" ON custom_categories;
DROP POLICY IF EXISTS "Users can delete their own custom categories" ON custom_categories;

DROP POLICY IF EXISTS "Users can view their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can insert their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON budgets;

DROP POLICY IF EXISTS "Everyone can view categories" ON categories;

-- Créer les nouvelles politiques pour transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Créer les politiques pour custom_categories
CREATE POLICY "Users can view their own custom categories" ON custom_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom categories" ON custom_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom categories" ON custom_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom categories" ON custom_categories
  FOR DELETE USING (auth.uid() = user_id);

-- Créer les politiques pour budgets
CREATE POLICY "Users can view their own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Politique pour categories (lecture publique)
CREATE POLICY "Everyone can view categories" ON categories
  FOR SELECT USING (true);
`;

// Fonction principale
async function setupSupabaseAuth() {
  console.log('🚀 Configuration complète de l\'authentification Supabase...\n');
  
  // 1. Récupérer les clés API
  console.log('📋 Étape 1: Récupération des clés API');
  const apiKeys = await getProjectApiKeys();
  
  if (!apiKeys) {
    console.log('❌ Impossible de récupérer les clés API');
    return;
  }
  
  // Trouver la service_role key
  const serviceRoleKey = apiKeys.find(key => key.name === 'service_role')?.api_key;
  
  if (!serviceRoleKey) {
    console.log('❌ Clé service_role non trouvée');
    console.log('📋 Clés disponibles:', apiKeys.map(k => k.name));
    return;
  }
  
  console.log('✅ Clé service_role récupérée\n');
  
  // 2. Désactiver la confirmation email
  console.log('📋 Étape 2: Désactivation de la confirmation email');
  await disableEmailConfirmation();
  console.log('');
  
  // 3. Configurer RLS
  console.log('📋 Étape 3: Configuration des politiques RLS');
  const result = await executeSQLWithServiceRole(RLS_SETUP_SQL, serviceRoleKey);
  
  if (result !== null) {
    console.log('✅ Politiques RLS configurées avec succès');
  } else {
    console.log('❌ Erreur lors de la configuration RLS');
  }
  
  console.log('\n🎉 Configuration terminée !');
  console.log('\n📋 Votre application devrait maintenant fonctionner avec :');
  console.log('  - Authentification sans confirmation email');
  console.log('  - Politiques RLS activées');
  console.log('  - Données isolées par utilisateur');
  console.log('\n🧪 Testez votre application maintenant !');
}

// Exécution
setupSupabaseAuth().catch(console.error);
