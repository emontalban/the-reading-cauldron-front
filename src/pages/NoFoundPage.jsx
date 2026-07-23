import { Link } from "react-router-dom";

import notFoundImg from "../assets/images/404.png"

function NoFoundPage(){
    return(
        <div className="not-found-wrapper">
            <div className="not-found-content">
                <img src={notFoundImg} alt="Pagina no encontrada" className="not-found-img" />

                <Link className="not-found-link" to ="/">Volver al inicio</Link>

            </div>
          
        </div>
    )
}

export default NoFoundPage