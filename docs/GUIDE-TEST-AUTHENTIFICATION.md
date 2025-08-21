# Guide de Test - Système d'Authentification Akuma Budget

## 🎯 **Objectif**

Tester le système d'authentification complet avec Supabase, incluant l'inscription, la connexion, et la vérification OTP.

## 🚀 **Prérequis**

1. **Application lancée** sur `http://localhost:5173`
2. **Configuration Supabase** terminée
3. **Politiques RLS** configurées (voir `SUPABASE-RLS-SETUP.md`)

## 📋 **Tests à effectuer**

### **Test 1 : Inscription d'un nouvel utilisateur**

#### **Étapes :**
1. Ouvrir `http://localhost:5173`
2. Cliquer sur **"Se connecter"** en haut à droite
3. Aller dans l'onglet **"Inscription"**
4. Remplir le formulaire :
   - **Prénom :** Test
   - **Nom :** User
   - **Email :** `test@example.com`
   - **Mot de passe :** `password123`
   - **Confirmer mot de passe :** `password123`
5. Cliquer sur **"S'inscrire"**

#### **Résultat attendu :**
- ✅ Message de succès : "Un email de confirmation a été envoyé"
- ✅ Transition vers l'écran de vérification OTP
- ✅ Email reçu avec le code OTP

#### **Test OTP :**
1. Vérifier l'email reçu
2. Entrer le code OTP à 6 chiffres
3. Cliquer sur **"Vérifier le code"**

#### **Résultat attendu :**
- ✅ Message : "Compte créé avec succès !"
- ✅ Modal se ferme automatiquement
- ✅ Utilisateur connecté (email affiché en haut)

### **Test 2 : Connexion d'un utilisateur existant**

#### **Étapes :**
1. Se déconnecter (bouton rouge "Déconnexion")
2. Cliquer sur **"Se connecter"**
3. Remplir le formulaire :
   - **Email :** `test@example.com`
   - **Mot de passe :** `password123`
4. Cliquer sur **"Se connecter"**

#### **Résultat attendu :**
- ✅ Connexion réussie
- ✅ Modal se ferme
- ✅ Email affiché en haut
- ✅ Données utilisateur chargées

### **Test 3 : Connexion avec OTP**

#### **Étapes :**
1. Se déconnecter
2. Cliquer sur **"Se connecter"**
3. Entrer seulement l'email : `test@example.com`
4. Cliquer sur **"Code OTP"**

#### **Résultat attendu :**
- ✅ Message : "Un code de vérification a été envoyé"
- ✅ Transition vers l'écran OTP
- ✅ Email reçu avec le code
- ✅ Connexion après vérification

### **Test 4 : Sécurité des données**

#### **Étapes :**
1. Se connecter avec un compte
2. Ajouter quelques transactions
3. Se déconnecter
4. Se connecter avec un autre compte

#### **Résultat attendu :**
- ✅ Aucune donnée du premier utilisateur visible
- ✅ Seules les données du nouvel utilisateur affichées
- ✅ Politiques RLS fonctionnent correctement

### **Test 5 : Gestion des erreurs**

#### **Test email invalide :**
1. Essayer de s'inscrire avec un email invalide
2. **Résultat attendu :** Message d'erreur "Format d'email invalide"

#### **Test mot de passe faible :**
1. Essayer de s'inscrire avec un mot de passe de 3 caractères
2. **Résultat attendu :** Message d'erreur "Le mot de passe doit contenir au moins 6 caractères"

#### **Test mots de passe différents :**
1. Saisir des mots de passe différents lors de l'inscription
2. **Résultat attendu :** Message d'erreur "Les mots de passe ne correspondent pas"

#### **Test OTP invalide :**
1. Entrer un code OTP incorrect
2. **Résultat attendu :** Message d'erreur "Le code de vérification a expiré ou est invalide"

## 🔧 **Configuration requise**

### **Variables d'environnement**

Vérifier que le fichier `.env` contient :

```env
VITE_SUPABASE_URL=https://nwzqbnofamhlnmasdvyo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0
```

### **Configuration Supabase**

1. **Authentification activée**
2. **Emails de confirmation activés**
3. **Politiques RLS configurées**
4. **Templates d'email personnalisés**

## 🐛 **Dépannage**

### **Problème : Application ne démarre pas**
```bash
# Arrêter tous les processus Node.js
taskkill /F /IM node.exe

# Relancer l'application
npm run dev
```

### **Problème : Erreur de connexion Supabase**
- Vérifier les variables d'environnement
- Vérifier la connectivité internet
- Vérifier les logs dans la console du navigateur

### **Problème : Emails non reçus**
- Vérifier le dossier spam
- Vérifier la configuration des emails dans Supabase
- Tester avec un autre email

### **Problème : Politiques RLS bloquent l'accès**
- Vérifier la configuration des politiques
- Tester avec l'utilisateur authentifié
- Vérifier les logs Supabase

## 📊 **Validation finale**

### **Checklist de validation :**

- [ ] Inscription fonctionne avec OTP
- [ ] Connexion classique fonctionne
- [ ] Connexion OTP fonctionne
- [ ] Déconnexion fonctionne
- [ ] Données isolées par utilisateur
- [ ] Gestion des erreurs appropriée
- [ ] Interface responsive
- [ ] Mode sombre fonctionne
- [ ] Persistance de session

### **Tests de performance :**

- [ ] Temps de chargement < 3 secondes
- [ ] Temps de réponse authentification < 2 secondes
- [ ] Pas d'erreurs dans la console
- [ ] Fonctionnement sur mobile

## 🎉 **Succès**

Si tous les tests passent, le système d'authentification est **opérationnel** et prêt pour la production !

## 📞 **Support**

En cas de problème :
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs Supabase
3. Consulter la documentation Supabase
4. Tester avec un compte de test
