/**
 * Système d'export/import des données utilisateur Akuma Budget
 * Permet de sauvegarder et restaurer toutes les données d'un utilisateur
 */

import { supabase } from './supabase.js';
import { getCurrentUser, getCurrentUserId } from './supabase-auth.js';
import { fixedCategoriesApi } from '../api/fixed-categories.js';

// =====================================================
// FONCTIONS D'EXPORT
// =====================================================

/**
 * Exporte toutes les données utilisateur
 * @returns {Promise<Object>} Données complètes de l'utilisateur
 */
export const exportUserData = async () => {
  try {
    console.log('📦 Début export données utilisateur...');
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    const userId = currentUser.id;
    const exportTimestamp = new Date().toISOString();

    // Récupérer toutes les données utilisateur
    const [transactions, budgets, userProfile] = await Promise.all([
      fixedCategoriesApi.getUserTransactions(),
      fixedCategoriesApi.getUserBudgets(),
      getUserProfile(userId)
    ]);

    // Récupérer les catégories (communes mais importantes pour la restauration)
    const categories = await fixedCategoriesApi.getCategories();

    // Structure complète de l'export
    const exportData = {
      // Métadonnées de l'export
      export_metadata: {
        version: '1.0.0',
        app_name: 'Akuma Budget',
        export_date: exportTimestamp,
        user_id: userId,
        user_email: currentUser.email,
        export_type: 'complete_user_data'
      },

      // Profil utilisateur
      user_profile: {
        id: userId,
        email: currentUser.email,
        created_at: currentUser.created_at,
        metadata: currentUser.user_metadata || {},
        preferences: userProfile || {}
      },

      // Données financières
      financial_data: {
        transactions: transactions.map(t => ({
          id: t.id,
          user_id: t.user_id,
          amount: t.amount,
          description: t.description,
          transaction_date: t.transaction_date,
          payment_method: t.payment_method,
          category_id: t.category_id,
          category_name: t.categories?.name || 'Non définie',
          type_id: t.type_id,
          type_name: t.types?.name || 'Non défini',
          created_at: t.created_at,
          updated_at: t.updated_at
        })),

        budgets: budgets.map(b => ({
          id: b.id,
          user_id: b.user_id,
          category_id: b.category_id,
          category_name: b.categories?.name || 'Non définie',
          amount: b.amount,
          period: b.period,
          start_date: b.start_date,
          end_date: b.end_date,
          created_at: b.created_at,
          updated_at: b.updated_at
        }))
      },

      // Catégories de référence (pour validation import)
      reference_data: {
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          color: c.color,
          type: c.type
        }))
      },

      // Statistiques de l'export
      export_statistics: {
        total_transactions: transactions.length,
        total_budgets: budgets.length,
        total_categories_used: [...new Set(transactions.map(t => t.category_id))].length,
        date_range: {
          earliest_transaction: transactions.length > 0 
            ? Math.min(...transactions.map(t => new Date(t.transaction_date).getTime()))
            : null,
          latest_transaction: transactions.length > 0 
            ? Math.max(...transactions.map(t => new Date(t.transaction_date).getTime()))
            : null
        },
        total_revenue: transactions
          .filter(t => t.types?.name === 'revenu')
          .reduce((sum, t) => sum + (t.amount || 0), 0),
        total_expenses: transactions
          .filter(t => t.types?.name === 'depense')
          .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0)
      }
    };

    console.log('✅ Export données complété:', {
      transactions: exportData.financial_data.transactions.length,
      budgets: exportData.financial_data.budgets.length,
      size: JSON.stringify(exportData).length
    });

    return exportData;

  } catch (error) {
    console.error('❌ Erreur export données:', error);
    throw error;
  }
};

/**
 * Récupère le profil utilisateur étendu
 */
const getUserProfile = async (userId) => {
  try {
    // Récupérer les préférences stockées localement ou en base
    const localPreferences = {
      preferred_currency: localStorage.getItem('akuma-budget-currency') || 'CHF',
      preferred_language: 'fr',
      dark_mode: localStorage.getItem('akuma-budget-dark-mode') === 'true',
      favorite_chart: localStorage.getItem('akuma-budget-favorite') || 'pie',
      period_preference: localStorage.getItem('akuma-budget-period') || 'month'
    };

    return localPreferences;
  } catch (error) {
    console.warn('⚠️ Erreur récupération profil:', error);
    return {};
  }
};

/**
 * Génère le nom de fichier d'export
 */
export const generateExportFileName = (format = 'json') => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const userEmail = getCurrentUser()?.email?.split('@')[0] || 'user';
  return `export_akumaBudget_${timestamp}_${userEmail}.${format}`;
};

/**
 * Télécharge les données exportées
 */
