# 🔐 Système d'Authentification Robuste - Akuma Budget

## 🎯 Vue d'ensemble

Un système d'authentification complet et sécurisé a été mis en place avec les fonctionnalités suivantes :

### ✅ Fonctionnalités Implémentées

1. **Authentification à deux facteurs (2FA)**
   - Codes OTP par email (3-6 chiffres)
   - Expiration automatique (5 minutes)
   - Limitation des tentatives (3 max par OTP)

2. **Sécurité renforcée**
   - Protection contre les attaques par force brute
   - Blocage temporaire des comptes (15 minutes après 5 échecs)
   - Hachage sécurisé des codes OTP (bcrypt)
   - Row Level Security (RLS) sur toutes les tables

3. **Gestion des appareils de confiance**
   - Option "Se souvenir de l'appareil" (30 jours)
   - Connexion directe pour les appareils reconnus
   - Gestion sécurisée des tokens

4. **Interface utilisateur intuitive**
   - Modal d'authentification moderne
   - Étapes guidées (connexion → OTP → validation)
   - Messages d'erreur clairs et informatifs
   - Support du mode sombre

## 📁 Structure des Fichiers

### Base de données
- `supabase-auth-complete-schema.sql` - Schéma complet de la base de données
- Tables : `user_profiles`, `user_otps`, `login_attempts`, `trusted_devices`
- Fonctions RPC : `generate_otp`, `validate_otp`, `is_user_blocked`, etc.

### Frontend
- `src/components/RobustAuthModal.jsx` - Modal d'authentification principal
- `src/lib/supabase.js` - API d'authentification mise à jour
- `src/App.jsx` - Intégration du nouveau système

### Scripts et Tests
- `scripts/test-auth-system.js` - Tests automatisés du système
- `CONFIGURATION-OTP-EMAIL.md` - Guide de configuration détaillé

## 🚀 Installation et Configuration

### 1. Exécuter le schéma SQL
```sql
-- Copier et exécuter le contenu de supabase-auth-complete-schema.sql
-- dans l'éditeur SQL de Supabase
```

### 2. Configurer Supabase Auth
1. Désactiver la confirmation d'email automatique
2. Configurer les templates d'email pour les OTP
3. Activer les politiques RLS

### 3. Tester le système
```bash
# Vérifier la configuration
npm run test:auth

# Démarrer l'application
npm run dev
```

## 🔄 Flux d'Authentification

### Inscription
1. **Création du compte** : Email + mot de passe + informations personnelles
2. **Génération OTP** : Code envoyé par email
3. **Validation OTP** : Activation du compte
4. **Redirection** : Vers le tableau de bord

### Connexion
1. **Première étape** : Email + mot de passe
2. **Vérification appareil** : Si appareil de confiance → connexion directe
3. **Génération OTP** : Si appareil non reconnu
4. **Validation OTP** : Code à 6 chiffres
5. **Option "Se souvenir"** : Enregistrer l'appareil pour 30 jours

## 🛡️ Sécurité

### Protection contre les attaques
- **Force brute** : Limitation à 3 tentatives par OTP
- **Blocage de compte** : 15 minutes après 5 échecs de connexion
- **Expiration OTP** : 5 minutes maximum
- **Hachage sécurisé** : bcrypt pour les codes OTP

### Isolation des données
- **Row Level Security** : Chaque utilisateur ne voit que ses données
- **Politiques RLS** : Contrôle d'accès granulaire
- **Tokens sécurisés** : JWT chiffrés côté client

### Audit et monitoring
- **Logs de connexion** : Historique des tentatives
- **Surveillance** : Détection d'abus automatique
- **Nettoyage** : Suppression automatique des données expirées

## 📊 Tables de Base de Données

### `user_profiles`
```sql
- id (UUID, PK)
- user_id (FK vers auth.users)
- email, first_name, last_name
- preferred_currency, preferred_language, timezone
- is_active, email_verified
- created_at, updated_at
```

### `user_otps`
```sql
- id (UUID, PK)
- user_id (FK vers auth.users)
- email, code_hash (bcrypt)
- code_type (signup/login/password_reset)
- status (pending/used/expired)
- expires_at, used_at
- attempts, max_attempts
```

### `login_attempts`
```sql
- id (UUID, PK)
- email, ip_address, user_agent
- success (boolean)
- created_at
```

### `trusted_devices`
```sql
- id (UUID, PK)
- user_id (FK vers auth.users)
- device_id, device_name, user_agent
- ip_address, expires_at
- created_at
```

## 🔧 Fonctions RPC

