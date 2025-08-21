# Configuration des Politiques RLS Supabase - Akuma Budget

## 🔐 **Configuration Manuelle des Politiques RLS**

Puisque l'API `exec_sql` n'est pas disponible, nous devons configurer les politiques RLS manuellement dans l'interface Supabase.

### **Étapes à suivre :**

#### 1. **Accéder à l'interface Supabase**
- Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Connectez-vous à votre compte
- Sélectionnez le projet `nwzqbnofamhlnmasdvyo`

#### 2. **Activer RLS sur les tables**

Dans l'interface Supabase, allez dans **Table Editor** et pour chaque table :

**Table `transactions` :**
1. Cliquez sur la table `transactions`
2. Allez dans l'onglet **Policies**
3. Activez **Row Level Security (RLS)**

**Table `categories` :**
1. Cliquez sur la table `categories`
2. Allez dans l'onglet **Policies**
3. Activez **Row Level Security (RLS)**

**Table `budgets` :**
1. Cliquez sur la table `budgets`
2. Allez dans l'onglet **Policies**
3. Activez **Row Level Security (RLS)**

#### 3. **Créer les politiques pour la table `transactions`**

Cliquez sur **New Policy** et créez ces 4 politiques :

**Politique 1 - SELECT :**
- **Name:** `Users can view their own transactions`
- **Allowed operation:** `SELECT`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 2 - INSERT :**
- **Name:** `Users can insert their own transactions`
- **Allowed operation:** `INSERT`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 3 - UPDATE :**
- **Name:** `Users can update their own transactions`
- **Allowed operation:** `UPDATE`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 4 - DELETE :**
- **Name:** `Users can delete their own transactions`
- **Allowed operation:** `DELETE`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

#### 4. **Créer les politiques pour la table `categories`**

**Politique 1 - SELECT :**
- **Name:** `Users can view their own categories`
- **Allowed operation:** `SELECT`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 2 - INSERT :**
- **Name:** `Users can insert their own categories`
- **Allowed operation:** `INSERT`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 3 - UPDATE :**
- **Name:** `Users can update their own categories`
- **Allowed operation:** `UPDATE`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 4 - DELETE :**
- **Name:** `Users can delete their own categories`
- **Allowed operation:** `DELETE`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

#### 5. **Créer les politiques pour la table `budgets`**

**Politique 1 - SELECT :**
- **Name:** `Users can view their own budgets`
- **Allowed operation:** `SELECT`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 2 - INSERT :**
- **Name:** `Users can insert their own budgets`
- **Allowed operation:** `INSERT`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 3 - UPDATE :**
- **Name:** `Users can update their own budgets`
- **Allowed operation:** `UPDATE`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

**Politique 4 - DELETE :**
- **Name:** `Users can delete their own budgets`
- **Allowed operation:** `DELETE`
- **Target roles:** `authenticated`
- **Using expression:** `auth.uid() = user_id`

## 🔧 **Configuration de l'Authentification**

### **Activer l'authentification par email**

1. Allez dans **Authentication** > **Settings**
2. Activez **Enable email confirmations**
3. Configurez le template d'email de confirmation

### **Configuration des emails**

1. Allez dans **Authentication** > **Email Templates**
2. Personnalisez le template **Confirm signup**
3. Ajoutez le lien de redirection : `{{ .SiteURL }}/auth/callback`

## ✅ **Test de la Configuration**

Une fois les politiques configurées :

1. **Test d'inscription :**
   - Créez un compte avec un email valide
   - Vérifiez que l'email de confirmation est envoyé
   - Confirmez l'email

2. **Test de connexion :**
   - Connectez-vous avec les identifiants
   - Vérifiez que seules vos données sont visibles

3. **Test de sécurité :**
   - Essayez d'accéder aux données d'un autre utilisateur
   - Vérifiez que l'accès est refusé

## 🚨 **Important**

- **Ne jamais désactiver RLS** une fois activé
- **Toujours tester** les politiques avant la production
- **Sauvegarder** la configuration des politiques
- **Documenter** toute modification

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans **Logs** > **PostgREST**
2. Testez les requêtes dans **SQL Editor**
3. Consultez la documentation Supabase
