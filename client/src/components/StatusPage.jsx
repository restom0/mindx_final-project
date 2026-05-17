import {ArrowLeft, RefreshCcw} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Button from "./Button.jsx";
import Card from "./Card.jsx";
import StatusIllustration from "./StatusIllustration.jsx";

function StatusPage({variant = "notFound"}) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const prefix = variant === "serverDown" ? "status.serverDown" : "status.notFound";

  return (
    <section className="status-page">
      <Card className="status-card">
        <div className="status-card__content">
          <span className="status-card__kicker">{t(`${prefix}.kicker`)}</span>
          <h1>{t(`${prefix}.title`)}</h1>
          <p>{t(`${prefix}.subtitle`)}</p>
          <p className="status-card__note">{t(`${prefix}.note`)}</p>

          <div className="status-card__actions">
            <Button icon={<ArrowLeft size={18}/>} onClick={() => navigate("/")}>
              {t("status.actions.home")}
            </Button>
            {variant === "serverDown" ? (
              <Button
                icon={<RefreshCcw size={18}/>}
                variant="secondary"
                onClick={() => globalThis.window?.location?.reload()}
              >
                {t("status.actions.retry")}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="status-card__visual">
          <StatusIllustration title={t(`${prefix}.illustration`)} variant={variant}/>
        </div>
      </Card>
    </section>
  );
}

export default StatusPage;
