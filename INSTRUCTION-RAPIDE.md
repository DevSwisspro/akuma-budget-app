# 🚨 ACTION IMMÉDIATE REQUISE

## 📝 **POUR APPLIQUER LE SCHÉMA CORRECT**

### 1️⃣ **Configurer la clé service_role**
1. Ouvrez votre fichier `.env`
2. Ajoutez cette ligne (remplacez par votre vraie clé) :
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJ_VOTRE_VRAIE_CLE_SERVICE_ROLE_ICI
   ```

### 2️⃣ **Récupérer votre clé service_role**
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **Akuma Budget**
3. Menu : **Settings** > **API**
4. Copiez la clé **"service_role"** (commence par `eyJ...`)

### 3️⃣ **Appliquer le schéma automatiquement**
Dès que la clé est configurée, lancez :
```bash
npm run apply-schema-auto
```

**⚠️ SANS CETTE ÉTAPE, L'APPLICATION NE FONCTIONNERA PAS !**

---

## 🎯 **CE QUI SERA CRÉÉ AUTOMATIQUEMENT**

✅ **7 types fixes :**
- 💰 revenu
- 🏠 depense_fixe  
- 🛒 depense_variable
- 🏦 epargne
- 📈 investissement
- 💳 dette
- 💸 remboursement

✅ **41 catégories prédéfinies** organisées par type

✅ **Structure complète** avec RLS et sécurité

---

**Lancez cette commande dès que possible pour débloquer l'application !** 🚀
