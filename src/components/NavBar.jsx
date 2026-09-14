import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import navImg from "../assets/images/logo-nav.png";

function NavBar({ isAuthenticated, handleLogout, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate("/");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  return (
    <nav className="navigation-wrapper">
      <div className="navigation-brand">
        <Link to="/">
          <img src={navImg} alt="The Reading Cauldron" />
        </Link>
      </div>

      <div className="navigation-links">
        <Link to="/">Inicio</Link>

        <form className="navigation-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar libro ..."
          />

          <button type="submit">Buscar</button>
        </form>

        {isAuthenticated ? (
          <>
            <Link to="/library">Mi biblioteca</Link>

            <div className="navbar-user-info">
                <FontAwesomeIcon icon={faUser} />

                <span>
                    {currentUser?.user_name ||
                        currentUser?.user_email ||
                        "Usuario"}
                </span>
            </div>

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

export default NavBar;