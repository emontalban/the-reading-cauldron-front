import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes, Link } from "react-router"

import api from "./api/axiosConfig"
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

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getCurrentUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setCurrentUser(null);
                return;
            }

            try {
                const response = await api.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCurrentUser(response.data.user || response.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
        };

        if (isAuthenticated) {
            getCurrentUser();
        } else {
            setCurrentUser(null);
        }
    }, [isAuthenticated]);

    const handleSuccessfulLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setCurrentUser(null);
        
    };
    
    return(
        
        <BrowserRouter>
            <NavBar 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                currentUser={currentUser}
                />
            
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/login" element={<LoginPage handleSuccessfulLogin={handleSuccessfulLogin}/>}/>
                <Route path="/register" element={<RegisterPage />} />
                
                <Route 
                    path="/search" 
                    element={<SearchBooksPage isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>} />
                <Route
                    path="/library"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <LibraryPage handleLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                    />
                
                <Route path="*" element={<NoFoundPage/>}/>
            </Routes>
            
        </BrowserRouter>
    
    )
}

export default App
