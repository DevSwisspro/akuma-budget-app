import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X, Target } from 'lucide-react';
import { fixedCategoriesApi } from '../api/fixed-categories';

/**
 * Composant de gestion des budgets
 */
const BudgetManager = ({ isOpen, onClose, darkMode = false, onBudgetChange }) => {
  const [setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    type_id: '',
    category_id: '',
    amount: '',
    period: 'monthly'
  });
  const [error, setError] = useState(null);

  // Charger les données initiales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [typesData, categoriesData, budgetsData] = await Promise.all([
        fixedCategoriesApi.getTypes(),
        fixedCategoriesApi.getCategories(),
        fixedCategoriesApi.getUserBudgets()
      ]);
      
      setTypes(typesData);
      setCategories(categoriesData);
      setBudgets(budgetsData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.amount) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const budgetData = {
        category_id: parseInt(formData.category_id),
        amount: parseFloat(formData.amount),
        period: formData.period
      };

      let updatedBudget;
      if (editingBudget) {
        // Mise à jour
        updatedBudget = await fixedCategoriesApi.updateBudget(editingBudget.id, budgetData);
        setBudgets(prev => prev.map(b => b.id === editingBudget.id ? updatedBudget : b));
      } else {
        // Création
        updatedBudget = await fixedCategoriesApi.createBudget(budgetData);
        setBudgets(prev => [...prev, updatedBudget]);
      }

      // Réinitialiser le formulaire
      setFormData({ type_id: '', category_id: '', amount: '', period: 'monthly' });
      setEditingBudget(null);
      
      // Notifier le parent
      if (onBudgetChange) onBudgetChange();
      
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Erreur:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id.toString(),
      amount: budget.amount.toString(),
      period: budget.period
    });
  };

  const handleDelete = async (budgetId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) return;

    try {
      setSaving(true);
      await fixedCategoriesApi.deleteBudget(budgetId);
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
      
      // Notifier le parent
      if (onBudgetChange) onBudgetChange();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur:', err);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingBudget(null);
    setFormData({ category_id: '', amount: '', period: 'monthly' });
    setError(null);
  };

  // Filtrer les catégories qui n'ont pas encore de budget
  const availableCategories = categories.filter(cat => 
    !budgets.some(budget => budget.category_id === cat.id) || 
    (editingBudget && editingBudget.category_id === cat.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">Gestion des budgets</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Formulaire d'ajout/modification */}
            <div className={`rounded-xl p-4 border-2 ${
              darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}>
              <h3 className="text-lg font-semibold mb-4">
                {editingBudget ? 'Modifier le budget' : 'Ajouter un budget'}
              </h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Sélection de catégorie */}
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-blue-500 focus:border-blue-500`}
                    required
                    disabled={saving}
                  >
                    <option value="">Choisir une catégorie</option>
                    {availableCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Montant */}
                <div>
                  <label className="block text-sm font-medium mb-2">Montant (CHF) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0.00"
                    required
                    disabled={saving}
                  />
                </div>

                {/* Période */}
                <div>
                  <label className="block text-sm font-medium mb-2">Période</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-blue-500 focus:border-blue-500`}
                    disabled={saving}
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="yearly">Annuel</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving || !formData.category_id || !formData.amount}
                    className={`flex-1 rounded-xl px-4 py-2 text-white flex items-center justify-center gap-2 ${
                      saving || !formData.category_id || !formData.amount
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {editingBudget ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {editingBudget ? 'Modifier' : 'Ajouter'}
                      </>
                    )}
                  </button>
                  
                  {editingBudget && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={saving}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-3">{error}</p>
              )}
            </div>

            {/* Liste des budgets existants */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Budgets définis ({budgets.length})</h3>
              
              {budgets.length === 0 ? (
                <div className={`text-center py-8 rounded-xl border-2 border-dashed ${
                  darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
                }`}>
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucun budget défini</p>
                  <p className="text-sm">Commencez par ajouter votre premier budget</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {budgets.map(budget => (
                    <div
                      key={budget.id}
                      className={`rounded-xl p-4 border ${
                        darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{budget.categories?.icon || '📁'}</span>
                          <h4 className="font-medium">{budget.categories?.name || 'Catégorie'}</h4>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(budget)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            title="Modifier"
                            disabled={saving}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(budget.id)}
                            className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                            title="Supprimer"
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {new Intl.NumberFormat('fr-CH', { 
                          style: 'currency', 
                          currency: 'CHF' 
                        }).format(budget.amount)}
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {budget.period === 'monthly' ? 'Par mois' : 'Par année'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
