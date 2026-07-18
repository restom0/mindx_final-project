import {Languages} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectLanguage, setLanguage} from "../features/settings/settingsSlice.js";

const languages = [
  {code: "en", label: "EN"},
  {code: "ca", label: "CA"},
  {code: "fr", label: "FR"},
  {code: "de", label: "DE"},
  {code: "es", label: "ES"},
  {code: "it", label: "IT"}
];

function LanguageSwitcher() {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const {t} = useTranslation();

  return (
    <label className="select-control" title={t("settings.language")}>
      <Languages size={18} aria-hidden="true" />
      <select
        aria-label={t("settings.language")}
        value={language}
        onChange={(event) => dispatch(setLanguage(event.target.value))}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSwitcher;
