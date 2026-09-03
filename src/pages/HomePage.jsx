import { useState, useCallback } from "react";

import BookSection from "../components/BookSection";
import AppToast from "../components/AppToast";

function HomePage({isAuthenticated, handleLogout}) {
    const[message, setMessage] = useState("");
    const[messageType, setMessageType] = useState("info");

    const showMessage = useCallback((text, type = "info") => {
        setMessage(text);
        setMessageType(type);

        setTimeout(()=>{
            setMessage("");
            setMessageType("info");
        }, 3500);
    },[]);
    const bookSections = [
        {
        title: "Libros nuevos",
        description: "Algunas incorporaciones recientes para descubrir.",
        query: "fiction",
        sort: "new",
        },
        {
        title: "Romance juvenil y deportivo",
        description: "Historias del estilo de Los chicos de Tommen.",
        query: "sports romance young adult",
        
        },
        {
        title: "Fantasía",
        description: "Magia, mundos imposibles y aventuras.",
        query: "fantasy",
        
        },
        {
        title: "Ciencia ficción",
        description: "Futuros, tecnología y mundos alternativos.",
        query: "science fiction",
        
        },
        {
        title: "Misterio",
        description: "Crímenes, secretos y casos por resolver.",
        query: "mystery thriller",
        
        },
    ];

    return (
        <div className="home-page-wrapper">
            <AppToast
                message={message}
                type={messageType}
                onClose={()=> setMessage("")}
            />
    

        {bookSections.map((section) => {
            return (
            <BookSection
                key={section.title}
                title={section.title}
                description={section.description}
                query={section.query}
                sort={section.sort}
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                showMessage={showMessage}

            />
            );
        })}
        </div>
    );
}

export default HomePage;