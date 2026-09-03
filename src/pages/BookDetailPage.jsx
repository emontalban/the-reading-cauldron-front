import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BookDetailPage() {
    const [bookDetail, setBookDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { workId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const bookFromState = location.state?.book;

    useEffect(() => {
        const getBookDetail = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get(
                    `https://openlibrary.org/works/${workId}.json`
                );

                setBookDetail(response.data);
            } catch (error) {
                console.log(error);
                setBookDetail(null);
            } finally {
                setIsLoading(false);
            }
        };

        getBookDetail();
    }, [workId]);

    const getDescription = () => {
        if (!bookDetail?.description) {
            return "Este libro no tiene descripción disponible.";
        }

        if (typeof bookDetail.description === "string") {
            return bookDetail.description;
        }

        if (bookDetail.description?.value) {
            return bookDetail.description.value;
        }

        return "Este libro no tiene descripción disponible.";
    };

    const coverUrl = bookFromState?.cover_i
        ? `https://covers.openlibrary.org/b/id/${bookFromState.cover_i}-L.jpg`
        : bookDetail?.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${bookDetail.covers[0]}-L.jpg`
            : null;

    if (isLoading) {
        return (
            <div className="book-detail-page-wrapper">
                <p>Cargando detalle del libro...</p>
            </div>
        );
    }

    if (!bookDetail) {
        return (
            <div className="book-detail-page-wrapper">
                <button
                    className="back-library-button"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                <p>No se pudo cargar el detalle del libro.</p>
            </div>
        );
    }

    return (
        <div className="book-detail-page-wrapper">
            
            <div className="book-detail-card">
                <div className="book-detail-cover">
                    {coverUrl ? (
                        <img src={coverUrl} alt={bookDetail.title} />
                    ) : (
                        <span>Sin portada</span>
                    )}
                </div>

                <div className="book-detail-info">
                    <h1>{bookDetail.title}</h1>

                    {bookFromState?.author_name?.[0] && (
                        <p className="book-detail-author">
                            {bookFromState.author_name[0]}
                        </p>
                    )}

                    {bookFromState?.first_publish_year && (
                        <p>
                            Año de publicación:{" "}
                            <strong>{bookFromState.first_publish_year}</strong>
                        </p>
                    )}

                    {bookFromState?.language?.[0] && (
                        <p>
                            Idioma: <strong>{bookFromState.language[0]}</strong>
                        </p>
                    )}

                    {bookFromState?.number_of_pages_median && (
                        <p>
                            Páginas aproximadas:{" "}
                            <strong>{bookFromState.number_of_pages_median}</strong>
                        </p>
                    )}

                    <div className="book-detail-description">
                        <h2>Descripción</h2>
                        <p>{getDescription()}</p>
                    </div>

                    {bookDetail.subjects?.length > 0 && (
                        <div className="book-detail-subjects">
                            <h2>Categorías</h2>

                            <div className="book-detail-subject-list">
                                {bookDetail.subjects.slice(0, 12).map((subject) => {
                                    return (
                                        <span key={subject}>
                                            {subject}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="book-detail-back-actions">
                <button
                    className="back-library-button"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}

export default BookDetailPage;