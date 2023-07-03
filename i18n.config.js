import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { de, en, es, fr } from './utils/translations.util';

// empty for now
const resources = {
    en: {
        translation: en,
    },
    de: {
        translation: de,
    },
    fr: {
        translation: fr,
    },
    es: {
        translation: es,
    }
};

i18n.use(initReactI18next).init({
    resources,
    // Language to use if translations in user language are not available
    lng: Localization.locale,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    compatibilityJSON: 'v3',
    react: {
        useSuspense: false,
    }
});

export default i18n;