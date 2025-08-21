import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Enregistrement du Service Worker pour PWA - Compatible tous navigateurs
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker enregistré:', registration.scope)
        
        // Gestion des mises à jour automatiques
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Nouvelle version disponible, rechargement...');
                // Attendre 2s puis recharger (compatible Safari/Firefox)
                setTimeout(() => {
                  if (confirm('Une nouvelle version est disponible. Recharger maintenant ?')) {
                    window.location.reload();
                  }
                }, 2000);
              }
            });
          }
        });

        // Vérification périodique des updates (tous les 60s)
        setInterval(() => {
          registration.update();
        }, 60000);
        
      })
      .catch(error => {
        console.log('❌ Erreur Service Worker:', error)
      })
  })

  // Écoute des messages du Service Worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('📱 Cache mis à jour');
    }
  });
}
