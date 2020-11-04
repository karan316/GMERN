import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
    user: null,
};

if (localStorage.getItem("jwtToken")) {
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
    // if the token has expired (get the time in milliseconds and compare with current time) -> remove the token
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("jwtToken");
    } else {
        initialState.user = decodedToken;
    }
}

// used to access our context
const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {},
});

function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state, // spread the existing state
                user: action.payload, // payload has the user
            };

        case "LOGOUT":
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}

// used to provide the access of the context
function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem("jwtToken", userData.token);
        dispatch({ type: "LOGIN", payload: userData });
    }

    function logout() {
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    );
}

export { AuthContext, AuthProvider };
