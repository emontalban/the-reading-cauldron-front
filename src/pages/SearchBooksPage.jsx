import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../api/axiosConfig"
import BookCard from "../components/BookCard";

function SearchBooksPage({isAuthenticated, handleLogout}) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
   const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) {
      setBooks([]);
      setMessage("Busca un libro desde el buscador de la barra superior.");
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
            
        } catch (error) {
            console.log(error);

        setBooks([]);
            setMessage("No se pudo conectar con Open Library.");
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
        console.log("Entrando en handleSaveBook:", book);
        if(!isAuthenticated){
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");
        const bookDescription = await getBookDescription(book.key);
        console.log("Descripción encontrada:", bookDescription);
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

        try {
            const bookResponse = await api.post("/books", bookPayload);
             console.log("Respuesta de /books:", bookResponse.data);
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

        setMessage("Libro guardado en tu biblioteca.");
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401){
                setMessage("Tu sesion ha caducado.Vuelve a iniciar Sesion.");
                handleLogout();
                navigate("/login")
            }
            else if (error.response?.status === 409) {
                setMessage("Este libro ya existe o ya está guardado.");
            } else if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("No se pudo guardar el libro.");
            }
        }
  };
  return (
    <main className="search-books-page-wrapper">
      <section className="search-books-header">
        <h1>Resultados de búsqueda</h1>

        {query && (
          <p>
            Resultados para: <strong>{query}</strong>
          </p>
        )}

        {message && <p className="search-message">{message}</p>}
      </section>

      {isLoading ? (
        <p>Cargando libros...</p>
      ) : (
        <section className="search-books-grid">
          {books.map((book) => {
            return (
              <BookCard key={book.key} book={book}>
                <button className="save-book-button"
  type="button"
  onClick={() => {
    console.log("Botón pulsado:", book.title);
    handleSaveBook(book);
  }}
>
  Guardar en mi biblioteca
                </button>
              </BookCard>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default SearchBooksPage;


