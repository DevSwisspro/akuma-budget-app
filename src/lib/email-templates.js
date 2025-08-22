// Templates d'emails personnalisés en français pour Akuma Budget

export const EMAIL_TEMPLATES = {
  // Template email inscription
  signupConfirmation: {
    subject: "Bienvenue sur Akuma Budget !",
    
    getHtmlTemplate: (userEmail, confirmationUrl) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur Akuma Budget</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">
                🎉 Bienvenue !
            </h1>
            <div style="margin: 15px 0 0 0; font-size: 24px; font-weight: 600;">
                Akuma Budget
            </div>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
                Gestion de budget personnelle moderne
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
                Confirmez votre inscription
            </h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Bonjour,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Merci de vous être inscrit sur Akuma Budget ! 
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Pour activer votre compte (<strong>${userEmail}</strong>), veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :
            </p>

            <!-- Confirmation Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: #059669; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">
                    ✅ Confirmer mon inscription
                </a>
            </div>

            <!-- Alternative text link -->
            <div style="text-align: center; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :
                </p>
                <p style="word-break: break-all; color: #3b82f6; font-size: 12px; margin: 0;">
                    ${confirmationUrl}
                </p>
            </div>

            <!-- Security note -->
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #075985; margin: 0; font-size: 15px; text-align: center;">
                    <strong>🔒 Si vous n'avez pas créé ce compte</strong><br>
                    Vous pouvez ignorer cet email en toute sécurité.
                </p>
            </div>

            <!-- Welcome features -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 40px;">
                <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">
                    🚀 Découvrez Akuma Budget :
                </h4>
                <ul style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Gestion de budget intuitive et moderne</li>
                    <li style="margin-bottom: 8px;">Suivi des dépenses en temps réel</li>
                    <li style="margin-bottom: 8px;">Interface mobile optimisée (PWA)</li>
                    <li>Sécurité avancée de vos données financières</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">
                Merci,<br>
                <strong>L'équipe Akuma Budget</strong>
            </p>
            
            <div style="margin: 20px 0;">
                <a href="https://budget.dev-swiss.ch" 
                   style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                    🌐 budget.dev-swiss.ch
                </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.4;">
                Email envoyé automatiquement par Akuma Budget.<br>
                Une fois votre compte activé, vous pourrez accéder à votre tableau de bord.
            </p>
        </div>
    </div>
</body>
</html>`,

    getTextTemplate: (userEmail, confirmationUrl) => `
AKUMA BUDGET - Bienvenue !

Bonjour,

Merci de vous être inscrit sur Akuma Budget !

Pour activer votre compte (${userEmail}), veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :

${confirmationUrl}

Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email.

Découvrez Akuma Budget :
- Gestion de budget intuitive et moderne
- Suivi des dépenses en temps réel  
- Interface mobile optimisée (PWA)
- Sécurité avancée de vos données financières

Merci,
L'équipe Akuma Budget

https://budget.dev-swiss.ch
`
  },

  // Template email changement d'adresse
  emailChanged: {
    subject: "Votre adresse e-mail a été modifiée - Akuma Budget",
    
    getHtmlTemplate: (newEmail, oldEmail, restoreUrl) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adresse e-mail modifiée - Akuma Budget</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">
                📧 Akuma Budget
            </h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
                Modification d'adresse e-mail
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
                Votre adresse e-mail a été modifiée
            </h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Bonjour,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Votre adresse e-mail a bien été modifiée pour votre compte Akuma Budget.
            </p>

            <!-- Email change details -->
            <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <p style="color: #1e40af; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                    📋 Détails de la modification :
                </p>
                <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.4;">
                    <strong>Ancienne adresse :</strong> ${oldEmail || 'Non spécifiée'}<br>
                    <strong>Nouvelle adresse :</strong> ${newEmail}
                </p>
            </div>

            <!-- Security Alert -->
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <div style="display: flex; align-items: flex-start;">
                    <div style="font-size: 20px; margin-right: 12px;">⚠️</div>
                    <div>
                        <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                            Si vous n'êtes pas à l'origine de ce changement
                        </h3>
                        <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.5;">
                            <strong>Agissez immédiatement !</strong> Cliquez sur le lien ci-dessous pour rétablir votre ancienne adresse e-mail et sécuriser votre compte.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Restore Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="${restoreUrl}" 
                   style="display: inline-block; background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);">
                    🔄 Rétablir mon adresse e-mail
                </a>
            </div>

            <!-- Alternative text link -->
            <div style="text-align: center; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :
                </p>
                <p style="word-break: break-all; color: #3b82f6; font-size: 12px; margin: 0;">
                    ${restoreUrl}
                </p>
            </div>

            <!-- Safe Action -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #15803d; margin: 0; font-size: 15px; text-align: center;">
                    <strong>✅ Si vous êtes bien à l'origine de ce changement</strong><br>
                    Vous pouvez ignorer cet email. Votre compte utilise maintenant votre nouvelle adresse.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">
                Merci,<br>
                <strong>L'équipe Akuma Budget</strong>
            </p>
            
            <div style="margin: 20px 0;">
                <a href="https://budget.dev-swiss.ch" 
                   style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                    🌐 budget.dev-swiss.ch
                </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.4;">
                Email envoyé automatiquement pour la sécurité de votre compte.<br>
                Toute modification d'adresse e-mail génère cette notification.
            </p>
        </div>
    </div>
</body>
</html>`,

    getTextTemplate: (newEmail, oldEmail, restoreUrl) => `
AKUMA BUDGET - Votre adresse e-mail a été modifiée

Bonjour,

Votre adresse e-mail a bien été modifiée pour votre compte Akuma Budget.

Détails :
- Ancienne adresse : ${oldEmail || 'Non spécifiée'}
- Nouvelle adresse : ${newEmail}

⚠️ SI VOUS N'ÊTES PAS À L'ORIGINE DE CE CHANGEMENT :

AGISSEZ IMMÉDIATEMENT ! Cliquez sur ce lien pour rétablir votre ancienne adresse e-mail :

${restoreUrl}

✅ Si vous êtes bien à l'origine de ce changement, vous pouvez ignorer cet email.

Merci,
L'équipe Akuma Budget

https://budget.dev-swiss.ch
`
  },

  passwordChanged: {
    subject: "Votre mot de passe a été modifié - Akuma Budget",
    
    getHtmlTemplate: (userEmail, emergencyResetUrl) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe modifié - Akuma Budget</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">
                🔒 Akuma Budget
            </h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
                Gestion de budget sécurisée
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
                Votre mot de passe a été modifié
            </h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Bonjour,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Votre mot de passe a bien été changé pour votre compte Akuma Budget 
                (<strong>${userEmail}</strong>).
            </p>

            <!-- Security Alert -->
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <div style="display: flex; align-items: flex-start;">
                    <div style="font-size: 20px; margin-right: 12px;">⚠️</div>
                    <div>
                        <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                            Si vous n'êtes pas à l'origine de ce changement
                        </h3>
                        <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.5;">
                            <strong>Agissez immédiatement !</strong> Quelqu'un d'autre pourrait avoir accès à votre compte. 
                            Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe en urgence.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Emergency Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="${emergencyResetUrl}" 
                   style="display: inline-block; background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2); transition: all 0.2s;">
                    🚨 Ce n'était pas moi - Réinitialiser maintenant
                </a>
            </div>

            <!-- Safe Action -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #15803d; margin: 0; font-size: 15px; text-align: center;">
                    <strong>✅ Si vous êtes bien à l'origine de ce changement</strong><br>
                    Vous pouvez ignorer cet email en toute sécurité. Votre compte est protégé.
                </p>
            </div>

            <!-- Security Tips -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 40px;">
                <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">
                    💡 Conseils de sécurité :
                </h4>
                <ul style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Utilisez un mot de passe unique et complexe</li>
                    <li style="margin-bottom: 8px;">Ne partagez jamais vos identifiants</li>
                    <li style="margin-bottom: 8px;">Déconnectez-vous des appareils partagés</li>
                    <li>Vérifiez régulièrement l'activité de votre compte</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">
                Merci,<br>
                <strong>L'équipe Akuma Budget</strong>
            </p>
            
            <div style="margin: 20px 0;">
                <a href="https://budget.dev-swiss.ch" 
                   style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                    🌐 budget.dev-swiss.ch
                </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.4;">
                Cet email a été envoyé automatiquement pour la sécurité de votre compte.<br>
                Si vous avez des questions, contactez-nous via l'application.
            </p>
        </div>
    </div>
</body>
</html>`,

    getTextTemplate: (userEmail, emergencyResetUrl) => `
AKUMA BUDGET - Votre mot de passe a été modifié

Bonjour,

Votre mot de passe a bien été changé pour votre compte Akuma Budget (${userEmail}).

⚠️ SI VOUS N'ÊTES PAS À L'ORIGINE DE CE CHANGEMENT :

AGISSEZ IMMÉDIATEMENT ! Quelqu'un d'autre pourrait avoir accès à votre compte.
Cliquez sur ce lien pour réinitialiser votre mot de passe en urgence :

${emergencyResetUrl}

✅ Si vous êtes bien à l'origine de ce changement, vous pouvez ignorer cet email en toute sécurité.

Conseils de sécurité :
- Utilisez un mot de passe unique et complexe
- Ne partagez jamais vos identifiants  
- Déconnectez-vous des appareils partagés
- Vérifiez régulièrement l'activité de votre compte

Merci,
L'équipe Akuma Budget

https://budget.dev-swiss.ch
`
  }
};

/**
 * Génère l'URL de réinitialisation d'urgence
 */
export const generateEmergencyResetUrl = (email) => {
  const baseUrl = 'https://budget.dev-swiss.ch';
  const params = new URLSearchParams({
    email: email,
    reason: 'password_changed',
    timestamp: new Date().getTime()
  });
  
  return `${baseUrl}/auth/emergency-reset?${params.toString()}`;
};

/**
 * Génère l'URL de confirmation d'inscription
 */
export const generateSignupConfirmationUrl = (email, token) => {
  const baseUrl = 'https://budget.dev-swiss.ch';
  const params = new URLSearchParams({
    token: token,
    type: 'signup',
    email: email
  });
  
  return `${baseUrl}/auth/callback?${params.toString()}`;
};

/**
 * Génère l'URL de rétablissement d'email
 */
export const generateEmailRestoreUrl = (email) => {
  const baseUrl = 'https://budget.dev-swiss.ch';
  const params = new URLSearchParams({
    email: email,
    reason: 'email_changed',
    timestamp: new Date().getTime()
  });
  
  return `${baseUrl}/auth/emergency-reset?${params.toString()}`;
};

/**
 * Génère le contenu complet de l'email d'inscription
 */
export const generateSignupConfirmationEmail = (userEmail, token) => {
  const confirmationUrl = generateSignupConfirmationUrl(userEmail, token);
  
  return {
    subject: EMAIL_TEMPLATES.signupConfirmation.subject,
    html: EMAIL_TEMPLATES.signupConfirmation.getHtmlTemplate(userEmail, confirmationUrl),
    text: EMAIL_TEMPLATES.signupConfirmation.getTextTemplate(userEmail, confirmationUrl),
    confirmationUrl
  };
};

/**
 * Génère le contenu complet de l'email de changement d'adresse
 */
export const generateEmailChangeEmail = (newEmail, oldEmail = null) => {
  const restoreUrl = generateEmailRestoreUrl(newEmail);
  
  return {
    subject: EMAIL_TEMPLATES.emailChanged.subject,
    html: EMAIL_TEMPLATES.emailChanged.getHtmlTemplate(newEmail, oldEmail, restoreUrl),
    text: EMAIL_TEMPLATES.emailChanged.getTextTemplate(newEmail, oldEmail, restoreUrl),
    restoreUrl
  };
};

/**
 * Génère le contenu complet de l'email de changement de mot de passe
 */
export const generatePasswordChangeEmail = (userEmail) => {
  const emergencyResetUrl = generateEmergencyResetUrl(userEmail);
  
  return {
    subject: EMAIL_TEMPLATES.passwordChanged.subject,
    html: EMAIL_TEMPLATES.passwordChanged.getHtmlTemplate(userEmail, emergencyResetUrl),
    text: EMAIL_TEMPLATES.passwordChanged.getTextTemplate(userEmail, emergencyResetUrl),
    emergencyResetUrl
  };
};