// Utilitaires de compatibilité cross-navigateur pour Akuma Budget
// Compatible: Chrome, Firefox, Safari (iOS/macOS), Brave, Edge

/**
 * Détection sécurisée du navigateur
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(userAgent);
  const isBrave = navigator.brave && navigator.brave.isBrave;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  return {
    isChrome: isChrome && !isBrave,
    isSafari,
    isFirefox,
    isBrave,
    isIOS,
    isWebKit: isSafari || isIOS,
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsPWA: 'serviceWorker' in navigator && 'PushManager' in window
  };
};

/**
 * LocalStorage sécurisé avec fallback
 */
export const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('LocalStorage non disponible:', error);
      return null;
    }
  },
  
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('LocalStorage écriture échouée:', error);
      return false;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('LocalStorage suppression échouée:', error);
      return false;
    }
  }
};

/**
 * Gestion PWA compatible Safari iOS
 */
export const PWAUtils = {
  // Détection si l'app est installée
  isInstalled: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true; // Safari iOS
  },
  
  // Prompt d'installation cross-navigateur
  canInstall: () => {
    const browser = getBrowserInfo();
    if (browser.isIOS && browser.isSafari) {
      // Safari iOS: installation manuelle via bouton "Partager"
      return true;
    }
    return 'beforeinstallprompt' in window;
  },
  
  // Instructions d'installation selon le navigateur
  getInstallInstructions: () => {
    const browser = getBrowserInfo();
    
    if (browser.isIOS && browser.isSafari) {
      return {
        title: "Installer Akuma Budget",
        steps: [
          "1. Appuyez sur le bouton Partager 📤",
          "2. Sélectionnez 'Sur l'écran d'accueil'",
          "3. Confirmez l'ajout"
        ]
      };
    }
    
    if (browser.isChrome || browser.isBrave) {
      return {
        title: "Installer Akuma Budget",
        steps: [
          "1. Cliquez sur l'icône d'installation dans la barre d'adresse",
          "2. Confirmez l'installation"
        ]
      };
    }
    
    if (browser.isFirefox) {
      return {
        title: "Ajouter Akuma Budget",
        steps: [
          "1. Cliquez sur le menu ☰",
          "2. Sélectionnez 'Installer cette application'",
          "3. Confirmez l'installation"
        ]
      };
    }
    
    return {
      title: "Installer l'application",
      steps: ["Utilisez les options de votre navigateur pour installer l'application"]
    };
  }
};

/**
 * Vérification des fonctionnalités natives
 */
export const FeatureDetection = {
  // Support des graphiques SVG
  supportsSVG: () => {
    return !!document.createElementNS && 
           !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  },
  
  // Support CSS modernes
  supportsCSS: (property) => {
    return CSS.supports && CSS.supports(property, 'initial');
  },
  
  // Support des modules ES6
  supportsModules: () => {
    const script = document.createElement('script');
    return 'noModule' in script;
  },
  
  // Détection du mode sombre système
  prefersDarkMode: () => {
    return window.matchMedia && 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  
  // Support des notifications push
  supportsPush: () => {
    return 'PushManager' in window && 'Notification' in window;
  }
};

/**
 * Polyfills pour les fonctionnalités manquantes
 */
export const initPolyfills = () => {
  // Polyfill CSS.supports pour IE/anciens navigateurs
  if (!window.CSS || !CSS.supports) {
    window.CSS = window.CSS || {};
    CSS.supports = () => false;
  }
  
  // Polyfill matchMedia pour très anciens navigateurs
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    });
  }
  
  // Console fallback pour environnements sans console
  if (!window.console) {
    window.console = {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {}
    };
  }
};

// Auto-initialisation des polyfills
initPolyfills();