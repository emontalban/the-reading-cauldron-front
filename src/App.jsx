import { BrowserRouter, Route, Routes, Link } from "react-router"
import LoginPage from "./pages/LoginPage"

function App(){
    return(
        
        <BrowserRouter>
        <div className="container">
            <nav className="navbar">
                <Link to= "/">The Reading Cauldron</Link>
                <Link to= "/login">Login</Link>
            </nav>
            <Routes>
                <Route path="/" element={<h1>Bienvenido a The Reading Cauldrom</h1>}></Route>
                <Route path="/login" element={<LoginPage/>}/>
            </Routes>
            </div>  
        </BrowserRouter>
    
    )
}

export default App
