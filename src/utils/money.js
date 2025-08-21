/**
 * Utilitaires pour la gestion des montants et types de transactions
 */

export const normalizeType = (t) => {
  return (t || '').toLowerCase().trim();
};

export const isExpense = (type, amount) => {
  const t = normalizeType(type);
  
  // Types de dépenses selon le schéma Akuma Budget
  if (t.startsWith('depense')) return true;
  if (t === 'dette') return true;
  if (t === 'remboursement') return true;
  if (t === 'epargne') return true;
  if (t === 'investissement') return true;
  
  // Fallback sur le montant si négatif
  if (typeof amount === 'number' && amount < 0) return true;
  
  return false;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CH', { 
    style: 'currency', 
    currency: 'CHF' 
  }).format(value);
};

/**
 * Retourne les classes CSS et le montant formaté pour affichage
 */
export const getAmountDisplay = (amount, type) => {
  const numAmount = Number(amount || 0);
  const expense = isExpense(type, numAmount);
  
  // Couleurs selon le type (pas le signe)
  const colorClasses = expense 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-emerald-600 dark:text-emerald-400';
  
  // Signe : négatif pour les dépenses, positif pour les revenus
  const signedAmount = expense ? -Math.abs(numAmount) : Math.abs(numAmount);
  
  return {
    colorClasses,
    formattedAmount: formatCurrency(signedAmount),
    isExpense: expense
  };
};