// DEPENDENCY IMPORTS
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

// MODULE IMPORTS
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import { Container } from "semantic-ui-react";
// custom css should be after semantic css
import "./App.css";

function App() {
    return (
        <Router>
            <Container>
                <MenuBar />
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
            </Container>
        </Router>
    );
}

export default App;