export const downloadExportFile = async (format = 'json') => {
  try {
    console.log(`📥 Génération fichier export ${format.toUpperCase()}...`);
    
    const data = await exportUserData();
    const fileName = generateExportFileName(format);
    
    let content;
    let mimeType;
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      content = convertToCSV(data);
      mimeType = 'text/csv';
    } else {
      throw new Error(`Format ${format} non supporté`);
    }
    
    // Créer et télécharger le fichier
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('✅ Fichier téléchargé:', fileName);
    return { success: true, fileName, size: blob.size };
    
  } catch (error) {
    console.error('❌ Erreur téléchargement:', error);
    throw error;
  }
};

/**
 * Convertit les données en format CSV
 */
const convertToCSV = (data) => {
  let csv = '';
  
  // En-tête des métadonnées
  csv += 'AKUMA BUDGET - EXPORT DONNEES\n';
  csv += `Date export: ${data.export_metadata.export_date}\n`;
  csv += `Utilisateur: ${data.export_metadata.user_email}\n`;
  csv += `Transactions: ${data.export_statistics.total_transactions}\n`;
  csv += `Budgets: ${data.export_statistics.total_budgets}\n\n`;
  
  // Transactions
  csv += 'TRANSACTIONS\n';
  csv += 'Date,Description,Montant,Catégorie,Type,Moyen de paiement\n';
  
  data.financial_data.transactions.forEach(t => {
    const row = [
      t.transaction_date,
      `"${t.description || ''}"`,
      t.amount || 0,
      `"${t.category_name || ''}"`,
      `"${t.type_name || ''}"`,
      `"${t.payment_method || ''}"`
    ].join(',');
    csv += row + '\n';
  });
  
  csv += '\n';
  
  // Budgets
  csv += 'BUDGETS\n';
  csv += 'Catégorie,Montant,Période,Date début,Date fin\n';
  
  data.financial_data.budgets.forEach(b => {
    const row = [
      `"${b.category_name || ''}"`,
      b.amount || 0,
      `"${b.period || ''}"`,
      b.start_date || '',
      b.end_date || ''
    ].join(',');
    csv += row + '\n';
  });
  
  return csv;
};

// =====================================================
// FONCTIONS D'IMPORT
// =====================================================

/**
 * Valide la structure d'un fichier d'import
 */
export const validateImportFile = (data) => {
  const errors = [];
  
  try {
    // Vérifier la structure de base
    if (!data || typeof data !== 'object') {
      errors.push('Fichier invalide : format JSON requis');
      return { valid: false, errors };
    }
    
    // Vérifier les métadonnées
    if (!data.export_metadata) {
      errors.push('Métadonnées d\'export manquantes');
    } else {
      if (!data.export_metadata.app_name || data.export_metadata.app_name !== 'Akuma Budget') {
        errors.push('Fichier non compatible avec Akuma Budget');
      }
      
      if (!data.export_metadata.version) {
        errors.push('Version d\'export non spécifiée');
      }
    }
    
    // Vérifier les données financières
    if (!data.financial_data) {
      errors.push('Données financières manquantes');
    } else {
      if (!Array.isArray(data.financial_data.transactions)) {
        errors.push('Liste de transactions invalide');
      }
      
      if (!Array.isArray(data.financial_data.budgets)) {
        errors.push('Liste de budgets invalide');
      }
    }
    
    // Vérifier la cohérence des données
    if (data.financial_data?.transactions) {
      data.financial_data.transactions.forEach((t, index) => {
        if (!t.amount && t.amount !== 0) {
          errors.push(`Transaction ${index + 1}: montant manquant`);
        }
        if (!t.transaction_date) {
          errors.push(`Transaction ${index + 1}: date manquante`);
        }
      });
    }
    
    const isValid = errors.length === 0;
    
    return {
      valid: isValid,
      errors,
      summary: isValid ? {
        transactions: data.financial_data?.transactions?.length || 0,
        budgets: data.financial_data?.budgets?.length || 0,
        export_date: data.export_metadata?.export_date,
        user_email: data.export_metadata?.user_email
      } : null
    };
    
  } catch (error) {
    errors.push(`Erreur validation: ${error.message}`);
    return { valid: false, errors };
  }
};

/**
 * Importe les données utilisateur
 */
