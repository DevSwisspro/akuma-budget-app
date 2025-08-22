import { generatePasswordChangeEmail } from './email-templates.js';
import { getAuthRedirectUrl } from './auth-config.js';

/**
 * Service d'envoi d'emails personnalisés pour Akuma Budget
 * Alternative à Supabase pour un contrôle complet des templates
 */

/**
 * Envoie un email de notification de changement de mot de passe
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export const sendCustomPasswordChangeEmail = async (userEmail) => {
  try {
    console.log('📧 Envoi email personnalisé changement mot de passe pour:', userEmail);
    
    // Générer le contenu de l'email en français
    const emailContent = generatePasswordChangeEmail(userEmail);
    
    console.log('📋 Template email généré:', {
      subject: emailContent.subject,
      emergencyUrl: emailContent.emergencyResetUrl
    });
    
    // Option 1: Utiliser EmailJS (service gratuit)
    if (typeof window !== 'undefined' && window.emailjs) {
      return await sendViaEmailJS(userEmail, emailContent);
    }
    
    // Option 2: Utiliser l'API Resend (premium)
    if (import.meta.env.VITE_RESEND_API_KEY) {
      return await sendViaResend(userEmail, emailContent);
    }
    
    // Option 3: Fallback - utiliser Supabase avec notre template
    return await sendViaSupabaseFallback(userEmail, emailContent);
    
  } catch (error) {
    console.error('❌ Erreur envoi email personnalisé:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoi via EmailJS (gratuit, côté client)
 */
const sendViaEmailJS = async (userEmail, emailContent) => {
  try {
    const templateParams = {
      to_email: userEmail,
      subject: emailContent.subject,
      html_content: emailContent.html,
      emergency_url: emailContent.emergencyResetUrl
    };
    
    // Configuration EmailJS (à configurer dans la console EmailJS)
    const result = await window.emailjs.send(
      'service_akuma_budget', // Service ID
      'template_password_change', // Template ID  
      templateParams,
      'your_public_key' // Public Key
    );
    
    console.log('✅ Email envoyé via EmailJS:', result);
    return { success: true, service: 'EmailJS' };
    
  } catch (error) {
    console.error('❌ Erreur EmailJS:', error);
    throw error;
  }
};

/**
 * Envoi via Resend API (premium, côté serveur)
 */
const sendViaResend = async (userEmail, emailContent) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Akuma Budget <security@budget.dev-swiss.ch>',
        to: [userEmail],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      })
    });
    
    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Email envoyé via Resend:', result);
    return { success: true, service: 'Resend', id: result.id };
    
  } catch (error) {
    console.error('❌ Erreur Resend:', error);
    throw error;
  }
};

/**
 * Fallback via Supabase avec template personnalisé dans le contenu
 */
const sendViaSupabaseFallback = async (userEmail, emailContent) => {
  try {
    // Import dynamique pour éviter les erreurs côté serveur
    const { supabase } = await import('./supabase.js');
    
    // Utiliser resetPasswordForEmail mais avec nos URLs personnalisées
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: emailContent.emergencyResetUrl
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('⚠️ Email envoyé via Supabase (template par défaut)');
    console.log('💡 Pour un template français complet, configurez EmailJS ou Resend');
    
    return { 
      success: true, 
      service: 'Supabase', 
      note: 'Template par défaut - configurez EmailJS pour template français complet' 
    };
    
  } catch (error) {
    console.error('❌ Erreur Supabase fallback:', error);
    throw error;
  }
};

/**
 * Configuration EmailJS pour template français
 * À exécuter une fois dans la console du navigateur
 */
export const setupEmailJSTemplate = () => {
  console.log(`
📧 CONFIGURATION EMAILJS POUR AKUMA BUDGET

1. Créer un compte sur https://www.emailjs.com/
2. Créer un service email (Gmail, Outlook, etc.)
3. Créer un template avec ces variables :
   - {{to_email}} : Email destinataire
   - {{subject}} : ${EMAIL_TEMPLATES.passwordChanged.subject}
   - {{html_content}} : Contenu HTML
   - {{emergency_url}} : Lien de réinitialisation
   
4. Ajouter le SDK EmailJS :
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   
5. Initialiser :
   emailjs.init('YOUR_PUBLIC_KEY');
   
6. Tester l'envoi :
   sendCustomPasswordChangeEmail('test@example.com');
`);
};

// Fonction utilitaire pour vérifier la disponibilité des services
export const checkEmailServices = () => {
  const services = {
    emailjs: typeof window !== 'undefined' && window.emailjs,
    resend: !!import.meta.env.VITE_RESEND_API_KEY,
    supabase: true // Toujours disponible comme fallback
  };
  
  console.log('📧 Services email disponibles:', services);
  return services;
};