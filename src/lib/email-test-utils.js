/**
 * Utilitaires de test pour le système d'email personnalisé Akuma Budget
 */

import { 
  generatePasswordChangeEmail,
  generateSignupConfirmationEmail,
  generateEmailChangeEmail 
} from './email-templates.js';
import { sendPasswordChangeNotification } from './supabase-auth.js';
import { 
  sendCustomSignupConfirmationEmail,
  sendCustomEmailChangeEmail 
} from './custom-email-service.js';

/**
 * Teste la génération du template email français
 */
export const testEmailTemplate = (email = 'test@example.com') => {
  console.log('🧪 Test génération template email français');
  
  const emailContent = generatePasswordChangeEmail(email);
  
  console.log('📧 Template généré:');
  console.log('Subject:', emailContent.subject);
  console.log('Emergency URL:', emailContent.emergencyResetUrl);
  
  // Afficher l'aperçu HTML dans la console
  console.log('📋 Aperçu du contenu:');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = emailContent.html;
  console.log(tempDiv.textContent.substring(0, 500) + '...');
  
  // Créer un preview dans une nouvelle fenêtre
  const previewWindow = window.open('', '_blank', 'width=800,height=600');
  previewWindow.document.write(emailContent.html);
  previewWindow.document.title = 'Preview Email - Akuma Budget';
  
  return emailContent;
};

/**
 * Teste la génération du template inscription français
 */
export const testSignupTemplate = (email = 'test@example.com', token = 'test-token') => {
  console.log('🧪 Test génération template inscription français');
  
  const emailContent = generateSignupConfirmationEmail(email, token);
  
  console.log('📧 Template inscription généré:');
  console.log('Subject:', emailContent.subject);
  console.log('Confirmation URL:', emailContent.confirmationUrl);
  
  // Aperçu dans une nouvelle fenêtre
  const previewWindow = window.open('', '_blank', 'width=800,height=600');
  previewWindow.document.write(emailContent.html);
  previewWindow.document.title = 'Preview Inscription - Akuma Budget';
  
  return emailContent;
};

/**
 * Teste la génération du template changement email français
 */
export const testEmailChangeTemplate = (newEmail = 'nouveau@example.com', oldEmail = 'ancien@example.com') => {
  console.log('🧪 Test génération template changement email français');
  
  const emailContent = generateEmailChangeEmail(newEmail, oldEmail);
  
  console.log('📧 Template changement email généré:');
  console.log('Subject:', emailContent.subject);
  console.log('Restore URL:', emailContent.restoreUrl);
  
  // Aperçu dans une nouvelle fenêtre
  const previewWindow = window.open('', '_blank', 'width=800,height=600');
  previewWindow.document.write(emailContent.html);
  previewWindow.document.title = 'Preview Changement Email - Akuma Budget';
  
  return emailContent;
};

/**
 * Teste l'envoi complet de l'email d'inscription
 */
