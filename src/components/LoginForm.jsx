import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

import api from "../api/axiosConfig";

function LoginForm({handleSuccessFulAuth, handleUnsuccessFulAuth}) {
    const [formData, setFormData] = useState({
          user_email: "",
          user_password: "",
    });

    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

          setFormData({
          ...formData,
          [name]: value,
          });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
        const response = await api.post("/login", formData);

        localStorage.setItem("token", response.data.token);

        setMessage("Login correcto");
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Error conectando con el servidor");
            }
            if(handleUnsuccessFulAuth){
                handleUnsuccessFulAuth();
            }

        }
    };

    return (
      <div className="login-form-container">
          <h1>Iniciar sesión</h1>
          <form onSubmit={handleSubmit} className="login-form-wrapper">
            <div className="form-group">
            <FaEnvelope />
                <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="Introduce tu email"
                />
            </div>

            <div className="form-group">
                <FaLock />
                <input
                    type="password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    placeholder="Introduce tu contraseña"
                />
            </div>

            <button className="btn" type="submit">Entrar</button>
          </form>

          <p className="message">{message}</p>

          {token && (
            <div className="token-box">
              <strong>Token guardado correctamente</strong>
            </div>
          )}
        
      </div>
    );
  }

  export default LoginForm;