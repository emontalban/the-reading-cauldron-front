import { useState } from "react"
import { BrowserRouter, Route, Routes, Link } from "react-router"

import Navbar from "./components/NavBar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"


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
            <Navbar 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                />
            
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/login" element={<LoginPage handleSuccessfulLogin={handleSuccessfulLogin}/>}/>
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
            
        </BrowserRouter>
    
    )
}

export default App
