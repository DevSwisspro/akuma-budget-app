# Configuration OTP par Email - Supabase

## 🎯 Objectif
Configurer Supabase pour envoyer des codes OTP par email au lieu de liens de confirmation.

## 📋 Étapes de Configuration

### 1. Configuration Supabase Auth

#### A. Désactiver la confirmation d'email automatique
1. Aller dans **Supabase Dashboard** → **Authentication** → **Settings**
2. Dans la section **Email Auth**, désactiver :
   - ✅ **Enable email confirmations**
   - ✅ **Enable secure email change**
3. Cliquer sur **Save**

#### B. Configurer les templates d'email
1. Aller dans **Authentication** → **Email Templates**
2. Créer un nouveau template pour les OTP :

**Template "OTP Code" :**
```html
<h2>Code de vérification</h2>
<p>Bonjour,</p>
<p>Votre code de vérification est : <strong>{{ .Code }}</strong></p>
<p>Ce code expire dans 5 minutes.</p>
<p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
<p>Cordialement,<br>L'équipe Akuma Budget</p>
```

### 2. Configuration des fonctions RPC

#### A. Exécuter le schéma SQL
1. Aller dans **SQL Editor**
2. Copier et exécuter le contenu de `supabase-auth-complete-schema.sql`
3. Vérifier que toutes les tables et fonctions sont créées

#### B. Configurer les permissions RLS
1. Vérifier que RLS est activé sur toutes les tables :
   - `user_profiles`
   - `user_otps`
   - `login_attempts`
   - `trusted_devices`

### 3. Configuration Email (Optionnel - Production)

#### A. Configurer un service d'email
Pour la production, configurer un service d'email comme SendGrid ou Mailgun :

1. **SendGrid** (recommandé) :
   - Créer un compte SendGrid
   - Générer une API Key
   - Configurer dans Supabase : **Settings** → **API** → **SMTP Settings**

2. **Mailgun** :
   - Créer un compte Mailgun
   - Configurer les domaines
   - Ajouter les credentials SMTP

#### B. Template d'email personnalisé
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Code de vérification - Akuma Budget</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🔐 Code de vérification</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Akuma Budget</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Bonjour,<br>
            Voici votre code de vérification pour accéder à votre compte :
        </p>
        
        <div style="background: #fff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                {{ .Code }}
            </div>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
                ⏰ <strong>Important :</strong> Ce code expire dans 5 minutes
            </p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
            Cet email a été envoyé automatiquement par Akuma Budget.<br>
            Ne répondez pas à cet email.
        </p>
    </div>
</body>
</html>
```

### 4. Configuration de l'Application

#### A. Variables d'environnement
Vérifier que le fichier `.env` contient :
```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
VITE_DEV_MODE=false
```

#### B. Test de l'authentification
1. Démarrer l'application : `npm run dev`
2. Tester la création de compte
3. Vérifier que l'OTP est reçu par email
4. Tester la connexion avec OTP

### 5. Sécurité et Monitoring

#### A. Surveillance des tentatives de connexion
- Monitorer la table `login_attempts` pour détecter les abus
- Configurer des alertes pour les tentatives multiples échouées

#### B. Nettoyage automatique
- Configurer un job cron pour exécuter `perform_cleanup()` toutes les heures
- Nettoyer les OTP expirés et les tentatives anciennes

#### C. Logs et audit
- Activer les logs Supabase pour tracer les authentifications
- Monitorer les erreurs d'authentification

### 6. Tests de Sécurité

#### A. Tests à effectuer
1. **Test de force brute** : Essayer plusieurs codes OTP incorrects
2. **Test d'expiration** : Attendre l'expiration d'un OTP
3. **Test de renvoi** : Vérifier la limitation des renvois
4. **Test d'appareil de confiance** : Vérifier la fonctionnalité "se souvenir"

#### B. Scénarios de test
```javascript
// Test de connexion avec OTP
const testLogin = async () => {
  try {
    // 1. Première étape de connexion
    const step1 = await authApi.signInStep1('test@example.com', 'password');
    console.log('Étape 1:', step1);
    
    // 2. Générer OTP
    const otp = await authApi.generateLoginOTP('test@example.com');
    console.log('OTP généré:', otp);
    
    // 3. Valider OTP
    const validation = await authApi.validateLoginOTP('test@example.com', '123456');
    console.log('Validation:', validation);
    
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### 7. Dépannage

#### A. Problèmes courants
1. **OTP non reçu** :
   - Vérifier la configuration SMTP
   - Vérifier les logs Supabase
   - Tester avec un email valide

2. **Erreur de validation** :
   - Vérifier que l'utilisateur existe
   - Vérifier que l'OTP n'est pas expiré
   - Vérifier le nombre de tentatives

3. **Erreur de connexion** :
   - Vérifier les permissions RLS
   - Vérifier que l'email est confirmé
   - Vérifier les tentatives de connexion

#### B. Logs utiles
```sql
-- Vérifier les OTP actifs
SELECT * FROM user_otps WHERE status = 'pending' AND expires_at > NOW();

-- Vérifier les tentatives de connexion
SELECT * FROM login_attempts WHERE email = 'test@example.com' ORDER BY created_at DESC LIMIT 10;

-- Vérifier les appareils de confiance
SELECT * FROM trusted_devices WHERE user_id = 'user-uuid';
```

## 🎉 Résultat Final

Après cette configuration, votre application aura :
- ✅ Authentification à deux facteurs avec OTP par email
- ✅ Protection contre les attaques par force brute
- ✅ Gestion des appareils de confiance
- ✅ Nettoyage automatique des données expirées
- ✅ Interface utilisateur intuitive et sécurisée

## 📞 Support

En cas de problème :
1. Vérifier les logs Supabase
2. Tester en mode développement
3. Consulter la documentation Supabase Auth
4. Vérifier la configuration SMTP
