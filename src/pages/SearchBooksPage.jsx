import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";

function SearchBooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const normalizedQuery = query.trim();
  const visibleBooks = normalizedQuery ? books : [];
  const visibleMessage = normalizedQuery
    ? message
    : "Busca un libro desde el buscador de la barra superior.";


  useEffect(() => {
    if (!normalizedQuery) {
       return;
    }

    const controller = new AbortController();

    const getBooks = async () => {
        setIsLoading(true);
        setMessage("");

      try {
        const response = await api.get("/google-books", {
            params: {
                q: normalizedQuery,
            },
            signal: controller.signal,
        });

        const results = Array.isArray(response.data.books)
          ? response.data.books
          : [];

        setBooks(results);

        setMessage(
            results.length === 0
            ? "No se encontraron libros."
            : ""
        );

      } catch (error) {
    
        if (
            error.code === "ERR_CANCELED" ||
            controller.signal.aborted
        ) {
            return;
        }

        console.error("Error buscando libros:", error);

        setBooks([]);
        setMessage(
             error.response?.data?.message ||
            "No se pudo conectar con Google Books.",
        );

     
        } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        getBooks();

        
        return () => {
            controller.abort();
        };
        }, [normalizedQuery]);

  return (
    <div className="search-books-page-wrapper">
      <div className="search-books-header">
        <h1>Resultados de búsqueda</h1>

        {query && (
          <p>
            Resultados para: <strong>{query}</strong>
          </p>
        )}

        {message && <p className="search-message">{message}</p>}
      </div>

      {isLoading ? (
        <p>Cargando libros...</p>
      ) : (
        <div className="books-grid">
          {visibleBooks.map((book) => {
                const volumeInfo = book.volumeInfo || {};

                const title = volumeInfo.title || "Título no disponible";
                const authors =
                volumeInfo.authors?.join(", ") || "Autor no disponible";
                const category = volumeInfo.categories?.[0] || "";
                const publishedDate = volumeInfo.publishedDate || "";
                const description = volumeInfo.description || "";
                const coverUrl = volumeInfo.imageLinks?.thumbnail || null;

                return (
                <div className="book-card" key={book.id}>
                    <div className="book-cover">
                    {coverUrl ? (
                        <img src={coverUrl} alt={title} />
                    ) : (
                        <span>Sin portada</span>
                    )}
                    </div>

                    <div className="book-info">
                    <h2>{title}</h2>

                    <p className="book-author">{authors}</p>

                    {publishedDate && (
                        <p className="book-year">Publicado: {publishedDate}</p>
                    )}

                    {category && <p className="book-category">{category}</p>}

                    {description && (
                        <p className="book-description">
                        {description.length > 180
                            ? `${description.slice(0, 180)}...`
                            : description}
                        </p>
                    )}

                    <div className="book-actions">
                        <button className="save-book-button" type="button">
                        Guardar en mi biblioteca
                        </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBooksPage;