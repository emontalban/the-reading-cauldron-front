import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axiosConfig";

function SearchBooksPage() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") || "";

    useEffect(() => {
        api
        .get("/books")
        .then((response) => {
            console.log(response.data)
            setBooks(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
            console.log(error);
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
        <main className="search-books-page-wrapper">
        <section className="search-books-header">
            <h1>Libros</h1>

            {query ? (
            <p>
                Resultados para: <strong>{query}</strong>
            </p>
            ) : (
            <p>Estos son los libros guardados en la base de datos.</p>
            )}
        </section>

        <section className="books-grid">
            {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
                return (
                <article className="book-card" key={book.book_id}>
                    <h2>{book.book_title}</h2>
                    <p>{book.book_author}</p>

                    {book.book_category && (
                    <span>{book.book_category}</span>
                    )}
                </article>
                );
            })
            ) : (
            <p>No se encontraron libros.</p>
            )}
        </section>
        </main>
    );
}

export default SearchBooksPage;