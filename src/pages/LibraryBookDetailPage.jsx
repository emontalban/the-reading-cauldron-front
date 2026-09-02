import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axiosConfig";
import AppToast from "../components/AppToast";

function LibraryBookDetailPage({ handleLogout }) {
    const [bookDetail, setBookDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    const { libraryId } = useParams();
    const navigate = useNavigate();

    const showMessage = (text, type = "info") => {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("info");
        }, 3500);
    };

    const formatDateForInput = (dateValue) => {
        if (!dateValue) {
            return "";
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateValue))) {
            return dateValue;
        }

        const parsedDate = new Date(dateValue);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const isFavoriteValue = (value) => {
        return value === true || value === 1 || value === "1";
    };

    useEffect(() => {
        const getBookDetail = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setIsLoading(true);

                const response = await api.get("/library", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const booksData = Array.isArray(response.data)
                    ? response.data
                    : response.data.library || [];

                const selectedBook = booksData.find((book) => {
                    return Number(book.library_id) === Number(libraryId);
                });

                if (!selectedBook) {
                    showMessage("No se encontró este libro en tu biblioteca.", "error");
                    setBookDetail(null);
                    return;
                }

                setBookDetail(selectedBook);
            } catch (error) {
                console.log(error);
                console.log("Respuesta backend:", error.response?.data);

                if (error.response?.status === 401) {
                    showMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.", "error");
                    handleLogout();
                    navigate("/login");
                    return;
                }

                showMessage("No se pudo cargar el detalle del libro.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        getBookDetail();
    }, [libraryId, navigate, handleLogout]);

    if (isLoading) {
        return (
            <div className="library-detail-page-wrapper">
                <p>Cargando detalle del libro...</p>
            </div>
        );
    }

    if (!bookDetail) {
        return (
            <div className="library-detail-page-wrapper">
                <AppToast
                    message={message}
                    type={messageType}
                    onClose={() => setMessage("")}
                />

                <button
                    className="back-library-button"
                    type="button"
                    onClick={() => navigate("/library")}
                >
                    Volver a mi biblioteca
                </button>

                <p>No se encontró el libro.</p>
            </div>
        );
    }

    return (
        <div className="library-detail-page-wrapper">
            <AppToast
                message={message}
                type={messageType}
                onClose={() => setMessage("")}
            />

            <button
                className="back-library-button"
                type="button"
                onClick={() => navigate("/library")}
            >
                Volver a mi biblioteca
            </button>

            <div className="library-detail-card">
                <div className="library-detail-cover">
                    {bookDetail.book_cover_url ? (
                        <img src={bookDetail.book_cover_url} alt={bookDetail.book_title} />
                    ) : (
                        <span>Sin portada</span>
                    )}
                </div>

                <div className="library-detail-info">
                    <h1>{bookDetail.book_title}</h1>
                    <p className="library-detail-author">{bookDetail.book_author}</p>

                    <div className="library-detail-properties">
                        <p>
                            Estado: <strong>{bookDetail.library_status}</strong>
                        </p>

                        <p>
                            Formato: <strong>{bookDetail.library_format}</strong>
                        </p>

                        <p>
                            Propiedad: <strong>{bookDetail.library_ownership}</strong>
                        </p>

                        <p>
                            Valoración: <strong>{bookDetail.library_rating ?? 0}/5</strong>
                        </p>

                        <p>
                            Página actual: <strong>{bookDetail.library_current_page ?? 0}</strong>
                        </p>

                        <p>
                            Favorito:{" "}
                            <strong>
                                {isFavoriteValue(bookDetail.library_favorite) ? "Sí" : "No"}
                            </strong>
                        </p>

                        {bookDetail.library_start_date && (
                            <p>
                                Inicio:{" "}
                                <strong>{formatDateForInput(bookDetail.library_start_date)}</strong>
                            </p>
                        )}

                        {bookDetail.library_finish_date && (
                            <p>
                                Finalizado:{" "}
                                <strong>{formatDateForInput(bookDetail.library_finish_date)}</strong>
                            </p>
                        )}

                        {bookDetail.book_category && (
                            <p>
                                Categoría: <strong>{bookDetail.book_category}</strong>
                            </p>
                        )}

                        {bookDetail.book_language && (
                            <p>
                                Idioma: <strong>{bookDetail.book_language}</strong>
                            </p>
                        )}

                        {bookDetail.book_pages && (
                            <p>
                                Páginas: <strong>{bookDetail.book_pages}</strong>
                            </p>
                        )}
                    </div>

                    {bookDetail.book_description && (
                        <div className="library-detail-description">
                            <h2>Descripción</h2>
                            <p>{bookDetail.book_description}</p>
                        </div>
                    )}

                    {bookDetail.library_notes && (
                        <div className="library-detail-notes">
                            <h2>Mis notas</h2>
                            <p>{bookDetail.library_notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LibraryBookDetailPage;