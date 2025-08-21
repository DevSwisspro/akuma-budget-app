import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import CategorySelector from './CategorySelector';
import { fixedCategoriesApi } from '../api/fixed-categories';

/**
 * Formulaire d'ajout de transaction avec nouveau système de catégories fixes
 */
const TransactionForm = ({ onTransactionAdded, darkMode = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // États du formulaire
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type_id: null,
    category_id: null,
    amount: '',
    description: '',
    payment_method: 'CB'
  });

  // Moyens de paiement disponibles
  const paymentMethods = [
    { value: 'CB', label: 'CB', icon: '💳' },
    { value: 'Cash', label: 'Cash', icon: '💵' },
    { value: 'Twint', label: 'Twint', icon: '📱' },
    { value: 'Virement', label: 'Virement', icon: '🏦' },
    { value: 'Autre', label: 'Autre', icon: '❓' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.type_id) {
        throw new Error('Veuillez sélectionner un type de transaction');
      }
      if (!formData.category_id) {
        throw new Error('Veuillez sélectionner une catégorie');
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Veuillez saisir un montant positif');
      }

      // Créer la transaction avec la nouvelle structure
      const transactionData = {
        type_id: parseInt(formData.type_id),
        category_id: parseInt(formData.category_id),
        amount: parseFloat(formData.amount),
        description: formData.description.trim() || 'Transaction',
        transaction_date: formData.date,
        payment_method: formData.payment_method || 'CB'
      };

      const newTransaction = await fixedCategoriesApi.createTransaction(transactionData);
      
      // Réinitialiser le formulaire
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type_id: null,
        category_id: null,
        amount: '',
        description: '',
        payment_method: 'CB'
      });

      // Notifier le parent
      if (onTransactionAdded) {
        onTransactionAdded(newTransaction);
      }

    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la création de la transaction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user modifies
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border-2 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-xl">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold">Ajouter une transaction</h2>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Première ligne : Date et Montant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 pr-10 rounded-xl border transition-all duration-200 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                required
              />
              <Calendar className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Montant *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                required
              />
              <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                CHF
              </span>
            </div>
          </div>
        </div>

        {/* Sélecteur de type et catégorie */}
        <CategorySelector
          selectedTypeId={formData.type_id}
          selectedCategoryId={formData.category_id}
          onTypeChange={(typeId) => handleInputChange('type_id', typeId)}
          onCategoryChange={(categoryId) => handleInputChange('category_id', categoryId)}
          darkMode={darkMode}
          disabled={isLoading}
        />

        {/* Troisième ligne : Moyen de paiement et Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Moyen de paiement */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Moyen de paiement
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => handleInputChange('payment_method', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.icon} {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description (optionnelle)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la transaction..."
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
            />
          </div>
        </div>

        {/* Bouton d'ajout */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !formData.type_id || !formData.category_id || !formData.amount}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isLoading || !formData.type_id || !formData.category_id || !formData.amount
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Ajouter
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
