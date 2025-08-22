import { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon,
  Tag,
  DollarSign,
  Check,
  AlertCircle,
  LogOut,
  Palette,
  Moon,
  Sun,
  User,
  ChevronRight,
  Info
} from 'lucide-react';
import { signOut } from '../lib/supabase-auth';
import BudgetManagerInline from './BudgetManagerInline';

export default function ModernSettingsModal({ 
  isOpen, 
  onClose, 
  categories, 
  darkMode,
  onDarkModeChange,
  user 
}) {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // États pour les catégories

  // États pour les budgets

  // Onglets de paramètres modernes
  const settingsTabs = [
    { 
      id: 'categories', 
      name: 'Catégories & Types', 
      icon: Tag,
      description: 'Gérez vos catégories de transactions',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'budgets', 
      name: 'Budgets', 
      icon: DollarSign,
      description: 'Configurez vos budgets mensuels',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'appearance', 
      name: 'Apparence', 
      icon: Palette,
      description: 'Personnalisez l&apos;apparence',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'account', 
      name: 'Compte', 
      icon: User,
      description: 'Gérez vos informations',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Types de catégories avec icônes et couleurs modernes
  const categoryTypes = [
    { 
      id: 'revenu', 
      name: 'Revenus', 
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      textColor: 'text-white',
      icon: '💰',
      description: 'Salaires, primes, revenus passifs...'
    },
    { 
      id: 'depense_fixe', 
      name: 'Dépenses Fixes', 
      color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      textColor: 'text-white',
      icon: '🏠',
      description: 'Loyer, assurances, abonnements...'
    },
    { 
      id: 'depense_variable', 
      name: 'Dépenses Variables', 
      color: 'bg-gradient-to-r from-orange-400 to-red-500',
      textColor: 'text-white',
      icon: '🛒',
      description: 'Courses, loisirs, sorties...'
    }
  ];

  // Icônes disponibles modernes

  // Messages de succès/erreur avec auto-disparition
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Fonctions pour gérer les catégories prédéfinies
  const getCategoriesByType = (typeName) => {
    return categories.filter(cat => {
      // Nouveau format: cat.types.name au lieu de cat.type
      return cat.types?.name === typeName;
    });
  };

  // Note: Les catégories sont maintenant prédéfinies et ne peuvent plus être ajoutées/supprimées
  // Ces fonctions sont conservées pour la compatibilité mais désactivées

  const handleLogout = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;
    
    setLoading(true);
    try {
      await signOut();
      onClose();
      showMessage('success', 'Déconnexion réussie');
    } catch (error) {
      showMessage('error', 'Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`relative w-full max-w-7xl max-h-[95vh] mx-4 rounded-3xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        
        {/* Header avec gradient animé */}
        <div className={`relative p-8 ${
          darkMode 
            ? 'bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800' 
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600'
        }`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <SettingsIcon className="h-10 w-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Paramètres
                </h2>
                <p className="text-blue-100 text-lg mt-2">
                  Personnalisez votre expérience Akuma Budget
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-3 rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              <X className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-160px)]">
          {/* Sidebar de navigation ultra-moderne */}
          <div className={`w-96 p-8 border-r ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="space-y-3">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-2xl scale-105 transform'
                        : darkMode
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                          : 'hover:bg-white hover:shadow-xl text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {/* Effet de brillance pour l'onglet actif */}
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent transform -skew-x-12 animate-pulse"></div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-5">
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-white bg-opacity-20 backdrop-blur-sm'
                          : darkMode 
                            ? 'bg-gray-600 group-hover:bg-gray-500'
                            : 'bg-gray-200 group-hover:bg-gray-300'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          activeTab === tab.id 
                            ? 'text-white' 
                            : darkMode 
                              ? 'text-gray-300 group-hover:text-white'
                              : 'text-gray-600 group-hover:text-gray-900'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{tab.name}</div>
                        <div className={`text-sm mt-1 ${
                          activeTab === tab.id 
                            ? 'text-white text-opacity-90' 
                            : darkMode 
                              ? 'text-gray-400 group-hover:text-gray-300'
                              : 'text-gray-500 group-hover:text-gray-600'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'text-white transform rotate-90' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bouton de déconnexion moderne */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <button
                onClick={handleLogout}
                disabled={loading}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group ${
                  darkMode 
                    ? 'bg-gradient-to-r from-red-900 to-pink-900 hover:from-red-800 hover:to-pink-800 text-red-100 hover:text-white' 
                    : 'bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-700 hover:text-red-800'
                } disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <LogOut className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-semibold text-lg">Se déconnecter</span>
              </button>
            </div>
          </div>

          {/* Contenu principal avec scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              
              {/* Message de notification moderne */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
                  message.type === 'success' 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                    : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                }`}>
                  <div className={`p-2 rounded-xl ${
                    message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {message.type === 'success' ? 
                      <Check className="h-5 w-5 text-white" /> : 
                      <AlertCircle className="h-5 w-5 text-white" />
                    }
                  </div>
                  <span className="font-medium">{message.text}</span>
                </div>
              )}

              {/* Contenu des onglets */}
              {activeTab === 'categories' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Gestion des Catégories</h3>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Organisez vos transactions avec des catégories personnalisées
                    </p>
                  </div>

                  {categoryTypes.map((type) => (
                    <div key={type.id} className={`p-6 rounded-2xl border-2 ${
                      darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {/* En-tête de la catégorie */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl ${type.color} ${type.textColor} shadow-lg`}>
                          <span className="text-2xl">{type.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{type.name}</h4>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Catégories existantes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                        {getCategoriesByType(type.id).map(category => (
                          <div
                            key={category.id}
                            className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                              darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium flex-1">{category.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              Prédéfinie
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Message informatif - catégories prédéfinies */}
                      <div className={`p-4 rounded-xl border-2 border-dashed ${
                        darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-100/50'
                      }`}>
                        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Info className="h-5 w-5 inline mr-2" />
                          Les catégories sont prédéfinies et ne peuvent pas être modifiées.
                        </p>
                        <p className={`text-center text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Utilisez les {getCategoriesByType(type.id).length} catégories {type.name.toLowerCase()} disponibles.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'budgets' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Gestion des Budgets</h3>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Configurez vos budgets mensuels par catégorie
                    </p>
                  </div>

                  {/* Intégration directe du BudgetManager Inline */}
                  <BudgetManagerInline
                    darkMode={darkMode}
                    onBudgetChange={() => {
                      // Optionnel: notifier le composant parent si nécessaire
                    }}
                  />
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Apparence</h3>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Personnalisez l&apos;apparence de votre application
                    </p>
                  </div>

                  {/* Toggle mode sombre moderne */}
                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        } shadow-lg`}>
                          {darkMode ? <Moon className="h-8 w-8 text-blue-400" /> : <Sun className="h-8 w-8 text-yellow-500" />}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">Mode {darkMode ? 'Sombre' : 'Clair'}</h4>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {darkMode ? 'Interface sombre pour vos yeux' : 'Interface claire et lumineuse'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDarkModeChange(!darkMode)}
                        className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                          darkMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                          darkMode ? 'translate-x-8' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Informations du Compte</h3>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gérez vos informations personnelles
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{user?.email || 'Utilisateur'}</h4>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Récemment'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de déconnexion */}
                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          darkMode ? 'bg-red-900/30' : 'bg-white'
                        } shadow-lg`}>
                          <LogOut className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">Déconnexion</h4>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Fermer votre session en toute sécurité
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            await signOut();
                            window.location.reload();
                          } catch (error) {
                            console.error('Erreur déconnexion:', error);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                      >
                        <LogOut className="h-5 w-5" />
                        {loading ? 'Déconnexion...' : 'Se déconnecter'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
