import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import api from "../api/axiosConfig";
import BookCard from "../components/BookCard";

function LibraryPage({handleLogout}) {
    const [libraryBooks, setLibraryBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getLibraryBooks = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setIsLoading(true);
            setMessage("");

            const response = await api.get("/library", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            console.log("Respuesta de /library:", response.data);

            const booksData = Array.isArray(response.data)
            ? response.data
            : response.data.library || [];

            setLibraryBooks(booksData);

            if (booksData.length === 0) {
            setMessage("Todavía no tienes libros guardados.");
            }
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
                handleLogout();
                navigate("/login");
            
            } else {
                setMessage("No se pudo cargar tu biblioteca.");
            }
        } finally {
            setIsLoading(false);
        }
        };

        getLibraryBooks();
    }, [navigate]);

    const handleDeleteBook = async(libraryId) =>{
        const token = localStorage.getItem("token");

        if(!token){
            navigate("/login");
            return;
        }
        try {
            await api.delete(`/library/${libraryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLibraryBooks((currentBooks) => {
            return currentBooks.filter((book) => {
                return book.library_id !== libraryId;
            });
        });

            setMessage("Libro eliminado de tu biblioteca.");
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
                handleLogout();
                navigate("/login");
            } else {
                setMessage("No se pudo eliminar el libro.");
            }
        }
    };

    const handleLibraryFieldChange = (libraryId, fieldName, value)=>{
        setLibraryBooks((currentBooks)=>{
            return currentBooks.map((book)=>{
                if (book.library_id === libraryId){
                    return{
                        ...book,
                        [fieldName]: value
,                    };
                }
                return book;
            });
        });
    }
    const handleUpdateLibraryBook = async (book) =>{
        const token = localStorage.getItem("token")

        if (!token){
            navigate("/login")
            return;
        }
    
        const updatePayload = {
            library_status: book.library_status || "pendiente",
            library_format: book.library_format || "papel",
            library_rating: 
                book.library_rating === "" || book.library_rating == null
                ? null
                : Number(book.library_rating),
            library_current_page: 
                book.library_current_page === "" || book.library_current_page == null
                ? 0
                : Number(book.library_current_page),
            library_notes: book.library_notes || null,
            library_favorite: Boolean(book.library_favorite),
            library_ownership: book.library_ownership || "propio",
            library_start_date: book.library_start_date 
                ? String(book.library_start_date).slice(0, 10)
                : null,
            library_finish_date: book.library_finish_date
                ? String(book.library_finish_date).slice(0, 10)
                : null,
        };
        try{
            await api.put(`/library/${book.library_id}`, updatePayload,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Cambios guardados correctamente");
        }catch(error){
            console.log(error);
            if(error.response?.status === 401){
                setMessage("Tu sesion ha caducado. Vuelve a iniciar sesion");
                handleLogout();
                navigate("/login")
            }else {
                setMessage(
                    error.response?.data?.message ||
                    "No se puedieron guardar los cambios.");
                console.log("Respuesta backend:", error.response?.data);
            }
        }
    }
    const formatDateForInput = (dateValue) => {
        if (!dateValue) {
            return "";
        }

        return String(dateValue).slice(0, 10);
        };
     return (
        <div className="library-page-wrapper">
        <div className="library-header">
            <h1>Mi biblioteca</h1>

            <p>
            Aquí aparecen los libros que has guardado en tu biblioteca personal.
            </p>
        </div>

        {message && <p className="library-message">{message}</p>}

        {isLoading ? (
            <p>Cargando biblioteca...</p>
        ) : (
            <div className="library-books-grid">
            {libraryBooks.length > 0 ? (
                libraryBooks.map((book) => {
                return (
                    <div className="library-book-card" key={book.library_id}>
                        <div className="library-book-cover">
                            {book.book_cover_url ? (
                            <img src={book.book_cover_url} alt={book.book_title} />
                            ) : (
                            <span>Sin portada</span>
                            )}
                        </div>

                        <div className="library-book-info">
                            <h2>{book.book_title}</h2>

                            <p className="library-book-author">
                            {book.book_author}
                            </p>

                            {book.book_category && (
                            <p className="library-book-category">
                                {book.book_category}
                            </p>
                            )}

                            <p>
                            Estado:{" "}
                            <strong>
                                {book.library_status || "pendiente"}
                            </strong>
                            </p>

                            <p>
                            Formato:{" "}
                            <strong>
                                {book.library_format || "sin definir"}
                            </strong>
                            </p>

                            {book.library_rating !== null &&
                            book.library_rating !== undefined && (
                                <p>
                                Valoración:{" "}
                                <strong>{book.library_rating}/5</strong>
                                </p>
                            )}
                        </div>
                        <div className="library-edit-fields">
                        <label>
                            Estado
                            <select
                            value={book.library_status || "pendiente"}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_status",
                                event.target.value
                                )
                            }
                            >
                            <option value="pendiente">Pendiente</option>
                            <option value="quiero_leer">Quiero Leer</option>
                            <option value="leyendo">Leyendo</option>
                            <option value="terminado">Completado</option>
                            <option value="abandonado">Abandonado</option>
                            </select>
                        </label>

                        <label>
                            Formato
                            <select
                            value={book.library_format || "digital"}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_format",
                                event.target.value
                                )
                            }
                            >
                            <option value="digital">Digital</option>
                            <option value="papel">Papel</option>
                            <option value="audiolibro">Audiolibro</option>
                            </select>
                        </label>

                        <label>
                            Valoración
                            <input
                            type="number"
                            min="0"
                            max="5"
                            value={book.library_rating ?? ""}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_rating",
                                event.target.value
                                )
                            }
                            placeholder="0-5"
                            />
                        </label>

                        <label>
                            Página actual
                            <input
                            type="number"
                            min="0"
                            value={book.library_current_page ?? 0}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_current_page",
                                event.target.value
                                )
                            }
                            />
                        </label>

                        <label>
                            Fecha de inicio
                            <input
                            type="date"
                            value={formatDateForInput(book.library_start_date)}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_start_date",
                                event.target.value
                                )
                            }
                            />
                        </label>

                        <label>
                            Fecha de finalización
                            <input
                            type="date"
                            value={formatDateForInput(book.library_finish_date)}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_finish_date",
                                event.target.value
                                )
                            }
                            />
                        </label>

                        <label>
                            Propiedad
                            <select
                            value={book.library_ownership || "propio"}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_ownership",
                                event.target.value
                                )
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
                            checked={Boolean(book.library_favorite)}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_favorite",
                                event.target.checked
                                )
                            }
                            />
                            Favorito
                        </label>

                        <label>
                            Notas
                            <textarea
                            value={book.library_notes || ""}
                            onChange={(event) =>
                                handleLibraryFieldChange(
                                book.library_id,
                                "library_notes",
                                event.target.value
                                )
                            }
                            placeholder="Añade tus notas sobre este libro"
                            />
                        </label>

                        <button
                            className="save-library-book-button"
                            type="button"
                            onClick={() => handleUpdateLibraryBook(book)}
                        >
                            Guardar cambios
                        </button>
                        </div>
                        <button
                            className="delete-library-book-button"
                            type="button"
                            onClick={() => handleDeleteBook(book.library_id)}
                            aria-label={`Eliminar ${book.book_title} de mi biblioteca`}
                            title="Eliminar de mi biblioteca"
                            >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                );
                })
            ) : (
                <p>Todavía no tienes libros guardados.</p>
            )}
            </div>
        )}
        </div>
    );
}

export default LibraryPage;