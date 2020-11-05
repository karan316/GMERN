import React from "react";
import { Form, Button } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../hooks/customHooks";
import { FETCH_POSTS_QUERY } from "../graphql/fetchPosts";
function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: "",
    });
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        // to immediately display the post
        update(proxy, result) {
            // read the query from the cache instead of database
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
            });
            // to persist the query
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts],
                },
            });

            values.body = "";
        },
        onError(err) {
            // this is the errors object we sent in the graphql server
            console.log("No input provided.");
        },
    });

    function createPostCallback() {
        createPost();
    }
    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a Post: </h2>
                <Form.Field>
                    <Form.Input
                        placeholder="What's up?"
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type='submit' color='teal'>
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className='ui error message' style={{ marginBottom: 20 }}>
                    <ul className='list'>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`;

export default PostForm;
