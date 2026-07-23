import { useNavigate } from "react-router-dom";

import RegisterForm from "../components/RegisterForm";
import registerImg from "../assets/images/register-imagen.png"

function RegisterPage(){
    return(
        <div className="login-page-wrapper">
            <div className="login-page-form-column">
                <RegisterForm/>
            </div>
            <div
            className="login-page-image-column"
            style={{
                backgroundImage: `url(${registerImg})`,
            }}
            />

        
    </div>
    )
}

export default RegisterPage; 
    