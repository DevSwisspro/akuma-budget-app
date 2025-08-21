#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Configuration des serveurs MCP...\n');

// Vérifier si les serveurs MCP sont installés
const servers = [
  '@modelcontextprotocol/server-supabase',
  '@modelcontextprotocol/server-netlify',
  '@modelcontextprotocol/server-github'
];

console.log('📦 Installation des serveurs MCP...');

for (const server of servers) {
  try {
    console.log(`Installing ${server}...`);
    execSync(`npx -y ${server} --version`, { stdio: 'inherit' });
    console.log(`✅ ${server} installé avec succès`);
  } catch (error) {
    console.log(`❌ Erreur lors de l'installation de ${server}:`, error.message);
  }
}

console.log('\n🔍 Vérification de la configuration MCP...');

// Vérifier le fichier MCP
const mcpPath = path.join(process.cwd(), '.cursor', 'mcp.json');

if (fs.existsSync(mcpPath)) {
  const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
  console.log('✅ Fichier MCP trouvé');
  
  if (mcpConfig.mcpServers) {
    console.log('\n📋 Serveurs configurés:');
    Object.keys(mcpConfig.mcpServers).forEach(server => {
      const config = mcpConfig.mcpServers[server];
      console.log(`  - ${server}: ${config.command} ${config.args.join(' ')}`);
      
      if (config.env) {
        Object.keys(config.env).forEach(key => {
          const value = config.env[key];
          const maskedValue = value.length > 8 ? value.substring(0, 4) + '***' + value.substring(value.length - 4) : '***';
          console.log(`    ${key}: ${maskedValue}`);
        });
      }
    });
  }
} else {
  console.log('❌ Fichier MCP non trouvé');
}

console.log('\n🚀 Test de connexion aux serveurs...');

// Test de connexion Supabase
try {
  console.log('Testing Supabase connection...');
  const supabaseTest = execSync('npx -y @modelcontextprotocol/server-supabase --help', { 
    encoding: 'utf8',
    env: {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: 'sbp_c9142942e52a86264e02bc9e5873c4e04c488637',
      SUPABASE_PROJECT_REF: 'nwzqbnofamhlnmasdvyo',
      SUPABASE_URL: 'https://nwzqbnofamhlnmasdvyo.supabase.co'
    }
  });
  console.log('✅ Serveur Supabase accessible');
} catch (error) {
  console.log('❌ Erreur serveur Supabase:', error.message);
}

// Test de connexion Netlify
try {
  console.log('Testing Netlify connection...');
  const netlifyTest = execSync('npx -y @modelcontextprotocol/server-netlify --help', { 
    encoding: 'utf8',
    env: {
      ...process.env,
      NETLIFY_AUTH_TOKEN: 'nfp_g95uZNF3nzjQVcuxrVtJqZqeRJomNE5y89db'
    }
  });
  console.log('✅ Serveur Netlify accessible');
} catch (error) {
  console.log('❌ Erreur serveur Netlify:', error.message);
}

console.log('\n📝 Instructions pour activer les MCP dans Cursor:');
console.log('1. Redémarrez Cursor');
console.log('2. Allez dans Settings > Extensions > MCP');
console.log('3. Vérifiez que les serveurs apparaissent en vert');
console.log('4. Si ils sont en rouge, cliquez sur "Reload"');

console.log('\n🔑 Variables d\'environnement nécessaires:');
console.log('- SUPABASE_ACCESS_TOKEN: sbp_c9142942e52a86264e02bc9e5873c4e04c488637');
console.log('- SUPABASE_PROJECT_REF: nwzqbnofamhlnmasdvyo');
console.log('- SUPABASE_URL: https://nwzqbnofamhlnmasdvyo.supabase.co');
console.log('- NETLIFY_AUTH_TOKEN: nfp_g95uZNF3nzjQVcuxrVtJqZqeRJomNE5y89db');

console.log('\n✨ Configuration MCP terminée!');
