import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en/common.json";
import pl from "@/locales/pl/common.json";
import uk from "@/locales/uk/common.json";
import de from "@/locales/de/common.json";

const resources = {
  en: { common: en },
  pl: { common: pl },
  uk: { common: uk },
  de: { common: de },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pl",
    ns: ["common"],
    defaultNS: "common",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "appLang",
    },
  });

export default i18n;
