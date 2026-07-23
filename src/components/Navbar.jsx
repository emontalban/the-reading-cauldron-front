import { Link, useNavigate } from "react-router-dom";
import navImg from "../assets/images/logo-nav.png"



function Navbar({ isAuthenticated, handleLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <nav className="navigation-wrapper">
      <div className="navigation-brand">
        <Link to="/">
        <img src={navImg} alt="The Reading Cauldron" /></Link>
      </div>

      <div className="navigation-links">
        <Link to="/">Inicio</Link>
        <Link to="/search">Buscar libros</Link>

        {isAuthenticated ? (
          <>
            <Link to="/library">Mi biblioteca</Link>

            <button className="logout-button" type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;