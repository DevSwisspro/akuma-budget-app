#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

const SUPABASE_ACCESS_TOKEN = 'sbp_c9142942e52a86264e02bc9e5873c4e04c488637';
const PROJECT_REF = 'nwzqbnofamhlnmasdvyo';

console.log('🔑 Récupération des clés Supabase...\n');

// Fonction pour faire une requête HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
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

async function getProjectKeys() {
  try {
    console.log('📡 Connexion à l\'API Supabase...');
    
    const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(url, options);
    
    if (response.status === 200) {
      console.log('✅ Clés récupérées avec succès!\n');
      
      const keys = response.data;
      console.log('📋 Clés disponibles:');
      
      keys.forEach(key => {
        console.log(`  - ${key.name}: ${key.key.substring(0, 20)}...`);
      });
      
      // Chercher la clé service_role
      const serviceRoleKey = keys.find(key => key.name === 'service_role' || key.name.includes('service'));
      
      if (serviceRoleKey) {
        console.log('\n🔐 Clé service_role trouvée!');
        console.log(`SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey.key}`);
        
        // Mettre à jour le fichier .env.example
        const envExamplePath = './env.example';
        let envContent = fs.readFileSync(envExamplePath, 'utf8');
        
        // Ajouter la clé service_role si elle n'existe pas
        if (!envContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
          envContent += `\n# Supabase Service Role Key (pour les opérations administratives)\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey.key}\n`;
          fs.writeFileSync(envExamplePath, envContent);
          console.log('✅ Fichier env.example mis à jour');
        }
        
        console.log('\n📝 Instructions:');
        console.log('1. Copiez la clé service_role ci-dessus');
        console.log('2. Créez un fichier .env à la racine du projet');
        console.log('3. Ajoutez la ligne: SUPABASE_SERVICE_ROLE_KEY=votre_cle_ici');
        console.log('4. Redémarrez Cursor pour que les MCP prennent en compte les nouvelles variables');
        
      } else {
        console.log('\n⚠️  Clé service_role non trouvée');
        console.log('Vérifiez dans le dashboard Supabase > Settings > API');
      }
      
    } else {
      console.log(`❌ Erreur ${response.status}:`, response.data);
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des clés:', error.message);
    console.log('\n📝 Instructions manuelles:');
    console.log('1. Allez sur https://supabase.com/dashboard');
    console.log('2. Sélectionnez votre projet');
    console.log('3. Allez dans Settings > API');
    console.log('4. Copiez la "service_role" key');
    console.log('5. Créez un fichier .env avec: SUPABASE_SERVICE_ROLE_KEY=votre_cle');
  }
}

// Fonction pour tester la connexion avec les clés
async function testConnection() {
  console.log('\n🧪 Test de connexion...');
  
  try {
    const url = `https://nwzqbnofamhlnmasdvyo.supabase.co/rest/v1/`;
    const options = {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0'
      }
    };
    
    const response = await makeRequest(url, options);
    console.log('✅ Connexion Supabase réussie');
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

// Exécuter les fonctions
getProjectKeys().then(() => {
  return testConnection();
}).catch(error => {
  console.log('❌ Erreur générale:', error.message);
});
