import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Button, Icon, Label } from "semantic-ui-react";
const LikeButton = ({ post: { id, likeCount, likes }, user }) => {
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        // if the current user has already liked the post
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes]);
    const [likePost] = useMutation(LIKE_POST, {
        variables: { postId: id },
    });
    const likeButton = user ? (
        liked ? (
            // if already liked
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        // if user is not logged in
        <Button as={Link} to='/login' color='teal' basic>
            <Icon name='heart' />
        </Button>
    );
    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    );
};

const LIKE_POST = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`;

export default LikeButton;