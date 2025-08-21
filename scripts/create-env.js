#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Création du fichier .env...\n');

// Configuration Supabase
const supabaseConfig = {
  VITE_SUPABASE_URL: 'https://nwzqbnofamhlnmasdvyo.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0',
  SUPABASE_ACCESS_TOKEN: 'sbp_c9142942e52a86264e02bc9e5873c4e04c488637',
  SUPABASE_PROJECT_REF: 'nwzqbnofamhlnmasdvyo'
};

// Configuration Netlify
const netlifyConfig = {
  NETLIFY_AUTH_TOKEN: 'nfp_g95uZNF3nzjQVcuxrVtJqZqeRJomNE5y89db'
};

// Configuration GitHub
const githubConfig = {
  GITHUB_PERSONAL_ACCESS_TOKEN: 'your_github_token_here'
};

// Demander la clé service_role
console.log('⚠️  IMPORTANT: Pour les opérations administratives Supabase, vous devez fournir la clé service_role.');
console.log('📋 Pour l\'obtenir:');
console.log('1. Allez sur https://supabase.com/dashboard');
console.log('2. Sélectionnez votre projet');
console.log('3. Allez dans Settings > API');
console.log('4. Copiez la clé "service_role"');
console.log('\n🔑 Entrez votre clé service_role (ou appuyez sur Entrée pour laisser vide):');

// Simuler la demande d'entrée (en production, vous devriez utiliser readline)
const serviceRoleKey = process.argv[2] || 'your_service_role_key_here';

// Créer le contenu du fichier .env
const envContent = `# Configuration Supabase
VITE_SUPABASE_URL=${supabaseConfig.VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${supabaseConfig.VITE_SUPABASE_ANON_KEY}

# Supabase Service Role Key (pour les opérations administratives)
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}

# Supabase Access Token (pour MCP)
SUPABASE_ACCESS_TOKEN=${supabaseConfig.SUPABASE_ACCESS_TOKEN}
SUPABASE_PROJECT_REF=${supabaseConfig.SUPABASE_PROJECT_REF}

# Netlify Configuration
NETLIFY_AUTH_TOKEN=${netlifyConfig.NETLIFY_AUTH_TOKEN}

# GitHub Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=${githubConfig.GITHUB_PERSONAL_ACCESS_TOKEN}
`;

// Créer le fichier .env
const envPath = path.join(process.cwd(), '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env créé avec succès!');
  
  console.log('\n📋 Variables configurées:');
  console.log(`  - VITE_SUPABASE_URL: ${supabaseConfig.VITE_SUPABASE_URL}`);
  console.log(`  - VITE_SUPABASE_ANON_KEY: ${supabaseConfig.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...`);
  console.log(`  - SUPABASE_ACCESS_TOKEN: ${supabaseConfig.SUPABASE_ACCESS_TOKEN.substring(0, 10)}...`);
  console.log(`  - SUPABASE_PROJECT_REF: ${supabaseConfig.SUPABASE_PROJECT_REF}`);
  console.log(`  - NETLIFY_AUTH_TOKEN: ${netlifyConfig.NETLIFY_AUTH_TOKEN.substring(0, 10)}...`);
  console.log(`  - GITHUB_PERSONAL_ACCESS_TOKEN: ${githubConfig.GITHUB_PERSONAL_ACCESS_TOKEN.substring(0, 10)}...`);
  
  if (serviceRoleKey !== 'your_service_role_key_here') {
    console.log(`  - SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey.substring(0, 10)}...`);
  } else {
    console.log('  - SUPABASE_SERVICE_ROLE_KEY: ⚠️  À configurer manuellement');
  }
  
  console.log('\n📝 Prochaines étapes:');
  console.log('1. Redémarrez Cursor');
  console.log('2. Allez dans Settings > Extensions > MCP');
  console.log('3. Vérifiez que les serveurs apparaissent en vert');
  console.log('4. Si ils sont en rouge, cliquez sur "Reload"');
  
  if (serviceRoleKey === 'your_service_role_key_here') {
    console.log('\n⚠️  N\'oubliez pas de remplacer SUPABASE_SERVICE_ROLE_KEY par votre vraie clé service_role!');
  }
  
} catch (error) {
  console.log('❌ Erreur lors de la création du fichier .env:', error.message);
}

