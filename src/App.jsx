import { useState } from "react"
import { BrowserRouter, Route, Routes, Link } from "react-router"

import NavBar from "./components/NavBar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import SearchBooksPage from "./pages/SearchBooksPage";
import LibraryPage from "./pages/LibraryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NoFoundPage from "./pages/NoFoundPage"



function App(){
    const [isAuthenticated, setIsAuthenticated] = useState(
        Boolean(localStorage.getItem("token"))
        );

    const handleSuccessfulLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };
    
    return(
        
        <BrowserRouter>
            <NavBar 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                />
            
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/login" element={<LoginPage handleSuccessfulLogin={handleSuccessfulLogin}/>}/>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchBooksPage />} />
                <Route
                    path="/library"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <LibraryPage />
                        </ProtectedRoute>
                    }
                    />
                <Route path="*" element={<NoFoundPage/>}/>
            </Routes>
            
        </BrowserRouter>
    
    )
}

export default App
