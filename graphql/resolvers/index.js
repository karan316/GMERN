const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
module.exports = {
    // Post modifier -> each type any Post query, mutation or subscription occurs it goes through this modifier
    Post: {
        likeCount(parent) {
            // parent will have the post/s for which the query, mutation or subscription was called
            return parent.likes.length;
        },
        commentCount(parent) {
            return parent.comments.length;
        },
    },
    Query: {
        ...postsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    Subscription: {
        ...postsResolvers.Subscription,
    },
};
