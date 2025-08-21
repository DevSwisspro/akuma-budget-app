import { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, Target } from 'lucide-react';
import { fixedCategoriesApi } from '../api/fixed-categories';

/**
 * Version inline du gestionnaire de budgets (sans modal overlay)
 */
const BudgetManagerInline = ({ darkMode = false, onBudgetChange }) => {
  const [types, setTypes] = useState([]);
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
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type_id || !formData.category_id || !formData.amount) {
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
    // Récupérer le type_id de la catégorie
    const category = categories.find(c => c.id === budget.category_id);
    const type_id = category ? category.type_id : '';
    
    setFormData({
      type_id: type_id.toString(),
      category_id: budget.category_id.toString(),
      amount: budget.amount.toString(),
      period: budget.period
    });
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) return;

    try {
      await fixedCategoriesApi.deleteBudget(budgetId);
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
      
      if (onBudgetChange) onBudgetChange();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur:', err);
    }
  };

  const cancelEdit = () => {
    setEditingBudget(null);
    setFormData({ type_id: '', category_id: '', amount: '', period: 'monthly' });
    setError(null);
  };

  // Filtrer les catégories selon le type sélectionné
  const filteredCategories = categories.filter(category => 
    formData.type_id ? category.type_id.toString() === formData.type_id : false
  );

  // Gestionnaire de changement de type qui remet à zéro la catégorie
  const handleTypeChange = (typeId) => {
    setFormData(prev => ({
      ...prev,
      type_id: typeId,
      category_id: '' // Reset catégorie quand le type change
    }));
  };

  // Formatage des montants
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Formulaire d'ajout/modification */}
      <div className={`rounded-xl p-4 border-2 ${
        darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
      }`}>
        <h3 className="text-lg font-semibold mb-4">
          {editingBudget ? 'Modifier le budget' : 'Ajouter un budget'}
        </h3>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Sélection de type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Type *
              </label>
              <select
                value={formData.type_id}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="">Sélectionner un type</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection de catégorie (filtrée par type) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
                required
                disabled={!formData.type_id}
              >
                <option value="">
                  {!formData.type_id 
                    ? "Sélectionnez d'abord un type" 
                    : "Sélectionner une catégorie"
                  }
                </option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Montant (CHF) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
                placeholder="0.00"
                required
              />
            </div>

            {/* Période */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Période
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Sauvegarde...' : (editingBudget ? 'Modifier' : 'Ajouter')}
            </button>
            
            {editingBudget && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste des budgets existants */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Budgets existants ({budgets.length})
        </h3>
        
        {budgets.length === 0 ? (
          <div className={`text-center py-8 rounded-xl border-2 border-dashed ${
            darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'
          }`}>
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun budget défini</p>
            <p className="text-sm mt-1">Créez votre premier budget ci-dessus</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(budget => (
              <div
                key={budget.id}
                className={`p-4 rounded-xl border ${
                  darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{budget.categories?.icon || '📁'}</span>
                    <div>
                      <h4 className="font-medium">{budget.categories?.name || 'Catégorie'}</h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {budget.categories?.types?.icon} {budget.categories?.types?.name || 'Type'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(budget.amount)}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Par {budget.period === 'monthly' ? 'mois' : 'an'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManagerInline;