### `generate_otp(email, type, expires_in_minutes)`
- Génère un code OTP sécurisé
- Hache le code avec bcrypt
- Supprime les anciens OTP non utilisés
- Retourne le code (en développement)

### `validate_otp(email, code, type)`
- Vérifie le code OTP
- Gère les tentatives et l'expiration
- Marque l'OTP comme utilisé si valide

### `is_user_blocked(email, ip_address)`
- Vérifie si un utilisateur est temporairement bloqué
- Compte les tentatives échouées récentes
- Retourne le statut de blocage

### `manage_trusted_device(user_id, device_id, ...)`
- Enregistre un appareil de confiance
- Gère l'expiration (30 jours)
- Permet la connexion directe

## 🎨 Interface Utilisateur

### Composant RobustAuthModal
- **Étapes multiples** : Connexion, inscription, OTP
- **Validation en temps réel** : Messages d'erreur instantanés
- **Design responsive** : Compatible mobile et desktop
- **Mode sombre** : Support complet du thème sombre
- **Accessibilité** : Navigation au clavier, focus management

### États et transitions
- `login` → `otp` : Après validation email/mot de passe
- `signup` → `signup-otp` : Après création de compte
- `otp` → `login` : Retour en cas d'erreur
- Gestion des états de chargement et d'erreur

## 🧪 Tests et Validation

### Script de test automatisé
```bash
npm run test:auth
```

**Tests effectués :**
- ✅ Connexion à Supabase
- ✅ Existence des tables
- ✅ Fonctions RPC
- ✅ Politiques RLS
- ✅ Extensions PostgreSQL
- ✅ Flux d'authentification

### Tests manuels recommandés
1. **Création de compte** avec OTP
2. **Connexion** avec appareil non reconnu
3. **Appareil de confiance** (option "se souvenir")
4. **Force brute** (tentatives multiples)
5. **Expiration OTP** (attendre 5 minutes)

## 📈 Performance et Optimisation

### Index de base de données
- Index sur `user_id`, `email`, `code_type`
- Index sur `expires_at` pour le nettoyage automatique
- Index sur `created_at` pour les tentatives de connexion

### Nettoyage automatique
- **OTP expirés** : Marqués comme "expired"
- **Tentatives anciennes** : Supprimées après 24h
- **Appareils expirés** : Supprimés automatiquement

### Optimisations frontend
- **Lazy loading** : Chargement à la demande
- **Debouncing** : Limitation des appels API
- **Cache local** : Stockage des préférences utilisateur

## 🔄 Maintenance et Monitoring

### Tâches de maintenance
- **Nettoyage quotidien** : Exécuter `perform_cleanup()`
- **Surveillance des logs** : Monitorer les erreurs d'authentification
- **Mise à jour des templates** : Personnaliser les emails

### Alertes recommandées
- Tentatives de connexion multiples échouées
- Erreurs de génération d'OTP
- Échecs de validation répétés

## 🚨 Dépannage

### Problèmes courants

**OTP non reçu :**
- Vérifier la configuration SMTP
- Tester avec un email valide
- Vérifier les logs Supabase

**Erreur de validation :**
- Vérifier l'expiration de l'OTP
- Contrôler le nombre de tentatives
- Vérifier que l'utilisateur existe

**Connexion bloquée :**
- Attendre la fin du blocage (15 minutes)
- Vérifier les tentatives récentes
- Contrôler l'adresse IP

### Logs utiles
```sql
-- OTP actifs
SELECT * FROM user_otps WHERE status = 'pending' AND expires_at > NOW();

-- Tentatives récentes
SELECT * FROM login_attempts WHERE email = 'user@example.com' ORDER BY created_at DESC LIMIT 10;

-- Appareils de confiance
SELECT * FROM trusted_devices WHERE user_id = 'user-uuid';
```

## 🎉 Résultat Final

Le système d'authentification robuste offre :

- ✅ **Sécurité maximale** : 2FA, protection contre les attaques, RLS
- ✅ **Expérience utilisateur** : Interface intuitive, appareils de confiance
- ✅ **Performance** : Optimisations base de données et frontend
- ✅ **Maintenabilité** : Code modulaire, tests automatisés
- ✅ **Évolutivité** : Architecture extensible pour de futures fonctionnalités

## 📞 Support et Documentation

- **Guide de configuration** : `CONFIGURATION-OTP-EMAIL.md`
- **Tests automatisés** : `npm run test:auth`
- **Documentation Supabase** : [docs.supabase.com](https://docs.supabase.com)
- **Logs et monitoring** : Dashboard Supabase

---

**🎯 Objectif atteint :** Système d'authentification robuste, sécurisé et prêt pour la production !
