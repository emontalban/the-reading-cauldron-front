function BookCard({ book }) {
  if (!book) {
    return null;
  }

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const author = book.author_name?.[0] || "Autor desconocido";

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
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{author}</p>

        {book.first_publish_year && (
          <span className="book-meta">{book.first_publish_year}</span>
        )}
      </div>
    </div>
  );
}

export default BookCard;