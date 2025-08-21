// Configuration d'authentification pour développement
export const AUTH_CONFIG = {
  // Mode développement - désactiver la vérification email
  isDevelopment: true,
  
  // Utilisateurs de test qui peuvent se connecter sans confirmation
  testUsers: [
    'devswisepro@proton.me'
  ],
  
  // Code OTP universel pour les tests
  devOTPCode: '000000'
};

/**
 * Vérifie si un utilisateur est en mode test
 */
export const isTestUser = (email) => {
  return AUTH_CONFIG.isDevelopment && AUTH_CONFIG.testUsers.includes(email);
};

/**
 * Vérifie si c'est le code OTP de développement
 */
export const isDevOTP = (code) => {
  return AUTH_CONFIG.isDevelopment && code === AUTH_CONFIG.devOTPCode;
};
