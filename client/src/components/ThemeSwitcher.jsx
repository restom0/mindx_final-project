import {Moon, Sun} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectTheme, toggleTheme} from "../features/settings/settingsSlice.js";
import Button from "./Button.jsx";

function ThemeSwitcher() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const {t} = useTranslation();
  const isDark = theme === "dark";

  return (
    <Button
      icon={isDark ? <Moon size={18} /> : <Sun size={18} />}
      variant="secondary"
      size="sm"
      aria-pressed={isDark}
      onClick={() => dispatch(toggleTheme())}
    >
      {isDark ? t("settings.dark") : t("settings.light")}
    </Button>
  );
}

export default ThemeSwitcher;
