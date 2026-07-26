import { useEffect, useState } from "react";
import axios from "axios";

import BookCard from "./BookCard";

function BookSection({ title, description, query, sort }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await axios.get(
          "https://openlibrary.org/search.json",
          {
            params: {
              q: query,
              sort: sort,
              limit: 8,
              fields: "key,title,author_name,cover_i,first_publish_year",
            },
          }
        );

        const booksData = Array.isArray(response.data.docs)
          ? response.data.docs
          : [];

        setBooks(booksData);
      } catch (error) {
        console.log(error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    getBooks();
  }, [query, sort]);

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
          {books.map((book) => {
            return <BookCard key={book.key} book={book} />;
          })}
        </div>
      )}
    </div>
  );
}

export default BookSection;