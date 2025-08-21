import {} from 'react';
import { Trash2 } from 'lucide-react';
import { isExpense } from '../utils/money.js';
import AmountCell from './AmountCell.jsx';

/**
 * Composant pour afficher la liste des transactions
 */
const TransactionsList = ({ 
  transactions = [], 
  onTransactionRemoved
}) => {
  // Note: Formatage des montants maintenant géré par le composant AmountCell

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transactions (0)
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune transaction pour la période sélectionnée.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Utilisez le formulaire ci-dessus pour ajouter votre première transaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Transactions ({transactions.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Catégorie</th>
              <th className="pb-3 pr-4">Montant</th>
              <th className="pb-3 pr-4">Moyen</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pl-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              return (
                <tr key={t.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 pr-4 text-sm text-gray-900 dark:text-white">
                    {new Date(t.transaction_date || t.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 pr-4">
                    {(() => {
                      const typeIsExpense = isExpense(t.types?.name || t.txType);
                      const badgeClasses = typeIsExpense 
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' 
                        : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300';
                      
                      return (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${badgeClasses}`}>
                          <span>{t.types?.icon || (typeIsExpense ? '💳' : '💰')}</span>
                          {t.types?.name || t.txType || 'Type'}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span>{t.categories?.icon || '📁'}</span>
                      {t.categories?.name || t.categorie || 'Catégorie'}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <AmountCell 
                      amount={t.amount || t.montant || 0}
                      type={t.types?.name || t.txType}
                    />
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-900 dark:text-white uppercase">
                    {t.payment_method || t.moyenPaiement || 'CB'}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-900 dark:text-white">
                    {t.description || 'Transaction'}
                  </td>
                  <td className="py-3 pl-4">
                    {onTransactionRemoved && (
                      <button
                        onClick={() => onTransactionRemoved(t.id)}
                        className="rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
