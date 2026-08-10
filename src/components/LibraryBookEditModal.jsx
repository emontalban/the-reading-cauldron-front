import LibraryBookEditForm from "./LibraryBookEditForm";

function LibraryBookEditModal({
    isOpen,
    bookTitle,
    editFormData,
    onFieldChange,
    onSave,
    onCancel,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="library-modal-overlay" onClick={onCancel}>
        <div
            className="library-modal-content"
            onClick={(event) => event.stopPropagation()}
        >
            <div className="library-modal-header">
            <h2>Editar libro</h2>

            {bookTitle && <p>{bookTitle}</p>}

            <button
                className="library-modal-close-button"
                type="button"
                onClick={onCancel}
                aria-label="Cerrar edición"
            >
                ×
            </button>
            </div>

            <LibraryBookEditForm
            editFormData={editFormData}
            onFieldChange={onFieldChange}
            onSave={onSave}
            onCancel={onCancel}
            />
        </div>
        </div>
    );
}

export default LibraryBookEditModal;