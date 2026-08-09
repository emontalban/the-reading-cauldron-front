import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import BookCard from "../components/BookCard";

function SearchBooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();

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
              fields: "key,title,author_name,cover_i,first_publish_year",
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
                <button className="save-book-button" type="button">
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