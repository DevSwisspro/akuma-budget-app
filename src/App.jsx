import { useMemo, useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Wallet,
  Plus,
  Search,
  Star,
  Settings as SettingsIcon,
  Moon,
  Sun,
  LogIn,
  LogOut,
} from "lucide-react";
import ModernSettingsModal from "./components/ModernSettingsModal";
import AuthModal from "./components/AuthModal";
import TransactionForm from "./components/TransactionForm";
import TransactionsList from "./components/TransactionsList";
import BudgetManager from "./components/BudgetManager";

import { fixedCategoriesApi } from "./api/fixed-categories";
import { 
  getCurrentUser, 
  signOut, 
  onAuthStateChange
} from './lib/supabase-auth';

// ---------- helpers ----------
const CHF = new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF" });
const fmt = (n) => CHF.format(n || 0);

// Fonctions ISO date supprimées - TransactionForm gère les dates

// Couleurs supprimées - Utilisation des couleurs depuis Supabase categories

// NOUVEAU SYSTÈME: Les catégories sont maintenant prédéfinies en base de données
// Plus besoin de DEFAULT_CATEGORIES - tout est géré par le schéma Supabase

// Ancien système supprimé - types et catégories maintenant en base de données

// Types de graphiques disponibles
const CHART_TYPES = [
  { id: "pie", name: "Camembert", icon: "🥧" },
  { id: "bar", name: "Barres", icon: "📊" },
  { id: "line", name: "Courbe", icon: "📈" },
  { id: "area", name: "Aire", icon: "🌊" },
];

// Périodes disponibles
const PERIODS = [
  { id: "month", name: "Mois", icon: "📅" },
  { id: "quarter", name: "Trimestre", icon: "📊" },
  { id: "year", name: "Année", icon: "📆" },
  { id: "custom", name: "Personnalisé", icon: "⚙️" },
];

