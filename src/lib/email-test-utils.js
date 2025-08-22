/**
 * Utilitaires de test pour le système d'email personnalisé Akuma Budget
 */

import { generatePasswordChangeEmail } from './email-templates.js';
import { sendPasswordChangeNotification } from './supabase-auth.js';

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
    testTemplate: testEmailTemplate,
    testNotification: testPasswordChangeNotification,
    setupHelp: showEmailJSSetup,
    checkSetup: checkEmailSetup
  };
  
  console.log('🧪 Fonctions de test email disponibles:');
  console.log('- akumaEmailTest.testTemplate() : Prévisualiser template français');
  console.log('- akumaEmailTest.testNotification() : Tester envoi complet');
  console.log('- akumaEmailTest.setupHelp() : Instructions configuration');
  console.log('- akumaEmailTest.checkSetup() : Vérifier setup actuel');
}