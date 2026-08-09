function BookCard({ book, children }) {
    if (!book) {
        return null;
    }

    const title = book.title || book.book_title || "Titulo desconocido"

    const author = book.author_name?.[0] || book.book_author || "Author Desconocido"

    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null;

    const year = book.first_publish_year || null;

    return (
        <div className="book-card book-card-small">
            <div className="book-cover">
                {coverUrl ? (
                <img src={coverUrl} alt={book.title} />
                ) : (
                <div className="book-cover-placeholder">
                    <span>Sin imagen</span>
                </div>
                )}
            </div>

            <div className="book-info">
                <h3 className="book-title">{title}</h3>
                <p className="book-author">{author}</p>

                {year && (
                <span className="book-meta">{year}</span>
                )}

                {children && <div className="book-actions">{children}</div>}
            </div>
        </div>
    );
}

export default BookCard;