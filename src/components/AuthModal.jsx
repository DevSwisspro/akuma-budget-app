import { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  signIn, 
  verifyOTP, 
  sendOTP, 
  formatAuthError 
} from '../lib/supabase-auth';
import { supabase } from '../lib/supabase';

const AuthModal = ({ isOpen, onClose, onAuthSuccess, darkMode = false }) => {
  // États du formulaire
  const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'signup'
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // États du formulaire d'inscription
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });

  // États du formulaire de connexion
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // États OTP
  const [otpForm, setOtpForm] = useState({
    email: '',
    otp: '',
    type: 'signup'
  });

  // États UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset des états quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError('');
      setSuccess('');
      setActiveTab('login');
    }
  }, [isOpen]);

  // Validation des formulaires
  const validateSignupForm = () => {
    if (!signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (signupForm.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email)) {
      setError('Format d\'email invalide');
      return false;
    }
    return true;
  };

  const validateLoginForm = () => {
    if (!loginForm.email || !loginForm.password) {
      setError('Veuillez remplir tous les champs');
      return false;
    }
    return true;
  };

  const validateOTPForm = () => {
    if (!otpForm.otp || otpForm.otp.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return false;
    }
    return true;
  };

  // Gestion de l'inscription
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateSignupForm()) {
      setLoading(false);
      return;
    }

    try {
      // Envoyer un code OTP à 6 chiffres par email pour inscription
      const result = await sendOTP(signupForm.email, true); // true = inscription

      if (result.success) {
        // Stocker les données d'inscription pour après la vérification OTP
        setOtpForm({
          email: signupForm.email,
          otp: '',
          type: 'signup',
          userData: {
            first_name: signupForm.first_name,
            last_name: signupForm.last_name
          }
        });
        setStep('otp');
        setSuccess('Un code à 6 chiffres a été envoyé à votre email. En mode développement, utilisez le code 000000.');
      } else {
        setError(formatAuthError(result.error));
      }
    } catch (error) {
      setError('Erreur inattendue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateLoginForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(loginForm.email, loginForm.password);

      if (result.success) {
        // Connexion réussie, pas besoin d'OTP pour la connexion classique
        onAuthSuccess(result.user);
        onClose();
      } else {
        setError(formatAuthError(result.error));
      }
    } catch (error) {
      setError('Erreur inattendue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la connexion avec OTP
  const handleLoginWithOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginForm.email) {
      setError('Veuillez entrer votre email');
      setLoading(false);
      return;
    }

    try {
      const result = await sendOTP(loginForm.email);

      if (result.success) {
        setOtpForm({
          email: loginForm.email,
          otp: '',
          type: 'magiclink'
        });
        setStep('otp');
        setSuccess('Un code de vérification a été envoyé à votre email.');
      } else {
        setError(formatAuthError(result.error));
      }
    } catch (error) {
      setError('Erreur inattendue lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la vérification OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateOTPForm()) {
      setLoading(false);
      return;
    }

    try {
      // Vérifier le code OTP (fonctionne pour connexion ET inscription)
      const result = await verifyOTP(otpForm.email, otpForm.otp, 'email');

      if (result.success) {
        setStep('success');
        
        if (otpForm.type === 'signup') {
          // Si c'est une inscription, mettre à jour le profil utilisateur
          try {
            const { error: updateError } = await supabase.auth.updateUser({
              data: {
                first_name: otpForm.userData?.first_name || '',
                last_name: otpForm.userData?.last_name || '',
                preferred_currency: 'CHF',
                preferred_language: 'fr',
                timezone: 'Europe/Zurich'
              }
            });
            
            if (updateError) {
              console.warn('Erreur mise à jour profil:', updateError);
            }
          } catch (updateError) {
            console.warn('Erreur lors de la mise à jour du profil:', updateError);
          }
          
          setSuccess('Compte créé avec succès ! Vous êtes maintenant connecté.');
        } else {
          setSuccess('Connexion réussie !');
        }
        
        if (result.user) {
          onAuthSuccess(result.user);
          setTimeout(() => onClose(), 2000);
        }
      } else {
        setError(formatAuthError(result.error));
      }
    } catch (error) {
      setError('Erreur inattendue lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  // Retour au formulaire
  const handleBackToForm = () => {
    setStep('form');
    setError('');
    setSuccess('');
  };

  // Fermeture du modal
  const handleClose = () => {
    setStep('form');
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {step === 'otp' ? 'Vérification' : 
             step === 'success' ? 'Succès' : 
             activeTab === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg hover:bg-opacity-10 ${
              darkMode ? 'hover:bg-white' : 'hover:bg-gray-900'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Bouton retour pour OTP */}
        {step === 'otp' && (
          <button
            onClick={handleBackToForm}
            className="flex items-center gap-2 mb-4 text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
        )}

        {/* Messages */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Contenu du modal */}
        {step === 'form' && (
          <>
            {/* Onglets */}
            <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Formulaire de connexion */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={`w-full rounded-lg border px-10 py-3 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={`w-full rounded-lg border px-10 py-3 pr-10 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLoginWithOTP}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-blue-600 px-4 py-3 text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Envoi...' : 'Code OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* Formulaire d'inscription */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={signupForm.first_name}
                      onChange={(e) => setSignupForm({ ...signupForm, first_name: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-3 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={signupForm.last_name}
                      onChange={(e) => setSignupForm({ ...signupForm, last_name: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-3 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className={`w-full rounded-lg border px-10 py-3 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className={`w-full rounded-lg border px-10 py-3 pr-10 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className={`w-full rounded-lg border px-10 py-3 pr-10 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Formulaire OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Un code de vérification a été envoyé à <strong>{otpForm.email}</strong>
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  💡 Mode développement : utilisez le code <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded font-mono">000000</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Code de vérification
              </label>
              <input
                type="text"
                value={otpForm.otp}
                onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className={`w-full rounded-lg border px-3 py-3 text-center text-lg font-mono ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Vérification...' : 'Vérifier le code'}
            </button>
          </form>
        )}

        {/* Écran de succès */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {otpForm.type === 'signup' 
                ? 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.'
                : 'Connexion réussie !'
              }
            </p>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
