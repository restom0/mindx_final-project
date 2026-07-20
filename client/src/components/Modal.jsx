import {X} from "lucide-react";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import Button from "./Button.jsx";

function Modal({children, isOpen, onClose, title}) {
  const {t} = useTranslation();
  const dialogRef = useRef(null);

  // Drive the native <dialog>. showModal() gives focus trapping, an inert
  // background, Escape-to-close, and return-focus for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <dialog
      className="modal"
      ref={dialogRef}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClose={() => onClose?.()}
    >
      {isOpen ? (
        <div className="modal__panel">
          <header className="modal__header">
            <h2 id="modal-title">{title}</h2>
            <Button icon={<X size={18} />} variant="ghost" size="sm" onClick={() => onClose?.()}>
              {t("common.close")}
            </Button>
          </header>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}

export default Modal;
