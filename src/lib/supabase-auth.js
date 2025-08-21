// Importer le client Supabase existant pour éviter les conflits
import { supabase } from './supabase.js';
import { isTestUser, isDevOTP } from './auth-config.js';

// =====================================================
// FONCTIONS D'AUTHENTIFICATION
// =====================================================

/**
 * Inscription d'un nouvel utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @param {Object} userData - Données supplémentaires (first_name, last_name, etc.)
 * @returns {Promise<Object>} Résultat de l'inscription
 */
export const signUp = async (email, password, userData = {}) => {
  try {
    console.log('🔐 Début de l\'inscription pour:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          preferred_currency: userData.preferred_currency || 'CHF',
          preferred_language: userData.preferred_language || 'fr',
          timezone: userData.timezone || 'Europe/Zurich'
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Inscription réussie, email de confirmation envoyé');
    return { 
      success: true, 
      message: 'Un email de confirmation a été envoyé à votre adresse email.',
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de l\'inscription:', error);
    return { success: false, error: 'Erreur inattendue lors de l\'inscription' };
  }
};

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Résultat de la connexion
 */
export const signIn = async (email, password) => {
  try {
    console.log('🔐 Tentative de connexion pour:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      
      // Si l'email n'est pas confirmé et que c'est un utilisateur de test
      if (error.message.includes('Email not confirmed')) {
        if (isTestUser(email)) {
          console.log('🔧 Utilisateur de test détecté, connexion en mode développement');
          return { 
            success: true, 
            user: { 
              id: 'dev-user-' + email.split('@')[0], 
              email: email,
              confirmed_at: new Date().toISOString()
            },
            session: {
              access_token: 'dev-token-' + Date.now(),
              user: { 
                id: 'dev-user-' + email.split('@')[0], 
                email: email,
                confirmed_at: new Date().toISOString()
              }
            },
            isDevelopment: true
          };
        }
        
        return { 
          success: false, 
          error: 'Email non confirmé. Utilisez le code OTP pour activer votre compte.',
          needsConfirmation: true,
          email: email
        };
      }
      
      return { success: false, error: error.message };
    }

    console.log('✅ Connexion réussie');
    return { 
      success: true, 
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la connexion:', error);
    return { success: false, error: 'Erreur inattendue lors de la connexion' };
  }
};

/**
 * Déconnexion de l'utilisateur
 * @returns {Promise<Object>} Résultat de la déconnexion
 */
export const signOut = async () => {
  try {
    console.log('🔐 Déconnexion en cours...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Déconnexion réussie');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la déconnexion:', error);
    return { success: false, error: 'Erreur inattendue lors de la déconnexion' };
  }
};

/**
 * Vérification d'un code OTP
 * @param {string} email - Email de l'utilisateur
 * @param {string} token - Code OTP à 6 chiffres
 * @param {string} type - Type de vérification ('signup', 'magiclink', 'recovery')
 * @returns {Promise<Object>} Résultat de la vérification
 */
export const verifyOTP = async (email, token, type = 'signup') => {
  try {
    console.log('🔐 Vérification OTP pour:', email, 'type:', type);
    
    // Mode développement : si le code est "000000", on simule une confirmation réussie
    if (isDevOTP(token) && type === 'signup') {
      console.log('🔧 Mode développement : confirmation automatique');
      
      // Retourner un succès simulé avec des données factices mais valides
      return { 
        success: true, 
        user: { 
          id: 'dev-user-id', 
          email: email,
          confirmed_at: new Date().toISOString()
        },
        session: {
          access_token: 'dev-token',
          user: { 
            id: 'dev-user-id', 
            email: email,
            confirmed_at: new Date().toISOString()
          }
        },
        message: 'Compte confirmé en mode développement'
      };
    }
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    });

    if (error) {
      console.error('❌ Erreur lors de la vérification OTP:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ OTP vérifié avec succès');
    return { 
      success: true, 
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la vérification OTP:', error);
    return { success: false, error: 'Erreur inattendue lors de la vérification OTP' };
  }
};

/**
 * Envoi d'un code OTP pour connexion ou inscription
 * @param {string} email - Email de l'utilisateur
 * @param {boolean} isSignup - True si c'est une inscription
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export const sendOTP = async (email, isSignup = false) => {
  try {
    console.log('📧 Envoi OTP pour:', email, isSignup ? '(inscription)' : '(connexion)');
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: isSignup, // Créer l'utilisateur si inscription
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('❌ Erreur lors de l\'envoi OTP:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ OTP envoyé avec succès');
    return { 
      success: true, 
      message: 'Un code à 6 chiffres a été envoyé à votre email.'
    };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de l\'envoi OTP:', error);
    return { success: false, error: 'Erreur inattendue lors de l\'envoi OTP' };
  }
};

/**
 * Récupération de l'utilisateur actuel
 * @returns {Promise<Object|null>} Utilisateur actuel ou null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

/**
 * Récupération de la session actuelle
 * @returns {Promise<Object|null>} Session actuelle ou null
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erreur lors de la récupération de la session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la récupération de la session:', error);
    return null;
  }
};

/**
 * Écouteur de changement d'état d'authentification
 * @param {Function} callback - Fonction appelée lors des changements
 * @returns {Function} Fonction pour arrêter l'écoute
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Changement d\'état d\'authentification:', event, session?.user?.email);
    callback(event, session);
  });
  
  // Retourner la fonction unsubscribe
  return subscription.unsubscribe;
};

/**
 * Réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export const resetPassword = async (email) => {
  try {
    console.log('🔐 Demande de réinitialisation de mot de passe pour:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email de réinitialisation envoyé');
    return { 
      success: true, 
      message: 'Un email de réinitialisation a été envoyé à votre adresse email.'
    };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la réinitialisation:', error);
    return { success: false, error: 'Erreur inattendue lors de la réinitialisation' };
  }
};

/**
 * Mise à jour du mot de passe
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} Résultat de la mise à jour
 */
export const updatePassword = async (newPassword) => {
  try {
    console.log('🔐 Mise à jour du mot de passe...');
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('❌ Erreur lors de la mise à jour du mot de passe:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Mot de passe mis à jour avec succès');
    return { 
      success: true, 
      user: data.user
    };
  } catch (error) {
    console.error('❌ Erreur inattendue lors de la mise à jour du mot de passe:', error);
    return { success: false, error: 'Erreur inattendue lors de la mise à jour du mot de passe' };
  }
};

// =====================================================
// UTILITAIRES
// =====================================================

/**
 * Vérification si l'utilisateur est connecté
 * @returns {Promise<boolean>} True si connecté, false sinon
 */
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};

/**
 * Récupération de l'ID utilisateur actuel
 * @returns {Promise<string|null>} ID utilisateur ou null
 */
export const getCurrentUserId = async () => {
  const user = await getCurrentUser();
  return user?.id || null;
};

/**
 * Formatage des erreurs d'authentification
 * @param {string} error - Message d'erreur
 * @returns {string} Message formaté en français
 */
export const formatAuthError = (error) => {
  const errorMessages = {
    'Invalid login credentials': 'Email ou mot de passe incorrect',
    'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
    'User already registered': 'Un compte existe déjà avec cet email',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
    'Unable to validate email address: invalid format': 'Format d\'email invalide',
    'Token has expired or is invalid': 'Le code de vérification a expiré ou est invalide',
    'Email rate limit exceeded': 'Trop de tentatives. Veuillez réessayer plus tard'
  };

  return errorMessages[error] || error;
};

// Le client supabase est déjà exporté depuis ./supabase.js
