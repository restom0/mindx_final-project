import {X} from "lucide-react";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import Button from "./Button.jsx";

function Modal({children, isOpen, onClose, title}) {
  const {t} = useTranslation();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal__backdrop" type="button" aria-label={t("common.close")} onClick={onClose}/>
      <div className="modal__panel">
        <header className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <Button icon={<X size={18}/>} variant="ghost" size="sm" onClick={onClose}>
            {t("common.close")}
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
}

export default Modal;