export const testSignupNotification = async (email = 'test@example.com', token = 'test-token') => {
  console.log('🧪 Test envoi email inscription français');
  console.log('📧 Email destinataire:', email);
  
  try {
    const result = await sendCustomSignupConfirmationEmail(email, token);
    
    if (result.success) {
      console.log('✅ Test inscription réussi!');
      console.log('Service utilisé:', result.service || 'Supabase');
    } else {
      console.log('❌ Test inscription échoué:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur test inscription:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Teste l'envoi complet de l'email de changement d'adresse
 */
export const testEmailChangeNotification = async (newEmail = 'nouveau@example.com', oldEmail = 'ancien@example.com') => {
  console.log('🧪 Test envoi email changement adresse français');
  console.log('📧 Nouvelle adresse:', newEmail);
  console.log('📧 Ancienne adresse:', oldEmail);
  
  try {
    const result = await sendCustomEmailChangeEmail(newEmail, oldEmail);
    
    if (result.success) {
      console.log('✅ Test changement adresse réussi!');
      console.log('Service utilisé:', result.service || 'Supabase');
    } else {
      console.log('❌ Test changement adresse échoué:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur test changement adresse:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Teste l'envoi complet de l'email de notification
 */
export const testPasswordChangeNotification = async (email = 'test@example.com') => {
  console.log('🧪 Test envoi notification changement mot de passe');
  console.log('📧 Email destinataire:', email);
  
  try {
    const result = await sendPasswordChangeNotification(email);
    
    if (result.success) {
      console.log('✅ Test réussi!');
      console.log('Service utilisé:', result.service || 'Supabase');
      if (result.note) console.log('Note:', result.note);
    } else {
      console.log('❌ Test échoué:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur test:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Instructions pour configurer EmailJS
 */
export const showEmailJSSetup = () => {
  console.log(`
🔧 CONFIGURATION EMAILJS POUR EMAILS FRANÇAIS

1. Créer compte sur https://www.emailjs.com/
2. Ajouter un service email (Gmail recommandé)
3. Créer un template avec ces paramètres :

   Template Name: akuma_password_change
   Subject: {{subject}}
   Content: {{{html_content}}}
   
4. Dans votre HTML, ajouter :
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   
5. Initialiser dans votre app :
   emailjs.init('VOTRE_PUBLIC_KEY');
   
6. Les emails seront alors envoyés en français complet !

📧 Template de test disponible avec testEmailTemplate()
🚀 Test complet avec testPasswordChangeNotification()
`);
};

/**
 * Vérifie les services email disponibles
 */
export const checkEmailSetup = () => {
  console.log('🔍 Vérification setup email...');
  
  const checks = {
    emailjs: {
      available: typeof window !== 'undefined' && window.emailjs,
      status: typeof window !== 'undefined' && window.emailjs ? '✅ Disponible' : '❌ Non configuré'
    },
    resend: {
      available: !!import.meta.env.VITE_RESEND_API_KEY,
      status: !!import.meta.env.VITE_RESEND_API_KEY ? '✅ Disponible' : '❌ Clé API manquante'
    },
    supabase: {
      available: true,
      status: '✅ Fallback toujours disponible'
    }
  };
  
  console.table(checks);
  
  if (!checks.emailjs.available && !checks.resend.available) {
    console.log('⚠️ Seul Supabase est configuré (template par défaut en anglais)');
    console.log('💡 Configurez EmailJS pour des emails français complets');
    showEmailJSSetup();
  }
  
  return checks;
};

/**
 * Export des fonctions pour utilisation dans la console du navigateur
 */
if (typeof window !== 'undefined') {
  window.akumaEmailTest = {
    // Templates de prévisualisation
    testPasswordTemplate: testEmailTemplate,
    testSignupTemplate: testSignupTemplate,
    testEmailChangeTemplate: testEmailChangeTemplate,
    
    // Envois réels
    testPasswordNotification: testPasswordChangeNotification,
    testSignupNotification: testSignupNotification,
    testEmailChangeNotification: testEmailChangeNotification,
    
    // Configuration
    setupHelp: showEmailJSSetup,
    checkSetup: checkEmailSetup
  };
  
  console.log('🧪 Fonctions de test email françaises disponibles:');
  console.log('📋 TEMPLATES (prévisualisation):');
  console.log('  - akumaEmailTest.testPasswordTemplate() : Changement mot de passe');
  console.log('  - akumaEmailTest.testSignupTemplate() : Inscription');
  console.log('  - akumaEmailTest.testEmailChangeTemplate() : Changement adresse');
  console.log('📧 ENVOIS REELS:');
  console.log('  - akumaEmailTest.testPasswordNotification() : Envoi mot de passe');
  console.log('  - akumaEmailTest.testSignupNotification() : Envoi inscription');
  console.log('  - akumaEmailTest.testEmailChangeNotification() : Envoi changement adresse');
  console.log('🔧 CONFIGURATION:');
  console.log('  - akumaEmailTest.setupHelp() : Instructions EmailJS');
  console.log('  - akumaEmailTest.checkSetup() : Vérifier services disponibles');
}