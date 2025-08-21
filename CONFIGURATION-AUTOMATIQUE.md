# 🔧 CONFIGURATION AUTOMATIQUE DU SCHÉMA

## ⚡ SOLUTION RAPIDE (2 minutes)

### 1️⃣ **Récupérer votre clé service_role**
1. Ouvrez [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **Akuma Budget**
3. Menu : **Settings** > **API**
4. Copiez la clé **"service_role"** (commence par `eyJ...`)

### 2️⃣ **Ajouter la clé dans .env**
Ouvrez le fichier `.env` et ajoutez :
```env
SUPABASE_SERVICE_ROLE_KEY=eyJ_VOTRE_VRAIE_CLE_ICI...
```

### 3️⃣ **Appliquer le schéma automatiquement**
```bash
npm run apply-schema-auto
```

**Résultat attendu :**
```
🎉 SCHÉMA APPLIQUÉ AVEC SUCCÈS !
✅ 7 types prédéfinis créés
✅ 41 catégories prédéfinies créées
✅ Politiques RLS configurées
✅ Structure de base complète

🚀 Votre application est maintenant prête à fonctionner !
```

### 4️⃣ **Vérification**
```bash
npm run check-db
```

**Doit afficher :**
```
✅ Table "types" existe (7 lignes)
✅ Table "categories" existe (41 lignes)
✅ 7 types trouvés: 💰 revenu, 🏠 depense_fixe, etc.
```

---

## 🎯 **AVANTAGES DE CE SCRIPT**

- ✅ **Automatique** : Tout se fait en une commande
- ✅ **Sécurisé** : Utilise votre clé service_role
- ✅ **Complet** : Tables + données + RLS en une fois
- ✅ **Robuste** : Gestion d'erreurs et vérifications
- ✅ **Propre** : Nettoie les anciennes données avant création

---

## 🚨 **EN CAS DE PROBLÈME**

### Erreur "Clé non trouvée"
- Vérifiez que la clé est bien dans `.env`
- Pas d'espaces avant/après le `=`
- La clé doit commencer par `eyJ`

### Erreur "Permission denied"
- Utilisez bien la clé **service_role** (pas anon)
- Vérifiez que vous êtes propriétaire du projet Supabase

### Erreur "Connection failed"
- Vérifiez votre connexion internet
- Vérifiez l'URL Supabase dans le script

---

**Une fois configuré, votre application fonctionnera parfaitement !** 🎉
