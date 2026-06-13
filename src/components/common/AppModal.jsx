function AppModal({
  message,
  confirmText = "확인",
  cancelText,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="logout-confirm-overlay" role="presentation">
      <div
        className="logout-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
      >
        <p id="app-modal-title" className="logout-confirm-message">
          {message}
        </p>

        <div className="logout-confirm-actions">
          <button type="button" onClick={onConfirm}>
            {confirmText}
          </button>
          {cancelText && (
            <button type="button" onClick={onCancel}>
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppModal;
