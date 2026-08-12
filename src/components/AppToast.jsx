function AppToast({ message, type = "info", onClose }) {
    if (!message) return null;

    return (
        <div className={`app-toast app-toast-${type}`}>
            <p>{message}</p>

            <button type="button" onClick={onClose} aria-label="Cerrar mensaje">
                ×
            </button>
        </div>
    );
}

export default AppToast;