import { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { fixedCategoriesApi } from '../api/fixed-categories';

/**
 * Sélecteur de catégories avec types prédéfinis
 * Nouveau système avec catégories fixes
 */
const CategorySelector = ({ 
  selectedTypeId, 
  selectedCategoryId, 
  onTypeChange, 
  onCategoryChange,
  darkMode = false,
  disabled = false,
  error = null 
}) => {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Charger les types au montage
  useEffect(() => {
    loadTypes();
  }, []);

  // Charger les catégories quand le type change
  useEffect(() => {
    if (selectedTypeId) {
      loadCategoriesForType(selectedTypeId);
    } else {
      setCategories([]);
    }
  }, [selectedTypeId]);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const typesData = await fixedCategoriesApi.getTypes();
      setTypes(typesData);
    } catch (error) {
      console.error('Erreur lors du chargement des types:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoriesForType = async (typeId) => {
    try {
      setLoadingCategories(true);
      const categoriesData = await fixedCategoriesApi.getCategoriesByType(typeId);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleTypeChange = (typeId) => {
    onTypeChange(typeId);
    // Reset de la catégorie sélectionnée
    onCategoryChange(null);
  };

  const getTypeColorClass = (color) => {
    const colorMap = {
      green: 'from-green-500 to-emerald-500',
      blue: 'from-blue-500 to-indigo-500',
      orange: 'from-orange-500 to-red-500',
      purple: 'from-purple-500 to-pink-500',
      indigo: 'from-indigo-500 to-purple-500',
      red: 'from-red-500 to-pink-500',
      pink: 'from-pink-500 to-rose-500'
    };
    return colorMap[color] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className={`animate-pulse h-12 rounded-xl ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        <div className={`animate-pulse h-12 rounded-xl ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sélecteur de type */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Type de transaction *
        </label>
        <div className="relative">
          <select
            value={selectedTypeId || ''}
            onChange={(e) => handleTypeChange(e.target.value || null)}
            disabled={disabled}
            className={`w-full px-4 py-3 pr-10 rounded-xl border appearance-none transition-all duration-200 ${
              disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            } ${
              error 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : darkMode 
                  ? 'border-gray-600 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">Sélectionnez un type</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            disabled ? 'text-gray-400' : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </div>
      </div>

      {/* Sélecteur de catégorie */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Catégorie *
        </label>
        
        {!selectedTypeId ? (
          <div className={`w-full px-4 py-3 rounded-xl border text-center ${
            darkMode 
              ? 'border-gray-600 bg-gray-800 text-gray-400' 
              : 'border-gray-300 bg-gray-50 text-gray-500'
          }`}>
            Sélectionnez d&apos;abord un type
          </div>
        ) : loadingCategories ? (
          <div className={`w-full px-4 py-3 rounded-xl border ${
            darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Chargement des catégories...
              </span>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className={`w-full px-4 py-3 rounded-xl border text-center ${
            darkMode 
              ? 'border-gray-600 bg-gray-800 text-gray-400' 
              : 'border-gray-300 bg-gray-50 text-gray-500'
          }`}>
            Aucune catégorie disponible
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              disabled={disabled}
              className={`w-full px-4 py-3 pr-10 rounded-xl border appearance-none transition-all duration-200 ${
                disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${
                error 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              disabled ? 'text-gray-400' : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        )}
      </div>

      {/* Aperçu de la sélection */}
      {selectedTypeId && selectedCategoryId && (
        <div className="mt-4">
          <div className={`p-4 rounded-xl border-2 ${
            darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className={`font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Sélection:
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Type */}
                <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${
                  getTypeColorClass(types.find(t => t.id == selectedTypeId)?.color)
                } text-white text-sm font-medium`}>
                  {types.find(t => t.id == selectedTypeId)?.icon} {types.find(t => t.id == selectedTypeId)?.name}
                </div>
                
                <span className={`mx-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>→</span>
                
                {/* Catégorie */}
                <div className={`px-3 py-1 rounded-lg border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-200' 
                    : 'border-gray-300 bg-white text-gray-700'
                } text-sm font-medium`}>
                  {categories.find(c => c.id == selectedCategoryId)?.icon} {categories.find(c => c.id == selectedCategoryId)?.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
