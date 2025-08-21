# 💰 Akuma Budget - Application de Gestion Financière

> Application moderne de gestion de budget personnel développée avec React 18, Vite et Supabase.

## ✨ Fonctionnalités

- 📊 **Tableaux de bord interactifs** avec graphiques dynamiques (pie, bar, line, area)
- 💳 **Gestion des transactions** par type et catégorie 
- 🎯 **Système de budgets** avec suivi des dépenses
- 🔐 **Authentification sécurisée** avec codes OTP à 6 chiffres
- 🌙 **Mode sombre/clair** adaptatif
- 📱 **Interface responsive** pour mobile et desktop
- 🎨 **Design moderne** avec Tailwind CSS

## 🚀 Démo en ligne

**[👉 Essayer l'application](https://akuma-budget.netlify.app)**

## 🛠️ Technologies

- **Frontend:** React 18.2.0, Vite 4.4.5
- **Styling:** Tailwind CSS 3.3.3
- **Charts:** Recharts 2.12.7
- **Backend:** Supabase (Database + Auth)
- **Icons:** Lucide React
- **Deployment:** Netlify

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/akuma-budget.git
cd akuma-budget

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Démarrer en mode développement
npm run dev
```

## ⚙️ Configuration

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)
2. **Exécuter le schema** depuis `fix-schema-complete.sql`
3. **Configurer les variables** dans `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 🏗️ Scripts disponibles

```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run preview  # Prévisualiser build
npm run lint     # Vérification ESLint
```

## 🎨 Captures d'écran

### Tableau de bord principal
![Dashboard](docs/screenshots/dashboard.png)

### Gestion des transactions
![Transactions](docs/screenshots/transactions.png)

### Mode sombre
![Dark Mode](docs/screenshots/dark-mode.png)

## 🔐 Système d'authentification

- **Inscription** avec codes OTP à 6 chiffres par email
- **Connexion** sécurisée avec Supabase Auth
- **Mode développement** avec code universel `000000`

## 📊 Structure du projet

```
src/
├── components/          # Composants React réutilisables
├── lib/                # Utilitaires et configuration
├── api/                # Appels API Supabase
├── utils/              # Fonctions utilitaires
└── App.jsx            # Composant principal
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

## 🔧 Support

- 📧 Email: support@akuma-budget.com
- 🐛 Issues: [GitHub Issues](https://github.com/votre-username/akuma-budget/issues)
- 📖 Documentation: [docs/](./docs/)

---

💡 **Astuce:** En mode développement, utilisez le code OTP `000000` pour tester l'authentification sans email.