import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export default function ExplorerDialog({
  title,
  children,
  onClose,
  className = "",
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      queueMicrotask(() => {
        if (opener instanceof HTMLElement && opener.isConnected)
          opener.focus({ preventScroll: true });
      });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`explorer-dialog ${className}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-panel">
        <header className="dialog-header">
          <div>
            <span className="eyebrow">THE BARODA FIELD NOTES</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
            autoFocus
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
