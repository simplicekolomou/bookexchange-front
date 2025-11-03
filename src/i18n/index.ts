import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// If you want to load JSON files via HTTP (recommended for code-splitting):
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)                   // load /public/locales/{lng}/{ns}.json or configure path
    .use(LanguageDetector)              // detects from query, localStorage, navigator, etc.
    .use(initReactI18next)
    .init({
        supportedLngs: ["en", "fr"],
        ns: ["common", "auth", "layout"], // your namespaces
        defaultNS: "common",
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false, // react already escapes
        },
        detection: {
            // language detector options; defaults are good
            order: ["querystring", "localStorage", "navigator"],
            caches: ["localStorage"],
        },
        backend: {
            // if you keep JSON in /public/locales/{lng}/{ns}.json
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        react: {
            useSuspense: true, // show fallback while translations load
        },
        fallbackLng: {
            'en': ['fr'],   // if EN is missing, fall back to FR
            'default': ['fr']
        }
    });

export default i18n;
