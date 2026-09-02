import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import api from "../api/axiosConfig";
import BookCard from "./BookCard";

function BookSection({ title, description, query, sort, isAuthenticated, handleLogout, showMessage}) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingBookKey, setSavingBookKey] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      try { 
        setIsLoading(true);
        const params = {
            q: query,
            sort: sort,
            limit: 40,
            fields:  "key,title,author_name,cover_i,first_publish_year,language,subject,isbn,publisher,number_of_pages_median",

        } 
        if(sort){
            params.sort = sort;
        }
        const response = await axios.get(
            "https://openlibrary.org/search.json", {params: params}

        );

        const booksData = Array.isArray(response.data.docs)
            ? response.data.docs
            : [];

        const cleanBooks = booksData.filter((book) => {
            return book.title && book.cover_i;
        });

        setBooks(cleanBooks.slice(0, 12));
      } catch (error) {
        console.log(error);
        setBooks([]);

        if (showMessage) {
                showMessage("No se pudieron cargar los libros.", "error");
            }
      } finally {
        setIsLoading(false);
      }
    };

    getBooks();
  }, [query, sort]);

  const getBookDescription = async (bookKey) => {
        if (!bookKey) {
            return null;
        }

        try {
            const response = await axios.get(
                `https://openlibrary.org${bookKey}.json`
            );

            const description = response.data.description;

            if (typeof description === "string") {
                return description;
            }

            if (description?.value) {
                return description.value;
            }

            return null;
        } catch (error) {
            console.log("No se pudo obtener la descripción:", error);
            return null;
        }
    };

    const handleViewDetail = (book) => {
        navigate(`/book-detail${book.key}`, {
            state: {
                book: book,
            },
        });
    };

    const handleSaveBook = async (book) => {
        if (!isAuthenticated) {
            showMessage("Debes iniciar sesión para guardar libros.", "error");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            showMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.", "error");
            handleLogout();
            navigate("/login");
            return;
        }

        try {
            setSavingBookKey(book.key);

            const bookDescription = await getBookDescription(book.key);

            const bookPayload = {
                book_title: book.title,
                book_author: book.author_name?.[0] || "Autor desconocido",
                book_isbn: book.isbn?.[0] || null,
                book_description: bookDescription,
                book_pages: book.number_of_pages_median || null,
                book_language: book.language?.[0] || null,
                book_category: book.subject?.[0] || null,
                book_cover_url: book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : null,
            };

            console.log("Payload enviado a /books:", bookPayload);

            const bookResponse = await api.post("/books", bookPayload);

            console.log("Respuesta completa de /books:", bookResponse);
            console.log("Datos de /books:", bookResponse.data);

            const bookId =
                bookResponse.data.book_id ||
                bookResponse.data.book?.book_id;

            if (!bookId) {
                showMessage("El backend no devolvió el book_id.", "error");
                return;
            }

            console.log("book_id recibido:", bookId);

            const libraryResponse = await api.post(
                "/library",
                {
                    library_book_id: bookId,
                    library_status: "pendiente",
                    library_format: "digital",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
        );

        console.log("Respuesta completa de /library:", libraryResponse);
        console.log("Datos de /library:", libraryResponse.data);

        showMessage("Libro guardado en tu biblioteca.", "success");
    } catch (error) {
        console.log("Error al guardar desde Home:", error);
        console.log("Status:", error.response?.status);
        console.log("Respuesta backend:", error.response?.data);

        if (error.response?.status === 401) {
            showMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.", "error");
            handleLogout();
            navigate("/login");
            return;
        }

        if (error.response?.status === 409) {
            showMessage(
                error.response?.data?.message ||
                    "Este libro ya está en tu biblioteca.",
                "error"
            );
            return;
        }

        showMessage(
            error.response?.data?.message ||
                "No se pudo guardar el libro.",
            "error"
        );
    } finally {
        setSavingBookKey(null);
    }
};

  return (
    <div className="book-section">
      <div className="section-title">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {isLoading ? (
        <p>Cargando libros...</p>
      ) : (
        <div className="home-books-grid">
            {books.length > 0 
            ? (
                books.map((book) => {
                    return (
                        <BookCard key={book.key} book={book}>
                            <div className="book-card-actions">
                                <button
                                    className="save-book-button"
                                    type="button"
                                    onClick={() => handleViewDetail(book)}
                                >
                                    Ver detalles
                                </button>

                                <button
                                    className="save-book-button"
                                    type="button"
                                    disabled={savingBookKey === book.key}
                                    onClick={() => handleSaveBook(book)}
                                >
                                    {savingBookKey === book.key
                                        ? "Guardando..."
                                        : "Guardar"}
                                </button>
                            </div>
                        </BookCard>
                    );
                })
            ) : (
                    <p>No se encontraron libros para esta sección.</p>
                )}
            </div>
            )}
        </div>
    );
}

export default BookSection;
                    