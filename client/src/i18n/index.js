import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import ca from "./locales/ca.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";

const getStoredLanguage = () => {
  try {
    return localStorage.getItem("mindx-language") || "en";
  } catch {
    return "en";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: en},
    ca: {translation: ca},
    fr: {translation: fr},
    de: {translation: de},
    es: {translation: es},
    it: {translation: it}
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
