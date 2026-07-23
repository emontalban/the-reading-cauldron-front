import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axiosConfig";

function SearchBooksPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  useEffect(() => {
    api
      .get("/books")
      .then((response) => {
        const booksData = Array.isArray(response.data) ? response.data : [];

        setBooks(booksData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setBooks([]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!query) {
      setFilteredBooks(books);
      return;
    }

    const normalizedQuery = query.toLowerCase();

    const results = books.filter((book) => {
      return (
        book.book_title?.toLowerCase().includes(normalizedQuery) ||
        book.book_author?.toLowerCase().includes(normalizedQuery) ||
        book.book_category?.toLowerCase().includes(normalizedQuery)
      );
    });

    setFilteredBooks(results);
  }, [query, books]);

  return (
    <div className="search-books-page-wrapper">
      <div className="search-books-header">
        <h1>Libros</h1>

        {query ? (
          <p>
            Resultados para: <strong>{query}</strong>
          </p>
        ) : (
          <p>Estos son los libros guardados en la base de datos.</p>
        )}
      </div>

      {isLoading ? (
        <p>Cargando libros...</p>
      ) : (
        <div className="books-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              return (
                <article className="book-card" key={book.book_id}>
                  <div className="book-cover">
                    {book.book_cover_url ? (
                      <img src={book.book_cover_url} alt={book.book_title} />
                    ) : (
                      <span>Sin portada</span>
                    )}
                  </div>

                  <div className="book-info">
                    <h2>{book.book_title}</h2>

                    <p className="book-author">{book.book_author}</p>

                    {book.book_category && (
                      <p className="book-category">{book.book_category}</p>
                    )}

                    {book.book_description && (
                      <p className="book-description">
                        {book.book_description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <p>No se encontraron libros.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBooksPage;