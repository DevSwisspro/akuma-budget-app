// Templates d'emails personnalisés en français pour Akuma Budget

export const EMAIL_TEMPLATES = {
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