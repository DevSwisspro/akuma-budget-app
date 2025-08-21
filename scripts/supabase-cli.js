#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const SUPABASE_CONFIG = {
  accessToken: 'sbp_c9142942e52a86264e02bc9e5873c4e04c488637',
  projectRef: 'nwzqbnofamhlnmasdvyo',
  url: 'https://nwzqbnofamhlnmasdvyo.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0'
};

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

// Fonction pour lister les tables via l'API Supabase
async function listTables() {
  try {
    console.log('📡 Récupération des tables...');
    
    const url = `${SUPABASE_CONFIG.url}/rest/v1/`;
    const options = {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(url, options);
    
    if (response.status === 200) {
      console.log('✅ Tables récupérées avec succès');
      return response.data;
    } else {
      console.log(`❌ Erreur ${response.status}:`, response.data);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des tables:', error.message);
    return null;
  }
}

// Fonction pour exécuter du SQL sur Supabase (via l'API Management)
async function executeSQL(sql) {
  try {
    console.log('📡 Exécution SQL sur Supabase...');
    
    // Utiliser l'API Management pour exécuter du SQL
    const url = `https://api.supabase.com/v1/projects/${SUPABASE_CONFIG.projectRef}/sql`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    };
    
    const response = await makeRequest(url, options);
    
    if (response.status === 200) {
      console.log('✅ SQL exécuté avec succès');
      return response.data;
    } else {
      console.log(`❌ Erreur ${response.status}:`, response.data);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de l\'exécution SQL:', error.message);
    return null;
  }
}

// Fonction pour créer une table
async function createTable(tableName, columns) {
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
    ${columns.map(col => `${col.name} ${col.type}${col.constraints ? ' ' + col.constraints : ''}`).join(',\n    ')}
  );`;
  
  return await executeSQL(sql);
}

// Fonction pour insérer des données
async function insertData(tableName, data) {
  const columns = Object.keys(data[0]).join(', ');
  const values = data.map(row => 
    `(${Object.values(row).map(val => typeof val === 'string' ? `'${val}'` : val).join(', ')})`
  ).join(', ');
  
  const sql = `INSERT INTO ${tableName} (${columns}) VALUES ${values} ON CONFLICT DO NOTHING;`;
  
  return await executeSQL(sql);
}

// Fonction pour lister les tables via SQL
async function listTablesSQL() {
  const sql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  
  return await executeSQL(sql);
}

// Fonction pour obtenir les données d'une table
async function getTableData(tableName) {
  const sql = `SELECT * FROM ${tableName} LIMIT 100;`;
  
  return await executeSQL(sql);
}

// Interface en ligne de commande
async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  console.log('🔧 Supabase CLI - Interface de gestion\n');
  
  switch (command) {
    case 'list-tables':
      console.log('📋 Liste des tables:');
      const tables = await listTables();
      if (tables && Array.isArray(tables)) {
        tables.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
      } else if (tables) {
        console.log('📊 Réponse reçue:', JSON.stringify(tables, null, 2));
      } else {
        console.log('❌ Aucune table trouvée ou erreur');
      }
      break;
      
    case 'create-table':
      if (args.length < 2) {
        console.log('❌ Usage: node supabase-cli.js create-table <table_name> <column1:type1,column2:type2>');
        break;
      }
      const tableName = args[0];
      const columnsStr = args[1];
      const columns = columnsStr.split(',').map(col => {
        const [name, type] = col.split(':');
        return { name: name.trim(), type: type.trim() };
      });
      
      console.log(`🏗️  Création de la table ${tableName}...`);
      await createTable(tableName, columns);
      break;
      
    case 'insert':
      if (args.length < 3) {
        console.log('❌ Usage: node supabase-cli.js insert <table_name> <column1:value1,column2:value2>');
        break;
      }
      const insertTableName = args[0];
      const dataStr = args[1];
      const data = [{}];
      dataStr.split(',').forEach(pair => {
        const [key, value] = pair.split(':');
        data[0][key.trim()] = value.trim();
      });
      
      console.log(`📝 Insertion dans ${insertTableName}...`);
      await insertData(insertTableName, data);
      break;
      
    case 'get-data':
      if (args.length < 1) {
        console.log('❌ Usage: node supabase-cli.js get-data <table_name>');
        break;
      }
      const getTableName = args[0];
      console.log(`📊 Données de ${getTableName}:`);
      const tableData = await getTableData(getTableName);
      if (tableData) {
        console.log(JSON.stringify(tableData, null, 2));
      }
      break;
      
    case 'execute-sql':
      if (args.length < 1) {
        console.log('❌ Usage: node supabase-cli.js execute-sql "SELECT * FROM table_name"');
        break;
      }
      const sql = args.join(' ');
      await executeSQL(sql);
      break;
      
    default:
      console.log('📖 Commandes disponibles:');
      console.log('  list-tables                    - Lister toutes les tables');
      console.log('  create-table <name> <cols>     - Créer une table');
      console.log('  insert <table> <data>          - Insérer des données');
      console.log('  get-data <table>               - Obtenir les données d\'une table');
      console.log('  execute-sql <sql>              - Exécuter du SQL personnalisé');
      console.log('\n📝 Exemples:');
      console.log('  node supabase-cli.js list-tables');
      console.log('  node supabase-cli.js create-table users "id:uuid,name:text,email:text"');
      console.log('  node supabase-cli.js insert users "name:John,email:john@example.com"');
      console.log('  node supabase-cli.js execute-sql "SELECT * FROM users"');
  }
}

main().catch(console.error);
