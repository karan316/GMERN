// DEPENDENCY IMPORTS
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

// MODULE IMPORTS
import { AuthProvider } from "./context/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import AuthRoute from "./util/AuthRoute";
// custom css should be after semantic css
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Container>
                    <MenuBar />
                    <Route exact path='/' component={Home} />
                    <AuthRoute exact path='/login' component={Login} />
                    <AuthRoute exact path='/register' component={Register} />
                </Container>
            </Router>
        </AuthProvider>
    );
}

export default App;
