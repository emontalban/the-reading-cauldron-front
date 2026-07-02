import { useState } from "react";
import api from "../api/axiosConfig";

function LoginPage() {
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

      setToken(response.data.token);
      setMessage("Login correcto");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error conectando con el servidor");
      }
    }
  };

  return (
    <main className="page-container">
      <section className="form-card">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="Introduce tu email"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="user_password"
              value={formData.user_password}
              onChange={handleChange}
              placeholder="Introduce tu contraseña"
            />
          </div>

          <button type="submit">Entrar</button>
        </form>

        {message && <p className="message">{message}</p>}

        {token && (
          <div className="token-box">
            <strong>Token guardado correctamente</strong>
          </div>
        )}
      </section>
    </main>
  );
}

export default LoginPage;