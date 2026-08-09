import { useEffect, useState } from "react";
import axios from "axios";

import BookCard from "./BookCard";

function BookSection({ title, description, query, sort }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBooks = async () => {
      try { 
        setIsLoading(true);
        const params = {
            q: query,
            sort: sort,
            limit: 40,
            fields: "key,title,author_name,cover_i,first_publish_year",

        } 
        if(sort){
            params.sort = sort;
        }
        const response = await axios.get(
            "https://openlibrary.org/search.json", {params}

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
            {books.length > 0 
            ? (
                books.map((book) => {
                    return <BookCard key={book.key} book={book} />;
            }))
            :(
                <p>No se encontraron libros para esta sección.</p>
            )}
        </div>
      )}
    </div>
  );
}

export default BookSection;