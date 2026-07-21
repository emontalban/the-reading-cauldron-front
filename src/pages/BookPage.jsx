import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const getBooks = async () => {
    try {
      const response = await api.get("/books");

      setBooks(response.data);
      setMessage("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error conectando con el servidor");
      }
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="page-content">
      <h1>Libros</h1>

      {message && <p className="message">{message}</p>}

      {books.length === 0 ? (
        <p>No hay libros guardados todavía.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.book_id}>
              <h2>{book.book_title}</h2>

              <p>
                <strong>Autor:</strong> {book.book_author}
              </p>

              <p>
                <strong>ISBN:</strong> {book.book_isbn || "Sin ISBN"}
              </p>

              <p>
                <strong>Idioma:</strong> {book.book_language || "No indicado"}
              </p>

              <p>
                <strong>Categoría:</strong> {book.book_category || "No indicada"}
              </p>

              <p>
                <strong>Páginas:</strong> {book.book_pages || "No indicado"}
              </p>

              {book.book_description && (
                <p className="book-description">{book.book_description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksPage;