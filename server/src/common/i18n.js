const en = require("../i18n/en.json");
const ca = require("../i18n/ca.json");
const fr = require("../i18n/fr.json");
const de = require("../i18n/de.json");
const es = require("../i18n/es.json");
const it = require("../i18n/it.json");

const dictionaries = {en, ca, fr, de, es, it};
const supportedLocales = Object.keys(dictionaries);

const resolveLocale = (acceptLanguage = "") => {
  const candidates = acceptLanguage
    .split(",")
    .map((entry) => entry.trim().split(";")[0].toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    const base = candidate.split("-")[0];
    if (supportedLocales.includes(base)) {
      return base;
    }
  }

  return "en";
};

const translate = (locale, key) => {
  return dictionaries[locale]?.[key] || dictionaries.en[key] || key;
};

const i18nMiddleware = (req, res, next) => {
  req.locale = resolveLocale(req.headers["accept-language"]);
  req.t = (key) => translate(req.locale, key);
  res.setHeader("Content-Language", req.locale);
  next();
};

module.exports = {i18nMiddleware, resolveLocale, supportedLocales, translate};
