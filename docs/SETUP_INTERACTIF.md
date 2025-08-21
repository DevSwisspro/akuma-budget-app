# 🚀 Installation Interactive - Akuma Budget

## 📋 **Étape 1 : Créer votre projet Supabase**

### 1.1 Aller sur Supabase
1. Ouvrez votre navigateur
2. Allez sur [supabase.com](https://supabase.com)
3. Cliquez sur "Start your project"

### 1.2 Créer un compte
1. Connectez-vous avec GitHub ou créez un compte
2. Cliquez sur "New Project"

### 1.3 Configurer le projet
- **Nom du projet** : `akuma-budget`
- **Mot de passe de base de données** : Choisissez un mot de passe fort
- **Région** : Europe (pour de meilleures performances)
- Cliquez sur "Create new project"

### 1.4 Attendre l'initialisation
- Le projet prend 2-3 minutes à s'initialiser
- Vous verrez un message "Your project is ready"

---

## 📊 **Étape 2 : Récupérer vos clés API**

### 2.1 Aller dans les paramètres
1. Dans le dashboard Supabase, cliquez sur **Settings** (icône engrenage)
2. Cliquez sur **API**

### 2.2 Noter vos clés
Vous verrez deux informations importantes :
- **Project URL** : `https://xyz.supabase.co`
- **anon public** key : commence par `eyJ...`

### 2.3 Copier ces informations
Gardez ces informations sous la main pour l'étape suivante.

---

## 🗄️ **Étape 3 : Installer la base de données**

### 3.1 Ouvrir l'éditeur SQL
1. Dans le dashboard Supabase, cliquez sur **SQL Editor**
2. Cliquez sur **New query**

### 3.2 Exécuter le script SQL
1. Ouvrez le fichier `supabase-complete-schema.sql` dans votre projet
2. Copiez tout le contenu (Ctrl+A, Ctrl+C)
3. Collez dans l'éditeur SQL de Supabase (Ctrl+V)
4. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

### 3.3 Vérifier l'installation
1. Allez dans **Table Editor**
2. Vérifiez que ces tables existent :
   - ✅ `user_profiles`
   - ✅ `categories`
   - ✅ `custom_categories`
   - ✅ `transactions`
   - ✅ `budgets`

---

## ⚙️ **Étape 4 : Configurer l'application**

### 4.1 Modifier le fichier .env
1. Ouvrez le fichier `.env` dans votre projet
2. Remplacez les valeurs par vos vraies clés :

```bash
VITE_SUPABASE_URL=https://votre-vraie-url.supabase.co
VITE_SUPABASE_ANON_KEY=votre-vraie-cle-anon
VITE_DEV_MODE=false
```

### 4.2 Redémarrer l'application
```bash
npm run dev
```

---

## 🔐 **Étape 5 : Configurer l'authentification**

### 5.1 Activer l'authentification
1. Dans Supabase, allez dans **Authentication** → **Settings**
2. Dans **Auth Providers**, activez **Email**
3. Cliquez sur **Save**

### 5.2 Configurer les redirections
1. Dans **Authentication** → **URL Configuration**
2. Ajoutez ces URLs :
   - **Site URL** : `http://localhost:5173`
   - **Redirect URLs** : 
     - `http://localhost:5173`
     - `http://localhost:5173/auth/callback`

---

## 🧪 **Étape 6 : Tester l'application**

### 6.1 Vérifier l'installation
```bash
npm run verify
```

### 6.2 Créer un compte
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "S'inscrire"
3. Entrez votre email et mot de passe
4. Vérifiez votre email de confirmation

### 6.3 Tester les fonctionnalités
1. ✅ Ajouter des catégories personnalisées
2. ✅ Créer des transactions
3. ✅ Définir des budgets
4. ✅ Voir les statistiques

---

## 🎉 **Félicitations !**

Votre application Akuma Budget est maintenant :
- ✅ Connectée à Supabase
- ✅ Base de données installée
- ✅ Authentification configurée
- ✅ Prête à être utilisée !

---

## 🔧 **En cas de problème**

### Problème : Erreur de connexion
1. Vérifiez vos clés dans le fichier `.env`
2. Vérifiez que le projet Supabase est actif
3. Exécutez `npm run verify`

### Problème : Tables manquantes
1. Vérifiez que le script SQL a été exécuté
2. Vérifiez les logs dans Supabase Dashboard

### Problème : Authentification
1. Vérifiez les URLs de redirection
2. Vérifiez que l'authentification par email est activée

---

## 📞 **Support**

- 📖 Documentation : `INSTALLATION_GUIDE.md`
- 🔧 Script de vérification : `npm run verify`
- 🌐 Supabase Dashboard : [supabase.com](https://supabase.com)

**Votre application est prête ! 🚀**
