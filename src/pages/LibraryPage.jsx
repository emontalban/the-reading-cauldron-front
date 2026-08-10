import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import api from "../api/axiosConfig";
import LibraryBookCard from "../components/LibraryBookCard";
import LibraryBookEditModal from "../components/LibraryBookEditModal";

function LibraryPage({handleLogout}) {
    const [libraryBooks, setLibraryBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [editingLibraryId, setEditingLibraryId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const navigate = useNavigate();

    const formatDateForInput = (dateValue) => {
        if (!dateValue) {
            return "";
        }

        return String(dateValue).slice(0, 10);
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

      setMessage("Cambios guardados correctamente.");
      setEditingLibraryId(null);
      setEditFormData({});
    } catch (error) {
      console.log(error);
      console.log("Respuesta backend:", error.response?.data);

      if (error.response?.status === 401) {
        setMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        handleLogout();
        navigate("/login");
      } else {
        setMessage(
          error.response?.data?.message ||
            "No se pudieron guardar los cambios."
        );
      }
    }
  };
    
     return (
        <div className="library-page-wrapper">
        <div className="library-header">
            <h1>Mi biblioteca</h1>

            <p>
            Aquí aparecen los libros que has guardado en tu biblioteca personal.
            </p>
        </div>

        {message && <p className="library-message">{message}</p>}

        {isLoading ? (
            <p>Cargando biblioteca...</p>
        ) : (
            <div className="library-books-grid">
            {libraryBooks.length > 0 ? (
                libraryBooks.map((book) => {
                    const isEditing = editingLibraryId === book.library_id;
                    return (
                        <LibraryBookCard
                                key={book.library_id}
                                book={book}
                                isEditing={isEditing}
                                onEdit={handleStartEdit}
                                onDelete={handleDeleteBook}
                                formatDateForInput={formatDateForInput}
                        />
                        
                    );
                })
                        
            ) : (
                <p>Todavía no tienes libros guardados.</p>
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
            onSave={() => handleUpdateLibraryBook(editingLibraryId)}
            onCancel={handleCancelEdit}
            />
        </div>
    );
}

export default LibraryPage;