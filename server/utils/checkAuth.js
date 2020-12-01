const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { AuthenticationError } = require("apollo-server");
module.exports = (context) => {
    // context = {...headers}
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // HEADER => Authorization: "Bearer <token>"
        // returns two strings Bearer and token
        const token = authHeader.split("Bearer ")[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (error) {
                // not a valid token
                throw new AuthenticationError("Invalid Authentication token");
            }
        }
        // wrong format
        throw new Error("Authentication token must be 'Bearer [token]' ");
    }
    // no auth header provided
    throw new Error("Authorization header must be provided");
};
