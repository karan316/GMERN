import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
// MODULE IMPORTS
import { AuthContext } from "../context/auth";
import { useForm } from "../hooks/customHooks";
const Login = (props) => {
    const { login } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const initialState = {
        username: "",
        password: "",
    };

    const { onChange, onSubmit, values } = useForm(
        loginUserCallback,
        initialState
    );
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        // update is called when the result is obtained successfully result.data.login has the logged in user's details
        update(_, { data: { login: userData } }) {
            // login sets the auth context
            login(userData);
            props.history.push("/");
        },
        // variables are the input to the mutation. here values have the same object name as variables so assign directly
        onError(err) {
            // this is the errors object we sent in the graphql server
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
            console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values,
    });

    function loginUserCallback() {
        loginUser();
    }
    return (
        <div className='form-container'>
            <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username'
                    name='username'
                    type='text'
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label='Password'
                    placeholder='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type='submit' primary basic>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className='ui error message'>
                    <ul className='list'>
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Login;
