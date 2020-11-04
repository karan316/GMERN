import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";

// opposite of protected route -> if there is already a user logged in then she cannot access the login and register routes
function AuthRoute({ component: Component, ...rest }) {
    const { user } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? <Redirect to='/' /> : <Component {...props} />
            }
        />
    );
}
export default AuthRoute;
