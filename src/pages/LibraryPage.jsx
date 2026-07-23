import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function LibraryPage() {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/library", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        const booksData = Array.isArray(response.data)
          ? response.data
          : response.data.library || [];

        setLibraryBooks(booksData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setMessage("No se pudo cargar tu biblioteca");
        setLibraryBooks([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="library-page-wrapper">
      <section className="library-header">
        <h1>Mi biblioteca</h1>

        <p>
          Aquí aparecen los libros que has guardado en tu biblioteca personal.
        </p>
      </section>

      {message && <p className="library-message">{message}</p>}

      {isLoading ? (
        <p>Cargando biblioteca...</p>
      ) : (
        <section className="library-books-grid">
          {libraryBooks.length > 0 ? (
            libraryBooks.map((book) => {
              return (
                <article className="library-book-card" key={book.library_id}>
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
                </article>
              );
            })
          ) : (
            <p>Todavía no tienes libros guardados.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default LibraryPage;