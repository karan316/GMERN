// DEPENDENCY IMPORTS
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

// MODULE IMPORTS
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const { MONGODB } = require("./config");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // take req body in the context
    context: ({ req }) => ({ req }),
});

mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({ port: 4000 });
    })
    .then((res) => {
        console.log(`Server started at ${res.url}`);
    });
