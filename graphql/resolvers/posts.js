// DEPENDENCY IMPORTS
const { AuthenticationError } = require("apollo-server");

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
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });

            const post = await newPost.save();
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
    },
};
