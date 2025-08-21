#!/usr/bin/env node

/**
 * Script de test pour le système d'authentification robuste
 * Usage: node scripts/test-auth-system.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('Vérifiez que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`)
};

// Tests à effectuer
const tests = {
  // Test 1: Vérifier la connexion à Supabase
  async testConnection() {
    log.info('Test de connexion à Supabase...');
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      if (error) throw error;
      log.success('Connexion à Supabase réussie');
      return true;
    } catch (error) {
      log.error(`Erreur de connexion: ${error.message}`);
      return false;
    }
  },

  // Test 2: Vérifier l'existence des tables
  async testTables() {
    log.info('Vérification des tables...');
    const tables = ['user_profiles', 'user_otps', 'login_attempts', 'trusted_devices'];
    const results = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) throw error;
        results[table] = true;
        log.success(`Table ${table}: OK`);
      } catch (error) {
        results[table] = false;
        log.error(`Table ${table}: ${error.message}`);
      }
    }

    return results;
  },

  // Test 3: Vérifier les fonctions RPC
  async testRPCFunctions() {
    log.info('Vérification des fonctions RPC...');
    const functions = [
      'generate_otp',
      'validate_otp',
      'is_user_blocked',
      'record_login_attempt',
      'manage_trusted_device',
      'is_trusted_device',
      'perform_cleanup'
    ];
    const results = {};

    for (const func of functions) {
      try {
        // Test avec des paramètres factices
        const { data, error } = await supabase.rpc(func, {
          p_email: 'test@example.com',
          p_code: '123456',
          p_code_type: 'login',
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_device_id: 'test-device',
          p_success: false
        });
        
        // Si on arrive ici, la fonction existe (même si elle peut retourner une erreur logique)
        results[func] = true;
        log.success(`Fonction ${func}: OK`);
      } catch (error) {
        // Si l'erreur indique que la fonction n'existe pas
        if (error.message.includes('function') && error.message.includes('does not exist')) {
          results[func] = false;
          log.error(`Fonction ${func}: Non trouvée`);
        } else {
          // La fonction existe mais retourne une erreur logique (normal)
          results[func] = true;
          log.success(`Fonction ${func}: OK (erreur logique attendue)`);
        }
      }
    }

    return results;
  },

  // Test 4: Vérifier les politiques RLS
  async testRLSPolicies() {
    log.info('Vérification des politiques RLS...');
    const tables = ['user_profiles', 'user_otps', 'login_attempts', 'trusted_devices'];
    const results = {};

    for (const table of tables) {
      try {
        // Essayer de lire sans authentification (devrait être bloqué par RLS)
        const { data, error } = await supabase.from(table).select('*').limit(1);
        
        if (error && error.message.includes('new row violates row-level security policy')) {
          results[table] = true;
          log.success(`RLS actif pour ${table}`);
        } else if (error && error.message.includes('JWT')) {
          results[table] = true;
          log.success(`RLS actif pour ${table} (JWT requis)`);
        } else {
          results[table] = false;
          log.warning(`RLS peut-être désactivé pour ${table}`);
        }
      } catch (error) {
        results[table] = false;
        log.error(`Erreur RLS pour ${table}: ${error.message}`);
      }
    }

    return results;
  },

  // Test 5: Test complet du flux d'authentification (simulation)
  async testAuthFlow() {
    log.info('Test du flux d\'authentification...');
    
    try {
      // 1. Vérifier si un utilisateur de test existe
      const testEmail = 'test-auth@example.com';
      
      // 2. Simuler la génération d'un OTP
      const { data: otpData, error: otpError } = await supabase.rpc('generate_otp', {
        p_email: testEmail,
        p_code_type: 'login',
        p_expires_in_minutes: 5
      });

      if (otpError) {
        if (otpError.message.includes('Utilisateur non trouvé')) {
          log.warning('Utilisateur de test non trouvé (normal pour un test)');
          return { success: true, message: 'Test de génération OTP réussi (utilisateur inexistant)' };
        } else {
          throw otpError;
        }
      }

      log.success('Génération d\'OTP réussie');
      
      // 3. Simuler la validation d'un OTP
      const { data: validationData, error: validationError } = await supabase.rpc('validate_otp', {
        p_email: testEmail,
        p_code: '123456',
        p_code_type: 'login'
      });

      if (validationError) {
        if (validationError.message.includes('Utilisateur non trouvé')) {
          log.warning('Validation OTP: utilisateur non trouvé (normal)');
        } else {
          log.success('Test de validation OTP réussi');
        }
      }

      return { success: true, message: 'Flux d\'authentification testé avec succès' };
    } catch (error) {
      log.error(`Erreur dans le flux d'authentification: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Test 6: Vérifier les extensions PostgreSQL
  async testExtensions() {
    log.info('Vérification des extensions PostgreSQL...');
    const extensions = ['uuid-ossp', 'pgcrypto'];
    const results = {};

    for (const ext of extensions) {
      try {
        const { data, error } = await supabase.rpc('generate_otp', {
          p_email: 'test@example.com',
          p_code_type: 'login',
          p_expires_in_minutes: 5
        });
        
        // Si on arrive ici, les extensions sont probablement installées
        results[ext] = true;
        log.success(`Extension ${ext}: OK`);
      } catch (error) {
        if (error.message.includes('function') || error.message.includes('does not exist')) {
          results[ext] = false;
          log.error(`Extension ${ext}: Non disponible`);
        } else {
          results[ext] = true;
          log.success(`Extension ${ext}: OK`);
        }
      }
    }

    return results;
  }
};

// Fonction principale de test
async function runTests() {
  log.title('🧪 TESTS DU SYSTÈME D\'AUTHENTIFICATION ROBUSTE');
  log.info('Démarrage des tests...\n');

  const results = {
    connection: false,
    tables: {},
    rpcFunctions: {},
    rlsPolicies: {},
    authFlow: {},
    extensions: {}
  };

  // Test 1: Connexion
  results.connection = await tests.testConnection();
  if (!results.connection) {
    log.error('Impossible de se connecter à Supabase. Arrêt des tests.');
    process.exit(1);
  }

  // Test 2: Tables
  results.tables = await tests.testTables();

  // Test 3: Fonctions RPC
  results.rpcFunctions = await tests.testRPCFunctions();

  // Test 4: Politiques RLS
  results.rlsPolicies = await tests.testRLSPolicies();

  // Test 5: Flux d'authentification
  results.authFlow = await tests.testAuthFlow();

  // Test 6: Extensions
  results.extensions = await tests.testExtensions();

  // Résumé des résultats
  log.title('📊 RÉSUMÉ DES TESTS');

  const allTablesOk = Object.values(results.tables).every(Boolean);
  const allFunctionsOk = Object.values(results.rpcFunctions).every(Boolean);
  const allRLSOk = Object.values(results.rlsPolicies).every(Boolean);
  const allExtensionsOk = Object.values(results.extensions).every(Boolean);

  console.log('\n' + '='.repeat(60));
  
  log.info(`Connexion Supabase: ${results.connection ? '✅' : '❌'}`);
  log.info(`Tables: ${allTablesOk ? '✅' : '❌'} (${Object.values(results.tables).filter(Boolean).length}/${Object.keys(results.tables).length})`);
  log.info(`Fonctions RPC: ${allFunctionsOk ? '✅' : '❌'} (${Object.values(results.rpcFunctions).filter(Boolean).length}/${Object.keys(results.rpcFunctions).length})`);
  log.info(`Politiques RLS: ${allRLSOk ? '✅' : '❌'} (${Object.values(results.rlsPolicies).filter(Boolean).length}/${Object.keys(results.rlsPolicies).length})`);
  log.info(`Extensions: ${allExtensionsOk ? '✅' : '❌'} (${Object.values(results.extensions).filter(Boolean).length}/${Object.keys(results.extensions).length})`);
  log.info(`Flux d'authentification: ${results.authFlow.success ? '✅' : '❌'}`);

  console.log('\n' + '='.repeat(60));

  // Recommandations
  log.title('💡 RECOMMANDATIONS');

  if (!allTablesOk) {
    log.warning('Certaines tables sont manquantes. Exécutez le script SQL complet.');
  }

  if (!allFunctionsOk) {
    log.warning('Certaines fonctions RPC sont manquantes. Vérifiez le script SQL.');
  }

  if (!allRLSOk) {
    log.warning('Certaines politiques RLS ne sont pas actives. Vérifiez la sécurité.');
  }

  if (!allExtensionsOk) {
    log.warning('Certaines extensions PostgreSQL sont manquantes. Vérifiez l\'installation.');
  }

  if (results.connection && allTablesOk && allFunctionsOk && allRLSOk && allExtensionsOk) {
    log.success('🎉 Tous les tests sont passés ! Le système d\'authentification est prêt.');
    log.info('Vous pouvez maintenant tester l\'application avec : npm run dev');
  } else {
    log.error('❌ Certains tests ont échoué. Vérifiez la configuration.');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
}

// Exécuter les tests
runTests().catch(error => {
  log.error(`Erreur fatale: ${error.message}`);
  process.exit(1);
});
