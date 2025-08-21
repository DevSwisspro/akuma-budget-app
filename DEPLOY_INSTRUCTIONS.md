# 🚀 Instructions de déploiement Akuma Budget

## 📋 Étapes de déploiement

### 1. Créer le repository GitHub

1. **Aller sur GitHub.com** et se connecter
2. **Cliquer sur "New repository"**
3. **Nom du repo:** `akuma-budget`
4. **Description:** `💰 Application moderne de gestion de budget personnel - React 18 + Supabase + Tailwind CSS`
5. **Public** ✅
6. **Ne pas** initialiser avec README (on a déjà le code)
7. **Cliquer "Create repository"**

### 2. Connecter le repo local à GitHub

```bash
cd "H:\Projet en cours\Akuma_Budget"
git remote add origin https://github.com/VOTRE-USERNAME/akuma-budget.git
git branch -M main
git push -u origin main
```

### 3. Déployer sur Netlify

#### Option A: Via GitHub (Recommandé)
1. **Aller sur [netlify.com](https://netlify.com)** et se connecter
2. **"New site from Git"**
3. **Choisir GitHub** et autoriser l'accès
4. **Sélectionner le repo** `akuma-budget`
5. **Configuration build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Variables d'environnement** (Section Environment):
   ```
   VITE_SUPABASE_URL=https://nwzqbnofamhlnmasdvyo.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0
   ```
7. **"Deploy site"**

#### Option B: Drag & Drop
1. **Créer le build:**
   ```bash
   cd "H:\Projet en cours\Akuma_Budget"
   npm run build
   ```
2. **Drag & drop** le dossier `dist` sur netlify.com
3. **Configurer les variables** après déploiement

### 4. Configuration post-déploiement

1. **Nom de domaine:** Changer le nom auto-généré vers quelque chose comme `akuma-budget.netlify.app`
2. **Variables d'environnement:** Vérifier qu'elles sont bien configurées
3. **Redirects:** Ajouter un fichier `_redirects` dans `/public` si nécessaire:
   ```
   /*    /index.html   200
   ```

## 🔗 URLs finales

- **Repository GitHub:** `https://github.com/VOTRE-USERNAME/akuma-budget`
- **Application déployée:** `https://akuma-budget.netlify.app` (ou votre domaine)

## ✅ Tests à effectuer

- [ ] Application se charge correctement
- [ ] Authentification OTP fonctionne
- [ ] Transactions peuvent être créées
- [ ] Mode sombre/clair fonctionne
- [ ] Responsive design mobile

## 🛠️ Dépannage

Si l'application ne fonctionne pas:
1. Vérifier les variables d'environnement sur Netlify
2. Vérifier les logs de build
3. Tester l'URL Supabase depuis le navigateur

---

**🎉 Une fois déployé, vous aurez une application web complète accessible à tous vos amis !**