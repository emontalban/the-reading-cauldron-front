import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../api/axiosConfig"
import BookCard from "../components/BookCard";
import AppToast from "../components/AppToast";


function SearchBooksPage({isAuthenticated, handleLogout}) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [savingBookKey, setSavingBookKey] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) {
        return;
    }

    const getBooks = async () => {
        try {
            setIsLoading(true);
            setMessage("");
            
            const response = await axios.get(
                "https://openlibrary.org/search.json",
                {
                    params: {
                    q: query,
                    limit: 24,
                    fields:  "key,title,author_name,cover_i,first_publish_year,language,subject,isbn,publisher,number_of_pages_median,first_sentence"
                    },
                }
            );

            const booksData = Array.isArray(response.data.docs)
                ? response.data.docs
                : [];

            const cleanBooks = booksData.filter((book) => {
                return book.title;
            });

            setBooks(cleanBooks);

            if (cleanBooks.length === 0) {
                setMessage("No se encontraron libros.");
            }
            
        } catch {
            setBooks([]);
            setMessage("No se pudo conectar con Open Library.");
            setMessageType("error")
        } finally {
            setIsLoading(false);
        }
    };

        getBooks();
    }, [query]);

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

    const handleSaveBook = async (book)=>{
        
        if(!isAuthenticated){
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");
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

        
        try {
            setSavingBookKey(book.key);

            const bookResponse = await api.post("/books", bookPayload);
                        const bookId = bookResponse.data.book_id;
            if (!bookId) {
                setMessage("El libro se creó, pero no se recibió el book_id.");
                return;
            }

        await api.post(
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

        showMessage("Libro guardado en tu biblioteca.", "success");


        } catch (error) {
        
            if (error.response?.status === 401){
                showMessage("Tu sesion ha caducado.Vuelve a iniciar Sesion.");
                handleLogout();
                navigate("/login");
                return;
            }
            if (error.response?.status === 409) {
                showMessage(error.response?.data?.message ||"Este libro ya existe o ya está guardado.", "error");
                return;
            } 
            showMessage(error.response.data.message || "No se pudo guardar el libro.",  "error");
        }
        finally{
            setSavingBookKey(null);

        }
        
    };
    const showMessage = (text, type = "info") => {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("info");
        }, 3500);
    };

    const handleViewDetail = (book) => {
        navigate(`/book-detail${book.key}`, {
            state: {
                book: book,
            },
        });
    };

    return (
        <div className="search-books-page-wrapper">
            <AppToast
                message={message}
                type={messageType}
                onClose={() => setMessage("")}
            />
            <div className="search-books-header">
                <h1>Resultados de búsqueda</h1>

                {query && (
                <p>
                    Resultados para: <strong>{query}</strong>
                </p>
                )}

               
            </div>

            {!query ? (
                <p>Busca un libro desde el buscador en la barra superior.</p>
            ):isLoading ? (
                <p>Cargando libros...</p>
            ) : (
                <div className="search-books-grid">
                {books.map((book) => {
                    return (
                    <BookCard key={book.key} book={book}>
                        <div className="book-card-actions">
                            <button
                                className="book-detail-button"
                                type="button"
                                onClick={() => handleViewDetail(book)}
                            >
                                Ver detalles
                            </button>
                            <button className="save-book-button"
                                type="button"
                                disabled={savingBookKey === book.key}
                                onClick={() => {
                                    handleSaveBook(book);
                                }}
                            >
                                {savingBookKey === book.key
                                    ? "Guardando..."
                                    : "Guardar"}
                            </button>
                            </div>
                    </BookCard>
                    );
                })}
            </div>
        )}
        </div>
    );
}

export default SearchBooksPage;


