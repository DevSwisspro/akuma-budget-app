# 🔑 GUIDE POUR RÉCUPÉRER LA CLÉ SERVICE_ROLE

## ⚠️ **ATTENTION : CLÉ INCORRECTE DÉTECTÉE**

Vous avez fourni une clé `anon` au lieu de la clé `service_role`.

**La clé fournie :**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24i...
```
→ Cette clé contient `"role":"anon"` (visible en décodant)

**Nous avons besoin de la clé `service_role` qui contient `"role":"service_role"`**

---

## 📋 **ÉTAPES POUR RÉCUPÉRER LA BONNE CLÉ**

### **1️⃣ Allez sur Supabase Dashboard**
🔗 **https://supabase.com/dashboard**

### **2️⃣ Sélectionnez votre projet**
- Cliquez sur **"Akuma Budget"** (ou le nom de votre projet)

### **3️⃣ Accédez aux paramètres API**
- Dans la barre latérale gauche : **Settings** ⚙️
- Puis cliquez sur **API**

### **4️⃣ Trouvez la section "Project API keys"**
Vous verrez plusieurs clés :

```
🔓 anon public    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
🔒 service_role   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### **5️⃣ Copiez la clé SERVICE_ROLE** 
⚠️ **ATTENTION : Prenez la clé `service_role`, PAS la clé `anon` !**

- Cliquez sur l'icône 📋 à côté de **"service_role"**
- La clé commence aussi par `eyJ...` mais est différente de la clé `anon`

### **6️⃣ Relancez le script**
```bash
npm run setup-schema
```

Et collez la **vraie** clé `service_role` cette fois.

---

## 🔍 **COMMENT DIFFÉRENCIER LES CLÉS ?**

### **CLÉ ANON (que vous avez fournie) :**
```json
{
  "role": "anon",
  "iss": "supabase",
  "iat": 1755527050,
  "exp": 2071103050
}
```
→ **Limitée, lecture seule selon RLS**

### **CLÉ SERVICE_ROLE (que nous voulons) :**
```json
{
  "role": "service_role", 
  "iss": "supabase",
  "iat": 1755527050,
  "exp": 2071103050
}
```
→ **Accès administrateur complet**

---

## 🚨 **SÉCURITÉ**

⚠️ **La clé service_role donne un accès total à votre base de données !**

- ✅ **Utilisez-la uniquement pour l'installation du schéma**
- ✅ **Ne la partagez jamais publiquement**
- ✅ **Elle est sauvée localement dans `.env` (ignoré par Git)**

---

**Une fois la bonne clé configurée, le schéma s'appliquera automatiquement !** 🚀
