import { useState } from "react";
import api from "../api/axiosConfig";

function RegisterForm(){
    const[formData, setFormData] = useState({
        user_name: "",
        user_email: "",
        user_password: "",
    });

    const[message, setMessage] = useState("");

    const handleChange = (event) => {
        const{ name, value } = event.target;

        setFormData({
            ...formData,
            [name] : value,
        });
    };

    const handleSubmit = async(event)=> {
        event.preventDefault();

        try{
            const response = await api.post("/users", formData);

            setFormData({
                user_name: "",
                user_email: "",
                user_password : ","
            });
        }catch(error){
    
            if(error.response){
                setMessage(error.response.data.message)
            }else{
                setMessage("Error conectando con el  servidor")
            }
        }
    };

    return(
        <div className="page-container">
            <div className="form-card">
                <h1>Crear Cuenta</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            placeholder="Introduce tu nombre de usuario"
                        />

                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleChange}
                            placeholder="Introduce tu email"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="user_password"
                            value={formData.user_password}
                            onChange={handleChange}
                            placeholder="Introduce la contraseña"
                        />
                    </div>

                    <button type="submit">Registrar</button>
                </form>

                {message && <p className="message">{message}</p>}

            </div>

        </div>
    );
}

export default RegisterForm