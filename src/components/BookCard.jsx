function BookCard({ book }) {
  if (!book) {
    return null;
  }

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const author = book.author_name?.[0] || "Autor desconocido";

  return (
    <div className="home-book-card">
      <div className="home-book-cover">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} />
        ) : (
          <span>Sin portada</span>
        )}
      </div>

      <div className="home-book-info">
        <h3>{book.title}</h3>
        <p>{author}</p>

        {book.first_publish_year && (
          <span>{book.first_publish_year}</span>
        )}
      </div>
    </div>
  );
}

export default BookCard;