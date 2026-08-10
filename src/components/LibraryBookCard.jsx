import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faPen,faStar,faHeart,} from "@fortawesome/free-solid-svg-icons";

function LibraryBookCard({
    book,
    isEditing,
    onEdit,
    onDelete,
    onToggleFavorite,
    formatDateForInput,
}) {
    const statusLabels = {
        quiero_leer: "Quiero leer",
        pendiente: "Pendiente",
        leyendo: "Leyendo",
        terminado: "Completado",
        abandonado: "Abandonado",
    };

    const formatLabels = {
        papel: "Papel",
        digital: "Digital",
        audiolibro: "Audiolibro",
    };

    const ownershipLabels = {
        propio: "Propio",
        prestado: "Prestado",
        no_lo_tengo: "Pendiente de comprar",
    };

    const rating = Number(book.library_rating) || 0;
    const isFavorite = Boolean(book.library_favorite);

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((starNumber) => {
        return (
            <FontAwesomeIcon
            key={starNumber}
            icon={faStar}
            className={
                starNumber <= rating
                ? "library-star library-star-active"
                : "library-star"
            }
            />
        );
        });
    };

    return (
        <div className="library-book-card">
            <div className="library-book-cover">
                {book.book_cover_url ? (
                    <img src={book.book_cover_url} alt={book.book_title} />
                    ) : (
                    <span>Sin portada</span>
                    )}
            </div>

            <div className="library-book-info">
                <div className="library-book-title-row">
                <div>
                    <h2>{book.book_title}</h2>

                    <p className="library-book-author">{book.book_author}</p>
                </div>

                <button
                    className={
                        isFavorite
                        ? "library-favorite-button library-favorite-button-active"
                        : "library-favorite-button"
                    }
                    type="button"
                    onClick={() =>{
                        console.log("corazon pulsado", book.library_id); 
                        onToggleFavorite(book)}}
                    aria-label={
                        isFavorite
                        ? `Quitar ${book.book_title} de favoritos`
                        : `Marcar ${book.book_title} como favorito`
                    }
                    title={isFavorite ? "Quitar de favoritos" : "Marcar como favorito"}
                    >
                    <FontAwesomeIcon icon={faHeart} />
                </button>
                </div>

                {book.book_category && (
                <p className="library-book-category">{book.book_category}</p>
                )}

                <div className="library-book-properties">
                <p>
                    Estado:{" "}
                    <strong>
                    {statusLabels[book.library_status] || "Pendiente"}
                    </strong>
                </p>

                <p>
                    Formato:{" "}
                    <strong>
                    {formatLabels[book.library_format] || "Papel"}
                    </strong>
                </p>

                <p>
                    Propiedad:{" "}
                    <strong>
                    {ownershipLabels[book.library_ownership] || "Propio"}
                    </strong>
                </p>

                <p>
                    Página actual:{" "}
                    <strong>{book.library_current_page ?? 0}</strong>
                </p>

                {book.library_start_date && (
                    <p>
                    Inicio:{" "}
                    <strong>{formatDateForInput(book.library_start_date)}</strong>
                    </p>
                )}

                {book.library_finish_date && (
                    <p>
                    Finalizado:{" "}
                    <strong>{formatDateForInput(book.library_finish_date)}</strong>
                    </p>
                )}
                </div>

                <div className="library-rating-row">
                    <span>Valoración:</span>

                    <div className="library-stars">
                        {renderStars()}
                    </div>
                </div>

                {book.library_notes && (
                <div className="library-book-notes">
                    <span>Notas</span>
                    <p>{book.library_notes}</p>
                </div>
                )}
            

                <div className="library-book-actions">     
                    {!isEditing && (
                    <button
                        className="edit-library-book-button"
                        type="button"
                        onClick={() => onEdit(book)}
                        aria-label={`Editar ${book.book_title}`}
                        title="Editar libro"
                    >
                    <FontAwesomeIcon icon={faPen} />
                </button>
                )}

                <button
                    className="delete-library-book-button"
                    type="button"
                    onClick={() => onDelete(book.library_id)}
                    aria-label={`Eliminar ${book.book_title} de mi biblioteca`}
                    title="Eliminar de mi biblioteca"
                >
                <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
        </div>
    );
}

export default LibraryBookCard;