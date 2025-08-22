import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, ArrowLeft, Key, Check } from 'lucide-react';
import { resetPassword } from '../lib/supabase-auth';

export default function EmergencyReset() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('ready'); // ready, loading, sent, error
  const [message, setMessage] = useState('');
  const [isPasswordChangeContext, setIsPasswordChangeContext] = useState(false);

  useEffect(() => {
    // Récupérer les paramètres depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const reasonParam = urlParams.get('reason');
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    // Détecter si on vient d'un changement de mot de passe
    if (reasonParam === 'password_changed') {
      setIsPasswordChangeContext(true);
    }
  }, []);

  const handleEmergencyReset = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Veuillez entrer votre adresse email');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setStatus('sent');
        setMessage('Un email de réinitialisation a été envoyé à votre adresse email.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur inattendue lors de la réinitialisation');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Key className="h-12 w-12 text-blue-500 animate-pulse" />;
      case 'sent':
        return <Check className="h-12 w-12 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
      default:
        return <Shield className="h-12 w-12 text-orange-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sent':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'loading':
        return 'text-blue-600';
      default:
        return 'text-orange-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Icône et statut */}
        <div className="text-center mb-6">
          {getIcon()}
        </div>
        
        {/* Titre d'alerte */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPasswordChangeContext ? '🚨 Ce n\'était pas vous ?' : '🚨 Réinitialisation d\'urgence'}
          </h1>
          <p className="text-gray-600">
            {isPasswordChangeContext ? (
              <>
                Votre mot de passe a été modifié récemment. Si ce changement n'a pas été effectué par vous, 
                réinitialisez immédiatement votre mot de passe pour sécuriser votre compte.
              </>
            ) : (
              <>
                Réinitialisez votre mot de passe pour sécuriser votre compte.
              </>
            )}
          </p>
        </div>

        {status === 'ready' && (
          <>
            {/* Formulaire de réinitialisation */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <button
                onClick={handleEmergencyReset}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                🔒 Réinitialiser mon mot de passe maintenant
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'application
              </button>
            </div>
          </>
        )}

        {status === 'loading' && (
          <div className="text-center">
            <p className={`text-lg ${getStatusColor()}`}>
              Envoi de l'email de réinitialisation...
            </p>
          </div>
        )}

        {status === 'sent' && (
          <div className="text-center space-y-4">
            <p className={`text-lg ${getStatusColor()}`}>
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez votre boîte email et suivez les instructions pour 
              créer un nouveau mot de passe sécurisé.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Retour à l'application
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <p className={`text-lg ${getStatusColor()}`}>
              {message}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setStatus('ready')}
                className="w-full bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retour à l'application
              </button>
            </div>
          </div>
        )}

        {/* Message de sécurité */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Conseils de sécurité :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Utilisez un mot de passe unique et complexe</li>
                <li>Activez l'authentification à deux facteurs si disponible</li>
                <li>Ne partagez jamais vos identifiants</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}