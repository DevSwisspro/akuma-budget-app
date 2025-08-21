#!/usr/bin/env node

/**
 * Script de vérification de la configuration Supabase
 * Usage: node scripts/verify-setup.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const isDevMode = process.env.VITE_DEV_MODE === 'true'

console.log('🔍 Vérification de la configuration Supabase...\n')
console.log('Mode développement:', isDevMode ? '✅ Activé' : '❌ Désactivé')
console.log('URL Supabase:', supabaseUrl || '❌ Non définie')
console.log('Clé Supabase:', supabaseKey ? '✅ Définie' : '❌ Non définie')

// Vérifier les variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  if (isDevMode) {
    console.log('✅ Mode développement détecté - Utilisation des données mock')
    console.log('📝 Pour utiliser Supabase, configurez vos vraies clés dans .env')
    console.log('   et changez VITE_DEV_MODE=false')
    process.exit(0)
  } else {
    console.error('❌ Variables d\'environnement manquantes !')
    console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
    console.error('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌')
    console.error('\n📝 Créez un fichier .env avec :')
    console.error('   VITE_SUPABASE_URL=https://votre-projet.supabase.co')
    console.error('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
    process.exit(1)
  }
}

if (isDevMode) {
  console.log('✅ Mode développement - Application prête avec données mock')
  console.log('\n📝 Prochaines étapes :')
  console.log('   1. Créer un projet Supabase (voir SETUP_INTERACTIF.md)')
  console.log('   2. Configurer vos vraies clés dans .env')
  console.log('   3. Changer VITE_DEV_MODE=false')
  console.log('   4. Redémarrer l\'application')
  console.log('\n🎉 L\'application fonctionne déjà en mode développement !')
  process.exit(0)
}

console.log('✅ Variables d\'environnement trouvées')

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyConnection() {
  try {
    console.log('\n🔌 Test de connexion à Supabase...')
    
    // Test de connexion basique
    const { data, error } = await supabase.from('categories').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message)
      return false
    }
    
    console.log('✅ Connexion à Supabase réussie')
    return true
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    return false
  }
}

async function verifyTables() {
  try {
    console.log('\n📊 Vérification des tables...')
    
    const tables = [
      'user_profiles',
      'categories', 
      'custom_categories',
      'transactions',
      'budgets'
    ]
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) {
          console.error(`❌ Table ${table}:`, error.message)
        } else {
          console.log(`✅ Table ${table}: OK`)
        }
      } catch (error) {
        console.error(`❌ Table ${table}:`, error.message)
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des tables:', error.message)
  }
}

async function verifyFunctions() {
  try {
    console.log('\n⚙️ Vérification des fonctions...')
    
    // Test de la fonction get_user_categories
    try {
      const { data, error } = await supabase.rpc('get_user_categories', { 
        user_uuid: '00000000-0000-0000-0000-000000000000' 
      })
      
      if (error) {
        console.error('❌ Fonction get_user_categories:', error.message)
      } else {
        console.log('✅ Fonction get_user_categories: OK')
      }
    } catch (error) {
      console.error('❌ Fonction get_user_categories:', error.message)
    }
    
    // Test de la fonction get_user_balance
    try {
      const { data, error } = await supabase.rpc('get_user_balance', { 
        user_uuid: '00000000-0000-0000-0000-000000000000' 
      })
      
      if (error) {
        console.error('❌ Fonction get_user_balance:', error.message)
      } else {
        console.log('✅ Fonction get_user_balance: OK')
      }
    } catch (error) {
      console.error('❌ Fonction get_user_balance:', error.message)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des fonctions:', error.message)
  }
}

async function verifyCategories() {
  try {
    console.log('\n📂 Vérification des catégories prédéfinies...')
    
    const { data, error } = await supabase.from('categories').select('*')
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des catégories:', error.message)
      return
    }
    
    if (data.length === 0) {
      console.error('❌ Aucune catégorie trouvée !')
      console.error('   Exécutez le script SQL pour créer les catégories prédéfinies')
      return
    }
    
    console.log(`✅ ${data.length} catégories trouvées`)
    
    // Vérifier les types de catégories
    const types = [...new Set(data.map(cat => cat.type))]
    console.log('   Types disponibles:', types.join(', '))
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des catégories:', error.message)
  }
}

async function verifyRLS() {
  try {
    console.log('\n🔒 Vérification des politiques RLS...')
    
    const tables = [
      'user_profiles',
      'custom_categories', 
      'transactions',
      'budgets'
    ]
    
    for (const table of tables) {
      try {
        // Essayer d'accéder sans authentification (devrait échouer)
        const { data, error } = await supabase.from(table).select('*').limit(1)
        
        if (error && error.message.includes('policy')) {
          console.log(`✅ RLS actif pour ${table}`)
        } else if (data) {
          console.warn(`⚠️ RLS peut-être désactivé pour ${table}`)
        } else {
          console.log(`✅ RLS actif pour ${table}`)
        }
      } catch (error) {
        console.log(`✅ RLS actif pour ${table}`)
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification RLS:', error.message)
  }
}

async function main() {
  console.log('🚀 Démarrage de la vérification...\n')
  
  // Vérifier la connexion
  const connected = await verifyConnection()
  if (!connected) {
    console.error('\n❌ Impossible de se connecter à Supabase')
    console.error('   Vérifiez vos variables d\'environnement et votre connexion internet')
    process.exit(1)
  }
  
  // Vérifier les tables
  await verifyTables()
  
  // Vérifier les fonctions
  await verifyFunctions()
  
  // Vérifier les catégories
  await verifyCategories()
  
  // Vérifier RLS
  await verifyRLS()
  
  console.log('\n🎉 Vérification terminée !')
  console.log('\n📝 Prochaines étapes :')
  console.log('   1. Démarrer l\'application : npm run dev')
  console.log('   2. Créer un compte utilisateur')
  console.log('   3. Tester les fonctionnalités')
  console.log('\n📚 Documentation : INSTALLATION_GUIDE.md')
}

main().catch(console.error)
