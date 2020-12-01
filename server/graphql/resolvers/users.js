// DEPENDENCY IMPORTS
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
// MODULE IMPORTS
const {
    validateRegisterInput,
    validateLoginInput,
} = require("../../utils/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        SECRET_KEY,
        {
            expiresIn: "1h",
        }
    );
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = "Invalid credentials";
                throw new UserInputError("Invalid credentials", { errors });
            }
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },

        // parent(here _ as it is not used) - gives result of input from the previous step ?
        // args - registerInput
        // info - meta data
        async register(
            _,
            { registerInput: { username, email, password, confirmPassword } }
        ) {
            // validate user data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            // make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                // errors object will be used to display the message on client
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is already taken.",
                    },
                });
            }
            // hash the password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },
    },
};
