import {GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";
import {LogIn, LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectAuth, setGoogleSession} from "../features/auth/authSlice.js";
import Button from "./Button.jsx";

function GoogleLoginInner() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const {t} = useTranslation();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(setGoogleSession({accessToken: tokenResponse.access_token}));
    },
    onError: () => undefined
  });

  if (auth.accessToken) {
    return (
      <Button icon={<LogOut size={18}/>} variant="secondary" size="sm" onClick={() => dispatch(logout())}>
        {t("auth.logout")}
      </Button>
    );
  }

  return (
    <Button icon={<LogIn size={18}/>} variant="secondary" size="sm" onClick={() => login()}>
      {t("auth.google")}
    </Button>
  );
}

function GoogleLoginButton() {
  const {t} = useTranslation();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <Button icon={<LogIn size={18}/>} variant="secondary" size="sm" disabled title={t("auth.googleMissing")}>
        {t("auth.google")}
      </Button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLoginInner/>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