export const importUserData = async (fileData, options = {}) => {
  try {
    console.log('📤 Début import données utilisateur...');
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Valider le fichier
    const validation = validateImportFile(fileData);
    if (!validation.valid) {
      throw new Error(`Fichier invalide: ${validation.errors.join(', ')}`);
    }
    
    const { replaceAll = false, skipDuplicates = true } = options;
    const results = {
      transactions: { imported: 0, skipped: 0, errors: 0 },
      budgets: { imported: 0, skipped: 0, errors: 0 }
    };
    
    // Supprimer les données existantes si demandé
    if (replaceAll) {
      console.log('🗑️ Suppression données existantes...');
      await clearUserData(currentUser.id);
    }
    
    // Importer les transactions
    if (fileData.financial_data.transactions) {
      console.log('📊 Import transactions...');
      
      for (const transaction of fileData.financial_data.transactions) {
        try {
          // Vérifier les doublons si demandé
          if (skipDuplicates && await isDuplicateTransaction(transaction)) {
            results.transactions.skipped++;
            continue;
          }
          
          await importTransaction(transaction, currentUser.id);
          results.transactions.imported++;
          
        } catch (error) {
          console.warn('⚠️ Erreur import transaction:', error);
          results.transactions.errors++;
        }
      }
    }
    
    // Importer les budgets
    if (fileData.financial_data.budgets) {
      console.log('💰 Import budgets...');
      
      for (const budget of fileData.financial_data.budgets) {
        try {
          // Vérifier les doublons si demandé
          if (skipDuplicates && await isDuplicateBudget(budget)) {
            results.budgets.skipped++;
            continue;
          }
          
          await importBudget(budget, currentUser.id);
          results.budgets.imported++;
          
        } catch (error) {
          console.warn('⚠️ Erreur import budget:', error);
          results.budgets.errors++;
        }
      }
    }
    
    // Restaurer les préférences si présentes
    if (fileData.user_profile?.preferences) {
      console.log('⚙️ Restauration préférences...');
      restoreUserPreferences(fileData.user_profile.preferences);
    }
    
    console.log('✅ Import complété:', results);
    return { success: true, results };
    
  } catch (error) {
    console.error('❌ Erreur import données:', error);
    throw error;
  }
};

/**
 * Supprime toutes les données utilisateur
 */
const clearUserData = async (userId) => {
  try {
    // Supprimer via l'API
    await Promise.all([
      supabase.from('transactions').delete().eq('user_id', userId),
      supabase.from('budgets').delete().eq('user_id', userId)
    ]);
    
    console.log('✅ Données utilisateur supprimées');
  } catch (error) {
    console.error('❌ Erreur suppression données:', error);
    throw error;
  }
};

/**
 * Vérifie si une transaction est un doublon
 */
const isDuplicateTransaction = async (transaction) => {
  try {
    const { data } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', transaction.user_id)
      .eq('amount', transaction.amount)
      .eq('description', transaction.description)
      .eq('transaction_date', transaction.transaction_date)
      .limit(1);
    
    return data && data.length > 0;
  } catch (error) {
    console.warn('⚠️ Erreur vérification doublon transaction:', error);
    return false;
  }
};

/**
 * Vérifie si un budget est un doublon
 */
const isDuplicateBudget = async (budget) => {
  try {
    const { data } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', budget.user_id)
      .eq('category_id', budget.category_id)
      .eq('amount', budget.amount)
      .eq('period', budget.period)
      .limit(1);
    
    return data && data.length > 0;
  } catch (error) {
    console.warn('⚠️ Erreur vérification doublon budget:', error);
    return false;
  }
};

/**
 * Importe une transaction
 */
const importTransaction = async (transaction, userId) => {
  const transactionData = {
    user_id: userId,
    amount: transaction.amount,
    description: transaction.description,
    transaction_date: transaction.transaction_date,
    payment_method: transaction.payment_method,
    category_id: transaction.category_id,
    type_id: transaction.type_id
  };
  
  const { error } = await supabase
    .from('transactions')
    .insert([transactionData]);
  
  if (error) throw error;
};

/**
 * Importe un budget
 */
const importBudget = async (budget, userId) => {
  const budgetData = {
    user_id: userId,
    category_id: budget.category_id,
    amount: budget.amount,
    period: budget.period,
    start_date: budget.start_date,
    end_date: budget.end_date
  };
  
  const { error } = await supabase
    .from('budgets')
    .insert([budgetData]);
  
  if (error) throw error;
};

/**
 * Restaure les préférences utilisateur
 */
const restoreUserPreferences = (preferences) => {
  try {
    if (preferences.preferred_currency) {
      localStorage.setItem('akuma-budget-currency', preferences.preferred_currency);
    }
    if (preferences.dark_mode !== undefined) {
      localStorage.setItem('akuma-budget-dark-mode', preferences.dark_mode.toString());
    }
    if (preferences.favorite_chart) {
      localStorage.setItem('akuma-budget-favorite', preferences.favorite_chart);
    }
    if (preferences.period_preference) {
      localStorage.setItem('akuma-budget-period', preferences.period_preference);
    }
    
    console.log('✅ Préférences restaurées');
  } catch (error) {
    console.warn('⚠️ Erreur restauration préférences:', error);
  }
};

/**
 * Lit un fichier sélectionné par l'utilisateur
 */
export const readImportFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Aucun fichier sélectionné'));
      return;
    }
    
    if (!file.name.endsWith('.json')) {
      reject(new Error('Format de fichier non supporté. Utilisez un fichier .json'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Fichier JSON invalide'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lecture fichier'));
    };
    
    reader.readAsText(file);
  });
};