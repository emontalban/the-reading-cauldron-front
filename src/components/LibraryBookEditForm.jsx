function LibraryBookEditForm({
  editFormData,
  onFieldChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="library-edit-fields">
      <label>
            Estado
            <select
            value={editFormData.library_status || "pendiente"}
            onChange={(event) =>
                onFieldChange("library_status", event.target.value)
            }
            >
            <option value="quiero_leer">Quiero leer</option>
            <option value="pendiente">Pendiente</option>
            <option value="leyendo">Leyendo</option>
            <option value="terminado">Completado</option>
            <option value="abandonado">Abandonado</option>
            </select>
        </label>

        <label>
            Formato
            <select
            value={editFormData.library_format || "papel"}
            onChange={(event) =>
                onFieldChange("library_format", event.target.value)
            }
            >
            <option value="papel">Papel</option>
            <option value="digital">Digital</option>
            <option value="audiolibro">Audiolibro</option>
            </select>
        </label>

        <label>
            Valoración
            <input
            type="number"
            min="0"
            max="5"
            value={editFormData.library_rating ?? ""}
            onChange={(event) =>
                onFieldChange("library_rating", event.target.value)
            }
            placeholder="0-5"
            />
        </label>

        <label>
            Página actual
            <input
            type="number"
            min="0"
            value={editFormData.library_current_page ?? 0}
            onChange={(event) =>
                onFieldChange("library_current_page", event.target.value)
            }
            />
        </label>

        <label>
            Fecha de inicio
            <input
            type="date"
            value={editFormData.library_start_date || ""}
            onChange={(event) =>
                onFieldChange("library_start_date", event.target.value)
            }
            />
        </label>

        <label>
            Fecha de finalización
            <input
            type="date"
            value={editFormData.library_finish_date || ""}
            onChange={(event) =>
                onFieldChange("library_finish_date", event.target.value)
            }
            />
        </label>

        <label>
            Propiedad
            <select
            value={editFormData.library_ownership || "propio"}
            onChange={(event) =>
                onFieldChange("library_ownership", event.target.value)
            }
            >
            <option value="propio">Propio</option>
            <option value="prestado">Prestado</option>
            <option value="no_lo_tengo">Pendiente de comprar</option>
            </select>
        </label>

        <label className="library-favorite-label">
            <input
            type="checkbox"
            checked={Boolean(editFormData.library_favorite)}
            onChange={(event) =>
                onFieldChange("library_favorite", event.target.checked)
            }
            />
            Favorito
        </label>

        <label>
            Notas
            <textarea
            value={editFormData.library_notes || ""}
            onChange={(event) =>
                onFieldChange("library_notes", event.target.value)
            }
            placeholder="Añade tus notas sobre este libro"
            />
        </label>

        <div className="library-edit-actions">
            <button
            className="save-library-book-button"
            type="button"
            onClick={onSave}
            >
            Guardar cambios
            </button>

            <button
            className="cancel-library-book-button"
            type="button"
            onClick={onCancel}
            >
            Cancelar
            </button>
        </div>
    </div>
  );
}

export default LibraryBookEditForm;