export default function App() {
  // États principaux
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);


  // États de configuration
  const [chartType, setChartType] = useState(() => {
    const saved = localStorage.getItem('akuma-budget-chart-type');
    return saved || "pie";
  });
  
  const [period, setPeriod] = useState(() => {
    const saved = localStorage.getItem('akuma-budget-period');
    return saved || "month";
  });
  
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favoriteChart, setFavoriteChart] = useState(() => {
    const saved = localStorage.getItem('akuma-budget-favorite');
    return saved || "pie";
  });
  
  // États UI
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('akuma-budget-dark-mode');
    return saved === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  // Ancien formulaire supprimé - utilisation du TransactionForm unifié

  // Initialisation et chargement des données
  useEffect(() => {
    initializeApp();
  }, []);

  // Écouteur de changement d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChange((event, session) => {
      console.log('Changement d\'état d\'authentification:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        initializeApp();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCategories([]);
        setTransactions([]);
        setBudgets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sauvegarder les préférences dans localStorage
  useEffect(() => {
    localStorage.setItem('akuma-budget-chart-type', chartType);
  }, [chartType]);

  useEffect(() => {
    localStorage.setItem('akuma-budget-period', period);
  }, [period]);

  useEffect(() => {
    localStorage.setItem('akuma-budget-favorite', favoriteChart);
  }, [favoriteChart]);

  useEffect(() => {
    localStorage.setItem('akuma-budget-dark-mode', darkMode.toString());
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fonction getCategoryConfig supprimée - Les données viennent directement de Supabase

  // getFilteredCategories supprimée - CategorySelector gère le filtrage

  const getFilteredTransactions = useCallback(() => {
    let filtered = transactions;

    // Filtre par période
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "month":
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
        break;
      case "quarter": {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate.setMonth(quarter * 3);
        startDate.setDate(1);
        break;
      }
      case "year":
        startDate.setMonth(0);
        startDate.setDate(1);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          return transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= new Date(customStartDate) && txDate <= new Date(customEndDate);
          });
        }
        break;
    }

    if (period !== "custom") {
      filtered = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date || t.date);
        return transactionDate >= startDate;
      });
    }

    // Filtre par catégorie sélectionnée - NOUVEAU SYSTÈME
    if (selectedCategory) {
      filtered = filtered.filter(t => {
        const categoryName = t.categories?.name || t.categorie;
        return categoryName === selectedCategory;
      });
    }

    // Filtre par recherche - NOUVEAU SYSTÈME
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => {
        const description = (t.description || '').toLowerCase();
        const categoryName = (t.categories?.name || t.categorie || '').toLowerCase();
        const paymentMethod = (t.payment_method || t.moyenPaiement || '').toLowerCase();
        const typeName = (t.types?.name || t.txType || '').toLowerCase();
        
        return description.includes(query) ||
               categoryName.includes(query) ||
               paymentMethod.includes(query) ||
               typeName.includes(query);
      });
    }

    return filtered;
  }, [transactions, period, customStartDate, customEndDate, selectedCategory, searchQuery]);

  const filteredTx = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);

  // Calculs des statistiques
  const sums = useMemo(() => {
    let revenus = 0, depenses = 0;
    for (const t of filteredTx) {
      const amount = Number(t.amount || t.montant || 0);
      const typeName = t.types?.name || t.txType;
      
      if (typeName === "revenu") {
        revenus += amount; 
      } else {
        depenses += Math.abs(amount);
      }
    }
    return { revenus, depenses, solde: revenus - depenses };
  }, [filteredTx]);

  // Calcul automatique des dépenses par budget - NOUVEAU SYSTÈME SUPABASE
  const budgetsWithSpending = useMemo(() => {
    return budgets.map(budget => {
      // Trouve les transactions pour cette catégorie
      const transactionsForCategory = filteredTx.filter(t => {
        const categoryId = t.category_id || (t.categories ? t.categories.id : null);
        const typeName = t.types?.name || t.txType;
        return categoryId === budget.category_id && typeName !== "revenu";
      });
      
      const totalDepense = transactionsForCategory.reduce((sum, t) => {
        const amount = Number(t.amount || t.montant || 0);
        return sum + Math.abs(amount);
      }, 0);
      
      return { ...budget, depense: totalDepense };
    });
  }, [budgets, filteredTx]);

  // Données pour les graphiques - NOUVEAU SYSTÈME
  const chartData = useMemo(() => {
    const byCat = {};
    for (const t of filteredTx) {
      const typeName = t.types?.name || t.txType;
      const categoryName = t.categories?.name || t.categorie;
      const amount = Number(t.amount || t.montant || 0);
      
      if (typeName !== "revenu") {
        byCat[categoryName] = (byCat[categoryName] || 0) + Math.abs(amount);
      }
    }
    return Object.entries(byCat)
      .map(([name, value]) => {
        // Couleur par défaut pour les graphiques
        const defaultColors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];
        const colorIndex = Object.keys(byCat).indexOf(name) % defaultColors.length;
        
        return { 
          name, 
          value: Number(value), // S'assurer que value est numérique
          fill: defaultColors[colorIndex],
          icon: "📁" // Icône par défaut
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTx]);

  // Données pour graphique temporel
  const timeSeriesData = useMemo(() => {
    const byMonth = {};
    for (const t of filteredTx) {
      const date = new Date(t.transaction_date || t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth[monthKey]) byMonth[monthKey] = { revenus: 0, depenses: 0 };
      
      const typeName = t.types?.name || t.txType;
      const amount = Number(t.amount || t.montant || 0);
      
      if (typeName === "revenu") {
        byMonth[monthKey].revenus += amount;
      } else {
        byMonth[monthKey].depenses += Math.abs(amount);
      }
    }
    
    return Object.entries(byMonth)
      .map(([month, data]) => ({
        month,
        revenus: Number(data.revenus),
        depenses: Number(data.depenses),
        net: Number(data.revenus - data.depenses)
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredTx]);

  // Gestion de l'authentification
  const handleAuthSuccess = (user) => {
    setUser(user);
    if (user) {
      // Recharger les données après connexion
      initializeApp();
    } else {
      // Déconnexion - vider les données
      setCategories([]);
      setTransactions([]);
      setBudgets([]);
    }
  };

  // Gestion de la déconnexion
  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        setUser(null);
        setCategories([]);
        setTransactions([]);
        setBudgets([]);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Gestionnaire pour l'ajout de transaction
  const handleTransactionAdded = (newTransaction) => {
    console.log('Nouvelle transaction ajoutée:', newTransaction);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Gestionnaire pour la suppression de transaction
  const handleTransactionRemoved = async (transactionId) => {
    try {
      await fixedCategoriesApi.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };



  const initializeApp = async () => {
    try {
      (true);
      
      // Vérifier l'authentification
      let currentUser = null;
      try {
        currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (authError) {
        console.log('Erreur d\'authentification:', authError);
        // En cas d'erreur, on continue en mode démo
        setCategories([]);
        setTransactions([]);
        setBudgets([]);
        (false);
        return;
      }

      if (!currentUser) {
        console.log('Aucun utilisateur connecté - mode démo');
        // En mode démo, on utilise des données mock
        setCategories([]);
        setTransactions([]);
        setBudgets([]);
        (false);
        return;
      }

      if (currentUser) {
        // Charger les catégories prédéfinies (globales, pas par utilisateur)
        const allCategories = await fixedCategoriesApi.getCategories();
        setCategories(allCategories);

        // Charger les transactions avec la nouvelle API
        const userTransactions = await fixedCategoriesApi.getUserTransactions();
        setTransactions(userTransactions);

        // Charger les budgets avec la nouvelle API
        const userBudgets = await fixedCategoriesApi.getUserBudgets();
        console.log('Budgets chargés depuis Supabase:', userBudgets);
        setBudgets(userBudgets);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    } finally {
      (false);
    }
  };

  // Gestion des transactions avec TransactionForm unifié


  // Composant de graphique dynamique
  const DynamicChart = ({ data, type, title, height = 400 }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex h-80 items-center justify-center text-neutral-500 dark:text-neutral-400">
          Aucune donnée pour cette période
        </div>
      );
    }

    const renderChart = () => {
      switch (type) {
        case "pie":
          return (
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ReTooltip 
                  formatter={(value) => fmt(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#374151" : "rgba(255,255,255,0.98)", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    padding: 8,
                    color: darkMode ? "#f9fafb" : "#000"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          );

        case "bar": {
          const maxValue = Math.max(...data.map(d => Number(d.value) || 0));
          const formatYAxis = (value) => {
            if (maxValue >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (maxValue >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value.toString();
          };
          
          return (
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f0f0f0"} />
                <XAxis dataKey="name" tick={{ fontSize: 14, fill: darkMode ? "#f9fafb" : "#666" }} />
                <YAxis 
                  domain={[0, 'dataMax + 500']}
                  tick={{ fontSize: 14, fill: darkMode ? "#f9fafb" : "#666" }} 
                  tickFormatter={formatYAxis} 
                />
                <ReTooltip 
                  formatter={(value) => fmt(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#374151" : "rgba(255,255,255,0.98)", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    padding: 12,
                    color: darkMode ? "#f9fafb" : "#000"
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          );
        }

        case "line": {
          const maxLineValue = Math.max(
            ...timeSeriesData.flatMap(d => [Number(d.revenus) || 0, Number(d.depenses) || 0, Number(d.net) || 0])
          );
          const formatLineYAxis = (value) => {
            if (maxLineValue >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (maxLineValue >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value.toString();
          };
          
          return (
            <ResponsiveContainer width="100%" height={height}>
              <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f0f0f0"} />
                <XAxis dataKey="month" tick={{ fontSize: 14, fill: darkMode ? "#f9fafb" : "#666" }} />
                <YAxis 
                  domain={['dataMin - 200', 'dataMax + 300']}
                  tick={{ fontSize: 14, fill: darkMode ? "#f9fafb" : "#666" }} 
                  tickFormatter={formatLineYAxis} 
                />
                <ReTooltip 
                  formatter={(value) => fmt(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#374151" : "rgba(255,255,255,0.98)", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    padding: 12,
                    color: darkMode ? "#f9fafb" : "#000"
                  }}
                />
                <Line type="monotone" dataKey="revenus" stroke="#22c55e" strokeWidth={4} dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={4} dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={4} strokeDasharray="5 5" dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          );
        }

        case "area": {
          const maxAreaValue = Math.max(
            ...timeSeriesData.flatMap(d => [Number(d.revenus) || 0, Number(d.depenses) || 0])
          );
          const formatAreaYAxis = (value) => {
            if (maxAreaValue >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (maxAreaValue >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value.toString();
          };
          
          return (
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f0f0f0"} />
                <XAxis dataKey="month" tick={{ fontSize: 14, fill: darkMode ? "#f9fafb" : "#666" }} />
                <YAxis 
                  domain={[0, 'dataMax + 400']}
                  tick={{ fontSize: 14, fill: darkMode ? "#f9fafb" : "#666" }} 
                  tickFormatter={formatAreaYAxis} 
                />
                <ReTooltip 
                  formatter={(value) => fmt(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#374151" : "rgba(255,255,255,0.98)", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    padding: 12,
                    color: darkMode ? "#f9fafb" : "#000"
                  }}
                />
                <Area type="monotone" dataKey="depenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Area type="monotone" dataKey="revenus" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          );
        }

        default:
          return <div>Aucun graphique disponible</div>;
      }
    };

    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={() => setFavoriteChart(type)}
            className={`p-2 rounded-lg transition-colors ${
              favoriteChart === type 
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={favoriteChart === type ? "Graphique favori" : "Définir comme favori"}
          >
            <Star className={`h-4 w-4 ${favoriteChart === type ? 'fill-current' : ''}`} />
          </button>
        </div>
        {renderChart()}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-neutral-50'} transition-colors duration-200`}>
      <div className="mx-auto max-w-7xl space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Akuma Budget</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gestion de budget personnelle</p>
            </div>
          </div>
                     <div className="flex items-center gap-3">
             {user ? (
               <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-600 dark:text-gray-400">
                   {user.email}
                 </span>
                 <button
                   onClick={() => setShowSettings(true)}
                   className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                   title="Paramètres"
                 >
                   <SettingsIcon className="h-5 w-5" />
                 </button>
                 <button
                   onClick={handleSignOut}
                   className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                   title="Se déconnecter"
                 >
                   <LogOut className="h-4 w-4" />
                   Déconnexion
                 </button>
               </div>
             ) : (
               <button
                 onClick={() => setShowAuth(true)}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
               >
                 <LogIn className="h-4 w-4" />
                 Se connecter
               </button>
             )}
             <button
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
             >
               {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
             </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 pl-10 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Nouveau formulaire unifié */}
        {user && (
          <TransactionForm 
            onTransactionAdded={handleTransactionAdded}
            darkMode={darkMode}
          />
        )}

        {/* Indicateurs principaux - Affichés seulement si des données existent */}
        {(sums.revenus > 0 || sums.depenses > 0 || filteredTx.length > 0) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {sums.revenus > 0 && (
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(sums.revenus)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Revenus</div>
              </div>
            )}
            {sums.depenses > 0 && (
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="text-3xl font-bold text-red-600">{fmt(sums.depenses)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dépenses</div>
              </div>
            )}
            {(sums.revenus > 0 || sums.depenses > 0) && (
              <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-6 shadow-sm border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{fmt(sums.solde)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Solde</div>
              </div>
            )}
          </div>
        )}

        {/* Contrôles */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration</h3>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Sélection du type de graphique */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Graphique:</span>
                <div className="flex gap-1">
                  {CHART_TYPES.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => setChartType(chart.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === chart.id 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={chart.name}
                    >
                      <span className="text-sm">{chart.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection de la période */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Période:</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Période personnalisée */}
              {period === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graphique principal - UNIQUEMENT celui sélectionné */}
        {/* Graphique principal - Affiché seulement si des données existent */}
        {(chartData.length > 0 || timeSeriesData.length > 0 || filteredTx.length > 0) && (
          <DynamicChart 
            data={chartType === "line" || chartType === "area" ? timeSeriesData : chartData} 
            type={chartType} 
            title={`${chartType === "pie" ? "Répartition des dépenses" : 
                    chartType === "bar" ? "Dépenses par catégorie" : 
                    chartType === "line" ? "Évolution temporelle" : 
                    "Volume des finances"} - ${selectedCategory || 'Toutes catégories'}`}
          />
        )}

        {/* Section Budgets */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budgets</h2>
            <button
              onClick={() => setShowBudgetManager(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Gérer les budgets
            </button>
          </div>
          
          {budgetsWithSpending.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {budgetsWithSpending.map((budget) => {
                const percentage = (budget.depense / budget.amount) * 100;
                const isOverBudget = percentage > 100;
                const isAtBudget = Math.abs(percentage - 100) < 0.1; // Exactement à 100% (avec petite marge d'erreur)
                const isNearLimit = percentage > 80;
                const categoryName = budget.categories?.name || 'Catégorie';
                const categoryIcon = budget.categories?.icon || '📁';
                
                return (
                  <div
                    key={budget.id}
                    onClick={() => setSelectedCategory(selectedCategory === categoryName ? "" : categoryName)}
                    className={`rounded-xl border p-4 hover:shadow-md transition-all text-left ${
                      selectedCategory === categoryName
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{categoryIcon}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isOverBudget 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : isNearLimit 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white mb-1">{categoryName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {fmt(budget.depense)} / {fmt(budget.amount)}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isOverBudget 
                            ? 'bg-red-500'     // Rouge si > 100%
                            : isAtBudget 
                            ? 'bg-yellow-500'  // Jaune si exactement 100%
                            : 'bg-green-500'   // Vert si < 100%
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-lg font-medium mb-1">Aucun budget défini</div>
              <div className="text-sm">Cliquez sur "Gérer les budgets" pour commencer</div>
            </div>
          )}
        </div>

        {/* Transactions */}
        <TransactionsList 
          transactions={filteredTx}
          onTransactionRemoved={handleTransactionRemoved}
          darkMode={darkMode}
        />

        {/* Composant ModernSettingsModal */}
        <ModernSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          categories={categories}
          onCategoriesChange={setCategories}
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          user={user}
        />

        {/* Composant BudgetManager */}
        <BudgetManager
          isOpen={showBudgetManager}
          onClose={() => setShowBudgetManager(false)}
          darkMode={darkMode}
        />

        {/* Composant AuthModal */}
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}
