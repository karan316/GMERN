// DEPENDENCY IMPORTS
const { AuthenticationError, UserInputError } = require("apollo-server");
// MODULE IMPORTS
const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);
            if (body.trim() === "") {
                throw new UserInputError("Empty comment", {
                    errors: { body: "Comment body must not be empty" },
                });
            }
            const post = await Post.findById(postId);

            if (post) {
                // unshift -> adds comment to the top
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString(),
                });
                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found.");
            }
        },

        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(
                    (c) => c.id === commentId
                );
                // only the right user can delete the comment
                if (post.comments[commentIndex].username === username) {
                    // delete 1 comment from commentIndex
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    // no errors payload is passed because client won't have an option to delete other account's comment. this is just for safety
                    throw new AuthenticationError("Action not allowed");
                }
            } else {
                throw new UserInputError("Post not found.");
            }
        },
    },
};
