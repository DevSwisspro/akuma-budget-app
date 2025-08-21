# 🚀 Guide d'Installation Complète - Akuma Budget

## 📋 Prérequis

- ✅ Compte Supabase (gratuit)
- ✅ Node.js 18+ installé
- ✅ Git installé

## 🗄️ Étape 1 : Créer le projet Supabase

### 1.1 Créer un compte Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur "Start your project"
3. Se connecter avec GitHub ou créer un compte

### 1.2 Créer un nouveau projet
1. Cliquer sur "New Project"
2. Choisir votre organisation
3. Remplir les informations :
   - **Nom du projet** : `akuma-budget`
   - **Mot de passe de base de données** : Choisir un mot de passe fort
   - **Région** : Choisir la plus proche (Europe pour la Suisse)
4. Cliquer sur "Create new project"
5. Attendre que le projet soit initialisé (2-3 minutes)

### 1.3 Récupérer les clés d'API
1. Dans le dashboard Supabase, aller dans **Settings** → **API**
2. Noter :
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key (commence par `eyJ...`)

## 🗄️ Étape 2 : Installer la base de données

### 2.1 Ouvrir l'éditeur SQL
1. Dans le dashboard Supabase, aller dans **SQL Editor**
2. Cliquer sur **New query**

### 2.2 Exécuter le script SQL
1. Copier tout le contenu du fichier `supabase-complete-schema.sql`
2. Coller dans l'éditeur SQL
3. Cliquer sur **Run** (ou Ctrl+Enter)
4. Attendre que toutes les tables soient créées

### 2.3 Vérifier l'installation
1. Aller dans **Table Editor**
2. Vérifier que les tables suivantes existent :
   - ✅ `user_profiles`
   - ✅ `categories`
   - ✅ `custom_categories`
   - ✅ `transactions`
   - ✅ `budgets`

## 🔧 Étape 3 : Configurer l'application

### 3.1 Créer le fichier .env
1. Dans le dossier du projet, créer un fichier `.env`
2. Ajouter les variables suivantes :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important** : Remplacer par vos vraies valeurs de Supabase !

### 3.2 Installer les dépendances
```bash
npm install
```

### 3.3 Démarrer l'application
```bash
npm run dev
```

## 🔐 Étape 4 : Configurer l'authentification

### 4.1 Activer l'authentification par email
1. Dans Supabase, aller dans **Authentication** → **Settings**
2. Dans **Auth Providers**, activer **Email**
3. Optionnel : Configurer les templates d'email

### 4.2 Configurer les redirections
1. Dans **Authentication** → **URL Configuration**
2. Ajouter les URLs de redirection :
   - **Site URL** : `http://localhost:5173`
   - **Redirect URLs** : 
     - `http://localhost:5173`
     - `http://localhost:5173/auth/callback`

## 🧪 Étape 5 : Tester l'application

### 5.1 Créer un compte utilisateur
1. Ouvrir l'application dans le navigateur
2. Cliquer sur "S'inscrire"
3. Entrer email et mot de passe
4. Vérifier l'email de confirmation

### 5.2 Tester les fonctionnalités
1. ✅ Ajouter des catégories personnalisées
2. ✅ Créer des transactions
3. ✅ Définir des budgets
4. ✅ Voir les statistiques

## 🔧 Étape 6 : Configuration avancée (optionnel)

### 6.1 Configurer les emails
1. Dans **Authentication** → **Email Templates**
2. Personnaliser les templates d'inscription/confirmation

### 6.2 Configurer les politiques RLS
Les politiques sont déjà configurées, mais vous pouvez les vérifier :
1. Aller dans **Authentication** → **Policies**
2. Vérifier que toutes les tables ont des politiques RLS

### 6.3 Configurer le stockage (si nécessaire)
1. Aller dans **Storage**
2. Créer un bucket pour les fichiers si nécessaire

## 🚀 Étape 7 : Déploiement en production

### 7.1 Préparer pour la production
1. Créer un nouveau projet Supabase pour la production
2. Exécuter le même script SQL
3. Configurer les variables d'environnement de production

### 7.2 Déployer l'application
1. Utiliser Vercel, Netlify ou autre service
2. Configurer les variables d'environnement
3. Déployer !

## 🔧 Dépannage

### Problème : "Failed to resolve import @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
```

### Problème : Erreur de connexion à Supabase
1. Vérifier les variables d'environnement
2. Vérifier que l'URL et la clé sont correctes
3. Vérifier que le projet Supabase est actif

### Problème : Erreur RLS
1. Vérifier que l'utilisateur est connecté
2. Vérifier les politiques dans Supabase
3. Vérifier les logs dans la console

### Problème : Catégories non chargées
1. Vérifier que le script SQL a été exécuté
2. Vérifier que la fonction `get_user_categories` existe
3. Vérifier les logs dans la console

## 📞 Support

### Ressources utiles
- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript)

### En cas de problème
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs dans Supabase Dashboard
3. Consulter la documentation Supabase

---

## 🎉 Félicitations !

Votre application Akuma Budget est maintenant configurée avec :
- ✅ Base de données Supabase complète
- ✅ Authentification sécurisée
- ✅ Gestion des catégories et budgets
- ✅ Interface utilisateur moderne
- ✅ Sécurité Row Level Security

**L'application est prête à être utilisée ! 🚀**
