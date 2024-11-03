import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enJson from './locale/en.json';
import esJson from './locale/es.json';

i18n.use(initReactI18next).init({
  debug: false,
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { ...enJson },
    es: { ...esJson },
  },
});

export default i18n;
