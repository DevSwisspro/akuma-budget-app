/**
 * API pour les types et catégories prédéfinis (lecture seule)
 * Nouvelle architecture avec catégories fixes
 */

import { supabase } from '../lib/supabase';

// ===============================
// API UNIFIÉE SIMPLIFIÉE
// ===============================

/**
 * API principale exportée pour simplifier l'utilisation
 */
export const fixedCategoriesApi = {
  // Types
  getTypes: () => getTypes(),
  getTypeById: (id) => getTypeById(id),
  
  // Catégories
  getCategories: () => getCategories(),
  getCategoriesByType: (typeId) => getCategoriesByType(typeId),
  
  // Transactions
  getUserTransactions: () => getUserTransactions(),
  createTransaction: (transaction) => createTransaction(transaction),
  updateTransaction: (id, updates) => updateTransaction(id, updates),
  deleteTransaction: (id) => deleteTransaction(id),
  
  // Budgets
  getUserBudgets: () => getUserBudgets(),
  createBudget: (budget) => createBudget(budget),
  updateBudget: (id, updates) => updateBudget(id, updates),
  deleteBudget: (id) => deleteBudget(id)
};

// ===============================
// API TYPES DE TRANSACTION
// ===============================

/**
 * Récupérer tous les types de transaction
 */
export const getTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des types:', error);
    throw new Error('Impossible de charger les types de transaction');
  }
};

/**
 * Récupérer un type par son ID
 */
export const getTypeById = async (typeId) => {
  try {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .eq('id', typeId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du type:', error);
    throw new Error('Type introuvable');
  }
};

// ===============================
// API CATÉGORIES PRÉDÉFINIES
// ===============================

/**
 * Récupérer toutes les catégories
 */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        )
      `)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw new Error('Impossible de charger les catégories');
  }
};

/**
 * Récupérer les catégories par type
 */
export const getCategoriesByType = async (typeId) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('type_id', typeId)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories par type:', error);
    throw new Error('Impossible de charger les catégories pour ce type');
  }
};

/**
 * Récupérer les catégories par nom de type
 */
export const getCategoriesByTypeName = async (typeName) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        types!inner (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('types.name', typeName)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories par nom de type:', error);
    throw new Error('Impossible de charger les catégories pour ce type');
  }
};

/**
 * Récupérer une catégorie par son ID
 */
export const getCategoryById = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    throw new Error('Catégorie introuvable');
  }
};

// ===============================
// API TRANSACTIONS AVEC NOUVEAU SCHÉMA
// ===============================

/**
 * Créer une nouvelle transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        amount: transactionData.amount,
        description: transactionData.description,
        type_id: transactionData.type_id,
        category_id: transactionData.category_id,
        transaction_date: transactionData.transaction_date || new Date().toISOString().split('T')[0],
        payment_method: transactionData.payment_method || 'CB'
      }])
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        ),
        categories (
          id,
          name,
          icon,
          color
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de la transaction:', error);
    throw new Error('Impossible de créer la transaction');
  }
};

/**
 * Récupérer les transactions de l'utilisateur connecté
 */
export const getUserTransactions = async (filters = {}) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    let query = supabase
      .from('transactions')
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        ),
        categories (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('user_id', user.id);

    // Appliquer les filtres
    if (filters.type_id) {
      query = query.eq('type_id', filters.type_id);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.start_date) {
      query = query.gte('transaction_date', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('transaction_date', filters.end_date);
    }

    // Tri par date décroissante
    query = query.order('transaction_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw new Error('Impossible de charger les transactions');
  }
};

/**
 * Mettre à jour une transaction
 */
export const updateTransaction = async (transactionId, updates) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .select(`
        *,
        types (
          id,
          name,
          icon,
          color
        ),
        categories (
          id,
          name,
          icon,
          color
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la transaction:', error);
    throw new Error('Impossible de mettre à jour la transaction');
  }
};

/**
 * Supprimer une transaction
 */
export const deleteTransaction = async (transactionId) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction:', error);
    throw new Error('Impossible de supprimer la transaction');
  }
};

// ===============================
// API BUDGETS AVEC NOUVEAU SCHÉMA
// ===============================

/**
 * Créer un nouveau budget
 */
export const createBudget = async (budgetData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        user_id: user.id,
        category_id: budgetData.category_id,
        amount: budgetData.amount,
        period: budgetData.period || 'monthly'
      }])
      .select(`
        *,
        categories (
          id,
          name,
          icon,
          color,
          types (
            id,
            name,
            icon,
            color
          )
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    throw new Error('Impossible de créer le budget');
  }
};

/**
 * Récupérer les budgets de l'utilisateur connecté
 */
export const getUserBudgets = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        categories (
          id,
          name,
          icon,
          color,
          types (
            id,
            name,
            icon,
            color
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    throw new Error('Impossible de charger les budgets');
  }
};

// ===============================
// UTILITAIRES
// ===============================

/**
 * Valider qu'une catégorie appartient à un type
 */
export const validateCategoryType = async (categoryId, typeId) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .eq('type_id', typeId)
      .single();

    if (error || !data) return false;
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Récupérer les statistiques par type
 */
export const getTransactionStatsByType = async (startDate, endDate) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('transactions_view')
      .select('type_name, type_icon, type_color, amount')
      .eq('user_id', user.id)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);

    if (error) throw error;

    // Grouper par type
    const stats = {};
    data.forEach(transaction => {
      const typeName = transaction.type_name;
      if (!stats[typeName]) {
        stats[typeName] = {
          name: typeName,
          icon: transaction.type_icon,
          color: transaction.type_color,
          total: 0,
          count: 0
        };
      }
      stats[typeName].total += parseFloat(transaction.amount);
      stats[typeName].count += 1;
    });

    return Object.values(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw new Error('Impossible de calculer les statistiques');
  }
};

/**
 * Mettre à jour un budget existant
 */
export const updateBudget = async (budgetId, updates) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', budgetId)
      .eq('user_id', user.id)
      .select(`
        *,
        categories (
          id,
          name,
          icon,
          color,
          types (
            id,
            name,
            icon,
            color
          )
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du budget:', error);
    throw new Error('Impossible de mettre à jour le budget');
  }
};

/**
 * Supprimer un budget
 */
export const deleteBudget = async (budgetId) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budgetId)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du budget:', error);
    throw new Error('Impossible de supprimer le budget');
  }
};

// Le fixedCategoriesApi est déjà exporté au début du fichier
