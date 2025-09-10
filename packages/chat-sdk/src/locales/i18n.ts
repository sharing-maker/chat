import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./vi/common.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      vi: { common: vi },
    },
    lng: "vi", // default
    fallbackLng: "vi",
    interpolation: { escapeValue: false },
    ns: ["common"],
    defaultNS: "common",
  });
}

export default i18n;
