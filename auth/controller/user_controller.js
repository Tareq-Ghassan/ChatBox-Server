require('dotenv').config();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BlackList = require("../../helper/blacklist")


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email.toString().toLowerCase() });
        if (!user) {
            return res.status(404).json({
                header: {
                    errorCode: '404',
                    message: "Invalid credentials"
                }
            });
        }
        if (verifyPassword(req.body.password.toString(), user.salt.toString(), user.password.toString())) {
            const token = generateToken(user);
            return res.status(200).json({
                header: {
                    errorCode: '00000',
                    message: 'Success',
                    jwt: token
                },
                body: {
                    name: user.name.toString(),
                    email: user.email.toString(),
                    phoneNumber: user.phoneNumber,
                }
            })
        } else {
            return res.status(401).json({
                header: {
                    errorCode: '401',
                    message: "Invalid credentials"
                }
            });
        }
    } catch (error) {
        console.error('Error in finding user', error);
        next(error)
    }
}


exports.logout = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                header: {
                    errorCode: '400',
                    message: "No token provided"
                }
            });
        }

        //! Check if the token is already blacklisted
        const blacklistedToken = await BlackList.findOne({ token });
        if (blacklistedToken) {
            //! Token already blacklisted, send a response
            return res.status(200).json({
                header: {
                    errorCode: '00000',
                    message: "Logged out successfully"
                }
            });
        }

        //! Token not blacklisted, add it
        await BlackList.create({ token });
        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: "Logged out successfully"
            }
        });
    } catch (error) {
        console.error('Error in logging out user', error);
        //! Pass unexpected errors to Express' error handler
        return next(error);
    }
}


exports.register = async (req, res, next) => {
    try {
        const { salt, hash } = hashPassword(req.body.password.toString());

        //! Save user to the database
        const user = await new User({
            name: req.body.name.toString(),
            email: req.body.email.toString(),
            password: hash.toString(),
            phoneNumber: {
                code: req.body.countryCode.toString(),
                number: req.body.phoneNumber.toString()
            },
            salt: salt.toString()
        }).save();

        //! Generate token
        const token = generateToken(user);

        //! Send response
        return res.status(201).json({
            header: {
                errorCode: '00000',
                message: 'Success',
                jwt: token
            },
            body: {
                name: user.name.toString(),
                email: user.email.toString(),
                phoneNumber: user.phoneNumber
            }
        });

    } catch (error) {
        console.error('Error in creating user', error);
        next(error);
    }
}


// Function to hash a password with salt
function hashPassword(password) {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the password with the salt
    const hash = crypto
        .createHmac('sha256', salt) // Use SHA-256 algorithm with the salt
        .update(password) // Update the hash with the password
        .digest('hex'); // Output the result as a hexadecimal string

    return { salt, hash };
}

// Generate a JWT for a user
function generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
}

// Function to verify a password
function verifyPassword(password, salt, hash) {
    // Hash the provided password with the same salt
    const hashToVerify = crypto
        .createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    // Compare the hashes
    return hash === hashToVerify;
}
