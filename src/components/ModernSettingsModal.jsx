import { useState, useEffect } from 'react';
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
  Info,
  Edit,
  Save,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  FileText,
  Database,
  RefreshCw,
  Shield,
  Plus,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { signOut, updateEmail, changePassword } from '../lib/supabase-auth';
import { 
  downloadExportFile, 
  importUserData, 
  readImportFile, 
  validateImportFile 
} from '../lib/data-export-import';
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

  // États pour la modification d'email
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [emailLoading, setEmailLoading] = useState(false);

  // États pour le changement de mot de passe
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // États pour l'import/export
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importOptions, setImportOptions] = useState({
    replaceAll: false,
    skipDuplicates: true
  });

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
    },
    { 
      id: 'data', 
      name: 'Import / Export', 
      icon: Database,
      description: 'Sauvegardez et restaurez vos données',
      color: 'from-indigo-500 to-blue-500'
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

  const handleEmailUpdate = async () => {
    if (!emailData.newEmail || !emailData.password) {
      showMessage('error', 'Veuillez remplir tous les champs');
      return;
    }

    if (emailData.newEmail === user?.email) {
      showMessage('error', 'Le nouvel email doit être différent de l\'actuel');
      return;
    }

    setEmailLoading(true);
    try {
      const result = await updateEmail(emailData.newEmail, emailData.password);
      
      if (result.success) {
        showMessage('success', result.message || 'Email mis à jour avec succès');
        setEditingEmail(false);
        setEmailData({ newEmail: '', password: '' });
      } else {
        showMessage('error', result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      showMessage('error', 'Erreur inattendue lors de la mise à jour');
    } finally {
      setEmailLoading(false);
    }
  };

  const cancelEmailEdit = () => {
    setEditingEmail(false);
    setEmailData({ newEmail: '', password: '' });
  };

  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage('error', 'Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      showMessage('error', 'Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changePassword(passwordData.oldPassword, passwordData.newPassword);
      
      if (result.success) {
        showMessage('success', result.message || 'Mot de passe changé avec succès');
        setEditingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showMessage('error', result.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      showMessage('error', 'Erreur inattendue lors du changement de mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handlers pour Import/Export
  const handleExportData = async (format = 'json') => {
    setExportLoading(true);
    try {
      await downloadExportFile(format);
      showMessage('success', `Données exportées avec succès au format ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      showMessage('error', 'Erreur lors de l\'export des données');
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportFile(file);
    setImportPreview(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Aperçu basique des données
      setImportPreview({
        totalTransactions: data.transactions?.length || 0,
        totalBudgets: data.budgets?.length || 0,
        totalCategories: data.categories?.length || 0,
        exportDate: data.metadata?.exportDate || 'N/A',
        version: data.metadata?.version || 'N/A'
      });
    } catch (error) {
      showMessage('error', 'Fichier invalide. Veuillez sélectionner un fichier JSON valide.');
      setImportFile(null);
    }
  };

  const handleImportData = async (replaceAll = false) => {
    if (!importFile) {
      showMessage('error', 'Veuillez sélectionner un fichier à importer');
      return;
    }

    setImportLoading(true);
    try {
      const text = await importFile.text();
      const result = await importUserData(JSON.parse(text), { replaceAll });
      
      if (result.success) {
        showMessage('success', `Import réussi: ${result.summary}`);
        setImportFile(null);
        setImportPreview(null);
        // Recharger les données dans l'app
        window.location.reload();
      } else {
        showMessage('error', result.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      showMessage('error', 'Erreur lors de l\'import des données');
    } finally {
      setImportLoading(false);
    }
  };

  const cancelPasswordEdit = () => {
    setEditingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswords({ old: false, new: false, confirm: false });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Gérer le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      // Empêcher le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden';
      // Ajouter un padding-right pour compenser la scrollbar qui disparaît
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Restaurer le scroll du body quand la modal se ferme
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup au démontage du composant
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`relative w-full max-w-7xl max-h-[95vh] mx-2 sm:mx-4 rounded-lg sm:rounded-3xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        
        {/* Header avec gradient animé */}
        <div className={`relative p-4 sm:p-8 ${
          darkMode 
            ? 'bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800' 
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600'
        }`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="relative">
                <div className="p-2 sm:p-4 bg-white bg-opacity-20 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                  <SettingsIcon className="h-6 w-6 sm:h-10 sm:w-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Paramètres
                </h2>
                <p className="text-blue-100 text-sm sm:text-lg mt-1 sm:mt-2">
                  Personnalisez votre expérience Akuma Budget
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              <X className="h-5 w-5 sm:h-7 sm:w-7 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(95vh-120px)] sm:h-[calc(95vh-160px)]">
          {/* Sidebar de navigation ultra-moderne */}
          <div className={`w-full md:w-80 lg:w-96 p-4 sm:p-8 border-b md:border-b-0 md:border-r overflow-x-auto md:overflow-x-visible overflow-y-visible ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-3 pb-4 md:pb-0">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 md:w-full text-left p-3 sm:p-5 rounded-xl md:rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-2xl md:scale-105 transform'
                        : darkMode
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                          : 'hover:bg-white hover:shadow-xl text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {/* Effet de brillance pour l'onglet actif */}
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent transform -skew-x-12 animate-pulse"></div>
                    )}
                    
                    <div className="relative z-10 flex md:flex-row items-center gap-2 md:gap-5">
                      <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-white bg-opacity-20 backdrop-blur-sm'
                          : darkMode 
                            ? 'bg-gray-600 group-hover:bg-gray-500'
                            : 'bg-gray-200 group-hover:bg-gray-300'
                      }`}>
                        <Icon className={`h-4 w-4 md:h-6 md:w-6 ${
                          activeTab === tab.id 
                            ? 'text-white' 
                            : darkMode 
                              ? 'text-gray-300 group-hover:text-white'
                              : 'text-gray-600 group-hover:text-gray-900'
                        }`} />
                      </div>
                      <div className="flex-1 hidden md:block">
                        <div className="font-semibold text-sm md:text-lg">{tab.name}</div>
                        <div className={`text-xs md:text-sm mt-1 ${
                          activeTab === tab.id 
                            ? 'text-white text-opacity-90' 
                            : darkMode 
                              ? 'text-gray-400 group-hover:text-gray-300'
                              : 'text-gray-500 group-hover:text-gray-600'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                      <ChevronRight className={`h-3 w-3 md:h-5 md:w-5 transition-all duration-300 hidden md:block ${
                        activeTab === tab.id 
                          ? 'text-white transform rotate-90' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Contenu principal avec scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-8">
              
              {/* Message de notification moderne */}
              {message.text && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 animate-in slide-in-from-top duration-300 ${
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
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Gestion des Catégories</h3>
                    <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Organisez vos transactions avec des catégories personnalisées
                    </p>
                  </div>

                  {categoryTypes.map((type) => (
                    <div key={type.id} className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 sm:mb-6">
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
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Gestion des Budgets</h3>
                    <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Apparence</h3>
                    <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Personnalisez l&apos;apparence de votre application
                    </p>
                  </div>

                  {/* Toggle mode sombre moderne */}
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
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
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Informations du Compte</h3>
                    <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gérez vos informations personnelles
                    </p>
                  </div>

                  {/* Informations du compte */}
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg sm:text-xl font-bold">Adresse email</h4>
                          {!editingEmail && (
                            <button
                              onClick={() => setEditingEmail(true)}
                              className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${
                                darkMode 
                                  ? 'text-blue-400 hover:bg-blue-400' 
                                  : 'text-blue-600 hover:bg-blue-600'
                              }`}
                              title="Modifier l'adresse email"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        {!editingEmail ? (
                          <div>
                            <p className="text-sm sm:text-base font-medium break-all">{user?.email || 'Utilisateur'}</p>
                            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'Récemment'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Nouvelle adresse email
                              </label>
                              <input
                                type="email"
                                value={emailData.newEmail}
                                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border ${
                                  darkMode 
                                    ? 'border-gray-600 bg-gray-700 text-white' 
                                    : 'border-gray-300 bg-white text-gray-900'
                                } focus:ring-2 focus:ring-blue-500`}
                                placeholder="nouveau@email.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Mot de passe actuel (requis)
                              </label>
                              <input
                                type="password"
                                value={emailData.password}
                                onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border ${
                                  darkMode 
                                    ? 'border-gray-600 bg-gray-700 text-white' 
                                    : 'border-gray-300 bg-white text-gray-900'
                                } focus:ring-2 focus:ring-blue-500`}
                                placeholder="Votre mot de passe"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={handleEmailUpdate}
                                disabled={emailLoading || !emailData.newEmail || !emailData.password}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Save className="h-4 w-4" />
                                {emailLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                              </button>
                              <button
                                onClick={cancelEmailEdit}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section changement de mot de passe */}
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                        <Lock className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg sm:text-xl font-bold">Mot de passe</h4>
                          {!editingPassword && (
                            <button
                              onClick={() => setEditingPassword(true)}
                              className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${
                                darkMode 
                                  ? 'text-blue-400 hover:bg-blue-400' 
                                  : 'text-blue-600 hover:bg-blue-600'
                              }`}
                              title="Modifier le mot de passe"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        {!editingPassword ? (
                          <div>
                            <p className="text-sm sm:text-base font-medium">••••••••••••</p>
                            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Cliquez sur modifier pour changer votre mot de passe
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Ancien mot de passe */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Ancien mot de passe
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.old ? "text" : "password"}
                                  value={passwordData.oldPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                  className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                                    darkMode 
                                      ? 'border-gray-600 bg-gray-700 text-white' 
                                      : 'border-gray-300 bg-white text-gray-900'
                                  } focus:ring-2 focus:ring-blue-500`}
                                  placeholder="Votre mot de passe actuel"
                                />
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility('old')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Nouveau mot de passe */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Nouveau mot de passe
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.new ? "text" : "password"}
                                  value={passwordData.newPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                  className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                                    darkMode 
                                      ? 'border-gray-600 bg-gray-700 text-white' 
                                      : 'border-gray-300 bg-white text-gray-900'
                                  } focus:ring-2 focus:ring-blue-500`}
                                  placeholder="Au moins 6 caractères"
                                />
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility('new')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Confirmation nouveau mot de passe */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Confirmer le nouveau mot de passe
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.confirm ? "text" : "password"}
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                                    passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                                      ? 'border-red-500 ring-1 ring-red-500'
                                      : darkMode 
                                        ? 'border-gray-600 bg-gray-700 text-white' 
                                        : 'border-gray-300 bg-white text-gray-900'
                                  } focus:ring-2 focus:ring-blue-500`}
                                  placeholder="Répétez le nouveau mot de passe"
                                />
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility('confirm')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Save className="h-4 w-4" />
                                {passwordLoading ? 'Sauvegarde...' : 'Changer le mot de passe'}
                              </button>
                              <button
                                onClick={cancelPasswordEdit}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bouton de déconnexion */}
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
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

              {/* Import / Export */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  {/* Export Section */}
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
                    darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-4 rounded-2xl ${
                        darkMode ? 'bg-blue-900/30' : 'bg-white'
                      } shadow-lg`}>
                        <Download className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Exporter vos données</h4>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Sauvegardez toutes vos données financières
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleExportData('json')}
                        disabled={exportLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        {exportLoading ? 'Export...' : 'Exporter JSON'}
                      </button>
                      <button
                        onClick={() => handleExportData('csv')}
                        disabled={exportLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        {exportLoading ? 'Export...' : 'Exporter CSV'}
                      </button>
                    </div>
                  </div>

                  {/* Import Section */}
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
                    darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-4 rounded-2xl ${
                        darkMode ? 'bg-purple-900/30' : 'bg-white'
                      } shadow-lg`}>
                        <Upload className="h-8 w-8 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Importer vos données</h4>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Restaurez vos données depuis un fichier d'export
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* File Input */}
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                          className="hidden"
                          id="import-file"
                        />
                        <label
                          htmlFor="import-file"
                          className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            darkMode 
                              ? 'border-gray-600 hover:border-purple-500 text-gray-300 hover:text-purple-400' 
                              : 'border-gray-300 hover:border-purple-500 text-gray-600 hover:text-purple-600'
                          }`}
                        >
                          <FileText className="h-5 w-5" />
                          {importFile ? importFile.name : 'Sélectionner un fichier JSON'}
                        </label>
                      </div>

                      {/* Import Preview */}
                      {importPreview && (
                        <div className={`p-4 rounded-lg border ${
                          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <h5 className="font-semibold mb-2">Aperçu du fichier :</h5>
                          <div className="text-sm space-y-1">
                            <p>• Transactions : {importPreview.totalTransactions}</p>
                            <p>• Budgets : {importPreview.totalBudgets}</p>
                            <p>• Catégories : {importPreview.totalCategories}</p>
                            <p>• Exporté le : {new Date(importPreview.exportDate).toLocaleString('fr-FR')}</p>
                            <p>• Version : {importPreview.version}</p>
                          </div>
                        </div>
                      )}

                      {/* Import Options */}
                      {importFile && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleImportData(false)}
                            disabled={importLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            {importLoading ? 'Import...' : 'Fusionner les données'}
                          </button>
                          <button
                            onClick={() => handleImportData(true)}
                            disabled={importLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            {importLoading ? 'Import...' : 'Remplacer tout'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avertissement */}
                  <div className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold">Important :</p>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                          <li>Fusionner : Ajoute les nouvelles données sans supprimer les existantes</li>
                          <li>Remplacer : Supprime toutes les données actuelles et les remplace</li>
                          <li>Nous recommandons d'exporter vos données actuelles avant d'importer</li>
                        </ul>
                      </div>
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
