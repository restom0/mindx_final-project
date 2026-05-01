import {lazy, Suspense, useEffect} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import AppShell from "./components/AppShell.jsx";
import Skeleton from "./components/Skeleton.jsx";
import {selectLanguage, selectTheme, setLanguage} from "./features/settings/settingsSlice.js";

const TodoPage = lazy(() => import("./pages/TodoPage.jsx"));
const InsightsPage = lazy(() => import("./pages/InsightsPage.jsx"));

function App() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const {i18n} = useTranslation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [i18n, language]);

  useEffect(() => {
    const browserLanguage = navigator.language?.split("-")[0];
    const supported = ["en", "ca", "fr", "de", "es", "it"];
    const savedLanguage = localStorage.getItem("mindx-language");

    if (!savedLanguage && supported.includes(browserLanguage)) {
      dispatch(setLanguage(browserLanguage));
    }
  }, [dispatch]);

  return (
    <AppShell>
      <Suspense fallback={<Skeleton rows={6}/>}>
        <Routes>
          <Route path="/" element={<TodoPage/>}/>
          <Route path="/insights" element={<InsightsPage/>}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default App;
