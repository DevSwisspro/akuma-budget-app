// Configuration d'authentification pour développement
export const AUTH_CONFIG = {
  // Mode développement - désactiver la vérification email
  isDevelopment: true,
  
  // Utilisateurs de test qui peuvent se connecter sans confirmation
  testUsers: [
    'devswisepro@proton.me'
  ],
  
  // Code OTP universel pour les tests
  devOTPCode: '000000',
  
  // URLs de production et développement
  productionUrl: 'https://budget.dev-swiss.ch',
  localDomains: ['localhost', '127.0.0.1', '0.0.0.0']
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

/**
 * Vérifie si nous sommes en environnement local
 */
export const isLocalEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return AUTH_CONFIG.localDomains.includes(hostname);
};

/**
 * Obtient l'URL de base selon l'environnement
 * En production, utilise toujours l'URL de production
 * En local, utilise l'URL locale pour les tests
 */
export const getBaseUrl = () => {
  // En production, toujours utiliser l'URL de production
  if (!isLocalEnvironment()) {
    return AUTH_CONFIG.productionUrl;
  }
  
  // En local, on peut utiliser l'URL locale pour les tests
  return window.location.origin;
};

/**
 * Obtient l'URL de redirection pour les emails d'authentification
 * Utilise TOUJOURS l'URL de production pour les emails sensibles
 */
export const getAuthRedirectUrl = (path = '/auth/callback') => {
  // Pour les emails de confirmation, toujours utiliser l'URL de production
  // même en développement local pour éviter les liens locaux dans les emails
  return `${AUTH_CONFIG.productionUrl}${path}`;
};
