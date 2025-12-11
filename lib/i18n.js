/**
 * Internationalization (i18n) System
 * Multi-language support for global expansion
 */

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

/**
 * Translation strings
 * In production, load from JSON files or translation service
 */
const translations = {
  en: {
    // Navigation
    discover: 'Discover',
    matches: 'Matches',
    messages: 'Messages',
    profile: 'Profile',
    groups: 'Groups',
    events: 'Events',
    forums: 'Forums',
    help: 'Help',
    premium: 'Premium',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    
    // Profile
    editProfile: 'Edit Profile',
    uploadPhotos: 'Upload Photos',
    verifyProfile: 'Verify Profile',
    
    // Messages
    typeMessage: 'Type a message...',
    send: 'Send',
    
    // Discover
    noMatches: 'No matches found',
    adjustFilters: 'Try adjusting your filters',
  },
  es: {
    discover: 'Descubrir',
    matches: 'Coincidencias',
    messages: 'Mensajes',
    profile: 'Perfil',
    groups: 'Grupos',
    events: 'Eventos',
    forums: 'Foros',
    help: 'Ayuda',
    premium: 'Premium',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    filter: 'Filtrar',
    loading: 'Cargando...',
    editProfile: 'Editar Perfil',
    uploadPhotos: 'Subir Fotos',
    verifyProfile: 'Verificar Perfil',
    typeMessage: 'Escribe un mensaje...',
    send: 'Enviar',
    noMatches: 'No se encontraron coincidencias',
    adjustFilters: 'Intenta ajustar tus filtros',
  },
  fr: {
    discover: 'Découvrir',
    matches: 'Correspondances',
    messages: 'Messages',
    profile: 'Profil',
    groups: 'Groupes',
    events: 'Événements',
    forums: 'Forums',
    help: 'Aide',
    premium: 'Premium',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    filter: 'Filtrer',
    loading: 'Chargement...',
    editProfile: 'Modifier le Profil',
    uploadPhotos: 'Télécharger des Photos',
    verifyProfile: 'Vérifier le Profil',
    typeMessage: 'Tapez un message...',
    send: 'Envoyer',
    noMatches: 'Aucune correspondance trouvée',
    adjustFilters: 'Essayez d\'ajuster vos filtres',
  },
  // Add more languages as needed...
};

/**
 * Get current language
 * @returns {string} Language code
 */
export function getCurrentLanguage() {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('app_language') || 'en';
}

/**
 * Set current language
 * @param {string} langCode - Language code
 */
export function setLanguage(langCode) {
  if (typeof window === 'undefined') return;
  if (SUPPORTED_LANGUAGES.find(l => l.code === langCode)) {
    localStorage.setItem('app_language', langCode);
  }
}

/**
 * Translate text
 * @param {string} key - Translation key
 * @param {string} lang - Language code (optional)
 * @returns {string} Translated text
 */
export function t(key, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  const langTranslations = translations[currentLang] || translations.en;
  return langTranslations[key] || key;
}

/**
 * Get all translations for a language
 * @param {string} langCode - Language code
 * @returns {Object} Translations object
 */
export function getTranslations(langCode) {
  return translations[langCode] || translations.en;
}

/**
 * Format date according to locale
 * @param {Date|string} date - Date to format
 * @param {string} langCode - Language code
 * @returns {string} Formatted date
 */
export function formatDate(date, langCode = null) {
  const lang = langCode || getCurrentLanguage();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    ar: 'ar-SA',
    hi: 'hi-IN',
    ru: 'ru-RU',
  };

  const locale = localeMap[lang] || 'en-US';
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format number according to locale
 * @param {number} number - Number to format
 * @param {string} langCode - Language code
 * @returns {string} Formatted number
 */
export function formatNumber(number, langCode = null) {
  const lang = langCode || getCurrentLanguage();
  
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    ar: 'ar-SA',
    hi: 'hi-IN',
    ru: 'ru-RU',
  };

  const locale = localeMap[lang] || 'en-US';
  return new Intl.NumberFormat(locale).format(number);
}

