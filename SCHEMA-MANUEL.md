# 🔧 APPLICATION MANUELLE DU SCHÉMA

## ⚠️ PROBLÈME DÉTECTÉ
La base de données Supabase n'a pas le bon schéma appliqué. Vous devez l'appliquer manuellement.

## 📋 SOLUTION (3 minutes)

### 1️⃣ **Aller dans Supabase Dashboard**
1. Ouvrez [supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet Akuma Budget
3. Menu de gauche : **SQL Editor**

### 2️⃣ **Exécuter le Schéma Complet**
1. Dans SQL Editor, créez une nouvelle requête
2. Copiez-collez **TOUT LE CONTENU** du fichier `fix-schema-complete.sql`
3. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter)

### 3️⃣ **Vérification**
Après exécution, vous devriez voir :
```
✅ 7 tables créées (types, categories, transactions, budgets, etc.)
✅ 7 types insérés
✅ 41 catégories insérées  
✅ Politiques RLS configurées
```

### 4️⃣ **Test Final**
```bash
npm run check-db
```

**Résultat attendu :**
```
✅ Table "types" existe (7 lignes)
✅ Table "categories" existe (41 lignes)
✅ 7 types trouvés: 💰 revenu, 🏠 depense_fixe, etc.
```

---

## 🚨 SI ERREURS

### Erreur : "Permission denied"
- Assurez-vous d'être connecté comme propriétaire du projet
- Utilisez l'éditeur SQL avec les droits admin

### Erreur : "Table already exists"
- Normal si vous relancez le script
- Les `DROP TABLE IF EXISTS` gèrent cette situation

### Schéma incomplet
- Vérifiez que TOUT le contenu de `fix-schema-complete.sql` a été copié
- Le fichier fait 300+ lignes, assurez-vous de tout prendre

---

**Une fois terminé, votre base de données sera parfaitement configurée !** 🎉
