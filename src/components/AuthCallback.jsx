import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, AlertCircle, Loader } from 'lucide-react';

export default function AuthCallback() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer les paramètres URL pour la confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const token = urlParams.get('token');
        
        console.log('🔐 Callback d\'authentification:', { type, token: token?.substring(0, 10) + '...' });
        
        if (type === 'email_change' && token) {
          // Gérer la confirmation de changement d'email
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email_change'
          });
          
          if (error) {
            console.error('❌ Erreur confirmation email:', error);
            setStatus('error');
            setMessage('Erreur lors de la confirmation du changement d\'email: ' + error.message);
          } else {
            console.log('✅ Email confirmé avec succès');
            setStatus('success');
            setMessage('Votre adresse email a été mise à jour avec succès !');
            
            // Rediriger vers l'application après 3 secondes
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        } else if (type === 'signup' && token) {
          // Gérer la confirmation d'inscription
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });
          
          if (error) {
            console.error('❌ Erreur confirmation inscription:', error);
            setStatus('error');
            setMessage('Erreur lors de la confirmation d\'inscription: ' + error.message);
          } else {
            console.log('✅ Inscription confirmée avec succès');
            setStatus('success');
            setMessage('Votre compte a été confirmé avec succès !');
            
            // Rediriger vers l'application après 3 secondes
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        } else {
          // Cas général - essayer de gérer la session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Erreur session:', error);
            setStatus('error');
            setMessage('Erreur lors de la récupération de la session');
          } else if (data.session) {
            console.log('✅ Session récupérée');
            setStatus('success');
            setMessage('Authentification réussie !');
            
            // Rediriger vers l'application après 2 secondes
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Aucune session valide trouvée');
          }
        }
      } catch (error) {
        console.error('❌ Erreur callback auth:', error);
        setStatus('error');
        setMessage('Erreur inattendue: ' + error.message);
      }
    };

    handleAuthCallback();
  }, []);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="h-12 w-12 text-blue-500 animate-spin" />;
      case 'success':
        return <Check className="h-12 w-12 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Loader className="h-12 w-12 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {getIcon()}
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          {status === 'loading' && 'Vérification en cours...'}
          {status === 'success' && 'Succès !'}
          {status === 'error' && 'Erreur'}
        </h1>
        
        <p className={`text-lg mb-6 ${getStatusColor()}`}>
          {message || 'Traitement de votre demande...'}
        </p>
        
        {status === 'success' && (
          <p className="text-sm text-gray-500">
            Redirection automatique vers l'application...
          </p>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'application
          </button>
        )}
      </div>
    </div>
  );
}