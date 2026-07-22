import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import loginImg from "../assets/images/login-image.png"

function RegisterPage(){
    const navigate = useNavigate();

    const handleSuccessFulAuth = () => {
        navigate("/books");
    }

    const handleUnsuccessFulAuth = () => {
        console.log("Login Incorrecto");
    };
    

    return(
       <div className="login-page-wrapper">
      <div
        className="login-page-image-column"
        style={{
          backgroundImage: `url(${loginImg})`,
        }}
      />

      <div className="login-page-form-column">
        <LoginForm
          handleSuccessFulAuth={handleSuccessFulAuth}
          handleUnsuccessFulAuth={handleUnsuccessFulAuth}
        />
      </div>
    </div>
  );
}

export default RegisterPage; 
    