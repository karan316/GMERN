// DEPENDENCY IMPORTS
const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
    Query: {
        async getPosts() {
            try {
                // sort by latest posts
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) return post;
                else throw new Error("Post not found");
            } catch (error) {
                throw new Error(error);
            }
        },
    },
    // context to access headers
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);

            if (body.trim() === "") {
                throw new Error("Post body cannot be empty.");
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });

            const post = await newPost.save();

            // create a publish
            context.pubsub.publish("NEW_POST", {
                newPost: post,
            });

            return post;
        },

        async deletePost(_, { postId }, context) {
            try {
                const user = checkAuth(context);
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.deleteOne();
                    return "Post deleted successfully";
                } else {
                    throw new AuthenticationError(
                        "This user cannot delete the post"
                    );
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find((like) => like.username === username)) {
                    // POST ALREADY LIKED -> UNLIKE IT ->
                    // ONLY KEEP THE LIKES OF OTHER USERS
                    post.likes = post.likes.filter(
                        (like) => like.username !== username
                    );
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString(),
                    });
                }
                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found.");
            }
        },
    },

    Subscription: {
        // subscribe to new posts
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
        },
    },
};
