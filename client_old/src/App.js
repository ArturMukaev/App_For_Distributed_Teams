import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'
import {NavBar} from "./components/NavBar";
import {Loader} from "./components/Loader";
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/useAuth";
import 'materialize-css'

function App() {
    const { loading, isAuthenticated } = useAuth();
    const routes = useRoutes(isAuthenticated)

    if(loading){
        return < Loader/>
    }
    return (
            <Router>
                {isAuthenticated && <NavBar/>}
                <div className="container" style={{width: "100%", maxWidth: "none"}}>
                    {routes}
                </div>
                <footer className="page-footer black">
                        <div className="container">
                            © 2022 Мукаев Артур
                        </div>
                </footer>
            </Router>
  );
}

export default App;
