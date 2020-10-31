const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { AuthenticationError } = require("apollo-server");
module.exports = (context) => {
    // context = {...headers}
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // returns two strings Bearer and token
        const token = authHeader.split("Bearer ")[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (error) {
                // not a valid token
                throw new AuthenticationError("Invalid token");
            }
        }
        // wrong format
        throw new Error("Auth token must be 'Bearer [token]' ");
    }
    // no auth header provided
    throw new Error("No auth header provided");
};
