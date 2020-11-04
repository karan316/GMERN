import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import { useQuery } from "@apollo/client";
// MODULE IMPORTS
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { FETCH_POSTS_QUERY } from "../graphql/fetchPosts";
const Home = () => {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    if (loading) {
        return <h1>Loading posts..</h1>;
    }
    const { getPosts: posts } = data;

    return (
        <Grid columns={3}>
            <Grid.Row className='page-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {posts &&
                    posts.map((post) => (
                        <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))}
            </Grid.Row>
        </Grid>
    );
};

export default Home;
