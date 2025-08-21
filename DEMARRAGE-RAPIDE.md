# 🚀 DÉMARRAGE RAPIDE - Akuma Budget

## ⚡ **ÉTAPES OBLIGATOIRES (5 minutes)**

### 1️⃣ **Appliquer le Schéma de Base de Données**

1. **Récupérer votre clé service_role :**
   - Allez sur [supabase.com](https://supabase.com) → Votre projet
   - Settings > API
   - Copiez la clé "service_role" (commence par `eyJ...`)

2. **Configurer le script :**
   ```bash
   # Ouvrir le fichier
   code scripts/apply-new-schema.js
   
   # Ligne 10, remplacer :
   const SERVICE_ROLE_KEY = 'REMPLACEZ_PAR_VOTRE_CLE_SERVICE_ROLE';
   # Par :
   const SERVICE_ROLE_KEY = 'eyJ_VOTRE_VRAIE_CLE...';
   ```

3. **Appliquer le schéma :**
   ```bash
   npm run apply-schema
   ```
   
   **Résultat attendu :**
   ```
   ✅ 7 types insérés
   ✅ 41 catégories insérées
   ✅ Politiques RLS configurées
   🎉 SCHÉMA APPLIQUÉ AVEC SUCCÈS !
   ```

### 2️⃣ **Lancer l'Application**

```bash
npm run dev
```

**Votre app sera accessible sur :** http://localhost:5173

---

## 🧪 **TESTS DE VALIDATION**

### ✅ **Test 1 : Connexion**
1. Cliquez sur "Se connecter" en haut à droite
2. Onglet "S'inscrire" → Créez un compte
3. **Code OTP de test :** `000000` (mode développement)
4. Vérifiez que vous êtes connecté (email affiché en haut)

### ✅ **Test 2 : Ajout de Transaction**
1. Formulaire "Ajouter une transaction"
2. Sélectionnez un **Type** (ex: Revenu)
3. Sélectionnez une **Catégorie** (ex: Salaire)
4. Montant : `1000`
5. Cliquez "Ajouter"
6. Vérifiez que la transaction apparaît dans le tableau

### ✅ **Test 3 : Catégories Prédéfinies**
1. Testez différents types : Revenu, Dépense fixe, Dépense variable
2. Vérifiez que les catégories changent selon le type
3. **7 types disponibles :** Revenu, Dépense fixe, Dépense variable, Épargne, Investissement, Dette, Remboursement
4. **41 catégories au total** réparties dans les types

---

## 🔧 **DÉPANNAGE RAPIDE**

### ❌ **"Auth session missing"**
```bash
# Vérifier les clés Supabase
cat .env
# Doit contenir :
# VITE_SUPABASE_URL=https://nwzqbnofamhlnmasdvyo.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
```

### ❌ **"Table does not exist"**
```bash
# Vérifier l'état de la base
npm run check-db

# Si vide, appliquer le schéma
npm run apply-schema
```

### ❌ **Catégories n'apparaissent pas**
```bash
# Vérifier le schéma
npm run check-db
# Doit afficher :
# ✅ Table "types" existe (7 lignes)
# ✅ Table "categories" existe (41 lignes)
```

### ❌ **Page blanche**
```bash
# Vérifier la console navigateur (F12)
# Si erreurs d'import, relancer :
npm install
npm run dev
```

---

## 📊 **FONCTIONNALITÉS DISPONIBLES**

- ✅ **Authentification** complète avec OTP
- ✅ **7 types de transaction** prédéfinis
- ✅ **41 catégories** organisées par type
- ✅ **Ajout de transactions** avec validation
- ✅ **Interface moderne** avec mode sombre
- ✅ **Sécurité RLS** (chaque utilisateur voit ses données)
- ✅ **Session persistante** (reste connecté après refresh)

---

## 🎯 **PRÊT !**

Une fois ces étapes terminées, votre application Akuma Budget est **entièrement fonctionnelle** avec :

- Base de données configurée ✅
- Authentification active ✅  
- Catégories prédéfinies ✅
- Interface moderne ✅
- Sécurité optimale ✅

**Profitez de votre gestionnaire de budget personnel !** 💰
