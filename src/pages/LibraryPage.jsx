import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import api from "../api/axiosConfig";
import LibraryBookCard from "../components/LibraryBookCard";
import LibraryBookEditModal from "../components/LibraryBookEditModal";
import LibraryFilters from "../components/LibraryFilters";

function LibraryPage({handleLogout}) {
    const [libraryBooks, setLibraryBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [editingLibraryId, setEditingLibraryId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [modalMessage, setModalMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [formatFilter, setFormatFilter] = useState("todos");
    const [ownershipFilter, setOwnershipFilter] = useState("todos");
    const [favoriteFilter, setFavoriteFilter] = useState("todos");
    const [searchFilter, setSearchFilter] = useState("");
    const navigate = useNavigate();

    const isFavoriteValue = (value) => {
        return value === true || value === 1 || value === "1";
    };

    const formatDateForInput = (dateValue) => {
        if (!dateValue) {
            return "";
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateValue))) {
            return dateValue;
        }

        const parsedDate = new Date(dateValue);

            if (Number.isNaN(parsedDate.getTime())) {
                return "";
            }

            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
            const day = String(parsedDate.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
        };

    useEffect(() => {
        const getLibraryBooks = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setIsLoading(true);
            setMessage("");

            const response = await api.get("/library", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Respuesta de /library:", response.data);

            const booksData = Array.isArray(response.data)
                ? response.data
                : response.data.library || [];

            setLibraryBooks(booksData);

            if (booksData.length === 0) {
            setMessage("Todavía no tienes libros guardados.");
            }
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
                handleLogout();
                navigate("/login");
            
            } else {
                setMessage("No se pudo cargar tu biblioteca.");
            }
        } finally {
            setIsLoading(false);
        }
        };

        getLibraryBooks();
    }, [navigate]);



    const handleDeleteBook = async(libraryId) =>{
        const token = localStorage.getItem("token");

        if(!token){
            navigate("/login");
            return;
        }
        try {
            await api.delete(`/library/${libraryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLibraryBooks((currentBooks) => {
            return currentBooks.filter((book) => {
                return book.library_id !== libraryId;
            });
        });

            setMessage("Libro eliminado de tu biblioteca.");
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
                handleLogout();
                navigate("/login");
            } else {
                setMessage("No se pudo eliminar el libro.");
            }
        }
    };

    const handleStartEdit = (book) => {

        console.log("Editando libro:", book.library_id);

        setEditingLibraryId(book.library_id);
        setModalMessage("");

        setEditFormData({
        library_status: book.library_status || "pendiente",
        library_format: book.library_format || "papel",
        library_rating: book.library_rating ?? "",
        library_current_page: book.library_current_page ?? 0,
        library_notes: book.library_notes || "",
        library_favorite: Boolean(book.library_favorite),
        library_ownership: book.library_ownership || "propio",
        library_start_date: formatDateForInput(book.library_start_date),
        library_finish_date: formatDateForInput(book.library_finish_date),
        });
    };

    const handleCancelEdit = () => {
        setEditingLibraryId(null);
        setEditFormData({});
        setModalMessage("");
    };

    const handleEditFieldChange = (fieldName, value) => {
        setEditFormData((currentData) => {
            return {
                ...currentData,
                [fieldName]: value,
            };
        });
  };

  const handleUpdateLibraryBook = async (libraryId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    setModalMessage("");

    const updatePayload = {
        library_status: editFormData.library_status || "pendiente",
        library_format: editFormData.library_format || "papel",
        library_rating:
            editFormData.library_rating === "" || editFormData.library_rating == null
            ? null
            : Number(editFormData.library_rating),
        library_current_page:
            editFormData.library_current_page === "" ||
            editFormData.library_current_page == null
            ? 0
            : Number(editFormData.library_current_page),
        library_notes: editFormData.library_notes || null,
        library_favorite: Boolean(editFormData.library_favorite),
        library_ownership: editFormData.library_ownership || "propio",
        library_start_date: editFormData.library_start_date || null,
        library_finish_date: editFormData.library_finish_date || null,
    };

    try {
        await api.put(`/library/${libraryId}`, updatePayload, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
    });

      setLibraryBooks((currentBooks) => {
        return currentBooks.map((book) => {
          if (book.library_id === libraryId) {
            return {
              ...book,
              ...updatePayload,
            };
          }

          return book;
        });
      });

      setModalMessage("Cambios guardados correctamente.");

      setTimeout(() => {
        setEditingLibraryId(null);
        setEditFormData({});
        setModalMessage("");
        }, 1200);
      
    } catch (error) {
        console.log(error);
        console.log("Respuesta backend:", error.response?.data);

        if (error.response?.status === 401) {
            setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
            handleLogout();
            navigate("/login");
        } else {
            setModalMessage(
            error.response?.data?.message ||
                "No se pudieron guardar los cambios."
            );
        }
    }
  };
    const handleToggleFavorite = async (book) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const newFavoriteValue = !book.library_favorite;

        const updatePayload = {
            library_status: book.library_status || "pendiente",
            library_format: book.library_format || "papel",
            library_rating:
            book.library_rating === "" || book.library_rating == null
                ? null
                : Number(book.library_rating),
            library_current_page:
            book.library_current_page === "" || book.library_current_page == null
                ? 0
                : Number(book.library_current_page),
            library_notes: book.library_notes || null,
            library_favorite: newFavoriteValue,
            library_ownership: book.library_ownership || "propio",
            library_start_date: formatDateForInput(book.library_start_date) || null,
            library_finish_date: formatDateForInput(book.library_finish_date) || null,
        };

        try {
            await api.put(`/library/${book.library_id}`, updatePayload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            setLibraryBooks((currentBooks) => {
                return currentBooks.map((currentBook) => {
                    if (currentBook.library_id === book.library_id) {
                    return {
                        ...currentBook,
                        library_favorite: newFavoriteValue,
                    };
                    }

                    return currentBook;
                });
            });
        } catch (error) {
            console.log(error);
            console.log("Respuesta backend:", error.response?.data);

            if (error.response?.status === 401) {
            handleLogout();
            navigate("/login");
            } else {
            setMessage(
                error.response?.data?.message ||
                "No se pudo actualizar el favorito."
            );
            }
        }
    };

    const filteredBooks = libraryBooks.filter((book) => {
        const normalizedSearch = searchFilter.toLowerCase().trim();
        
        const matchesSearch =
            normalizedSearch === "" ||
            book.book_title?.toLowerCase().includes(normalizedSearch) ||
            book.book_author?.toLowerCase().includes(normalizedSearch) ||
            book.book_category?.toLowerCase().includes(normalizedSearch) ||
            book.library_notes?.toLowerCase().includes(normalizedSearch);
        
        const matchesStatus =
        statusFilter === "todos" || book.library_status === statusFilter;

        const matchesFormat =
            formatFilter === "todos" || book.library_format === formatFilter;

        const matchesOwnership =
            ownershipFilter === "todos" ||
            book.library_ownership === ownershipFilter;

        const isFavorite = isFavoriteValue(book.library_favorite);

        const matchesFavorite =
            favoriteFilter === "todos" ||
            (favoriteFilter === "favoritos" && isFavorite) ||
            (favoriteFilter === "no_favoritos" && !isFavorite);

        return (
            matchesSearch &&
            matchesStatus &&
            matchesFormat &&
            matchesOwnership &&
            matchesFavorite
        );
    });
    const handleClearFilters = () => {
        setSearchFilter("");
        setStatusFilter("todos");
        setFormatFilter("todos");
        setOwnershipFilter("todos");
        setFavoriteFilter("todos");
    };
    
    return (
        <div className="library-page-wrapper">
        <div className="library-header">
            <h1>Mi biblioteca</h1>
        </div>

        {message && <p className="library-message">{message}</p>}
        <LibraryFilters
            searchFilter={searchFilter}
            statusFilter={statusFilter}
            formatFilter={formatFilter}
            ownershipFilter={ownershipFilter}
            favoriteFilter={favoriteFilter}
            onSearchChange={setSearchFilter}
            onStatusChange={setStatusFilter}
            onFormatChange={setFormatFilter}
            onOwnershipChange={setOwnershipFilter}
            onFavoriteChange={setFavoriteFilter}
            onClearFilters={handleClearFilters}
        />
        {isLoading ? (
            <p>Cargando biblioteca...</p>
        ) : (
            <div className="library-books-grid">
            {libraryBooks.length === 0 ? (
                <p>Todavía no tienes libros guardados.</p>
            ): filteredBooks.length > 0 ?(
                filteredBooks.map((book) => {
                    const isEditing = editingLibraryId === book.library_id;
                    return (
                        <LibraryBookCard
                            key={book.library_id}
                            book={book}
                            isEditing={isEditing}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteBook}
                            onToggleFavorite={handleToggleFavorite}
                            formatDateForInput={formatDateForInput}
                        />
                        
                    );
                })
                        
            ) : (
                <p>No hay libros que coincidan con los filtros.</p>
            )}
            </div>
        )}
        <LibraryBookEditModal
            isOpen={editingLibraryId !== null}
            bookTitle={
                libraryBooks.find((book) => book.library_id === editingLibraryId)
                ?.book_title
            }
            editFormData={editFormData}
            onFieldChange={handleEditFieldChange}
            modalMessage={modalMessage}
            onSave={() => handleUpdateLibraryBook(editingLibraryId)}
            onCancel={handleCancelEdit}
            />
        </div>
    );
}

export default LibraryPage;