require('dotenv').config();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BlackList = require("../../helper/blacklist")


exports.login = (req, res, next) => {
    if (req.body.email == null || req.body.email.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, email can't be empty or null"
            }
        });
    } else if (req.body.password == null || req.body.password.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, Password can't be empty or null"
            }
        });
    }
    User.findOne({ email: req.body.email.toString().toLowerCase() })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    header: {
                        errorCode: '404',
                        message: "User not found"
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
                        email: user.email.toString()
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

        })
        .catch(error => {
            console.error('Error in finding user', error);
            next(error)
        })
}


exports.logout = (req, res, next) => {
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

        // Check if the token is already blacklisted
        BlackList.findOne({ token: token.toString() })
            .then(blacklistedToken => {
                if (blacklistedToken) {
                    // Token already blacklisted, send a response
                    return res.status(200).json({
                        header: {
                            errorCode: '00000',
                            message: "Logged out successfully"
                        }
                    });
                }

                // Token not blacklisted, add it to the blacklist
                const newToken = new BlackList({ token: token });
                return newToken.save()
                    .then(() => {
                        res.status(200).json({
                            header: {
                                errorCode: '00000',
                                message: "Logged out successfully"
                            }
                        });
                    });
            })
            .catch(error => {
                console.error('Error in finding/creating token', error);
                return next(error); // Pass the error to Express' error handler
            });
    } catch (error) {
        console.error('Error in logging out user', error);
        return next(error); // Pass unexpected errors to Express' error handler
    }
}


exports.register = async (req, res, next) => {
    if (req.body.name == null || req.body.name.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, name can't be empty or null"
            }
        });

    } else if (req.body.email == null || req.body.email.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, email can't be empty or null"
            }
        });
    } else if (req.body.password == null || req.body.password.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, Password can't be empty or null"
            }
        });
    }
    else if (req.body.confirmPassword == null || req.body.confirmPassword.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, Confirm Password can't be empty or null"
            }
        });
    }
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(req.body.email.toString())) {
        return res.status(400).json({
            header: {
                errorCode: '00001',
                message: "Invalid Email Format"
            }
        });
    } else if (await User.findOne({ email: req.body.email.toString().toLowerCase() })) {
        return res.status(409).json({
            header: {
                errorCode: '409',
                message: "Email already exists"
            }
        });
    }
    else if (req.body.name.toString().split(' ').length < 2 ||
        req.body.name.toString().split(' ')[0].trim() === '' ||
        req.body.name.toString().split(' ')[1].trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '00002',
                message: "Name must be 2 syllables or more"
            }
        });
    } else if (req.body.password.length < 6) {
        return res.status(400).json({
            header: {
                errorCode: '00003',
                message: "Password must be at least 6 characters long"
            }
        });
    }
    else if (!/[!@#$%^&*(),.?":{}|<>~_\-+=/]/.test(req.body.password)) {
        return res.status(400).json({
            header: {
                errorCode: '00004',
                message: "Password must include at least one special character"
            }
        });
    } else if (!/\d/.test(req.body.password)) {
        return res.status(400).json({
            header: {
                errorCode: '00005',
                message: "Password must include at least one digit"
            }
        });
    } else if (!/[a-z]/.test(req.body.password)) {
        return res.status(400).json({
            header: {
                errorCode: '00006',
                message: "Password must include at least one lowercase character"
            }
        });
    } else if (!/[A-Z]/.test(req.body.password)) {
        return res.status(400).json({
            header: {
                errorCode: '00007',
                message: "Password must include at least one uppercase character"
            }
        });
    } else if (req.body.password.toString() !== req.body.confirmPassword.toString()) {
        return res.status(400).json({
            header: {
                errorCode: '00008',
                message: "Passwords do not match"
            }
        });
    }

    const { salt, hash } = hashPassword(req.body.password.toString());
    new User({
        name: req.body.name.toString(),
        email: req.body.email.toString(),
        password: hash.toString(),
        salt: salt.toString()
    })
        .save()
        .then(user => {
            // Generate a token for the user
            const token = generateToken(user);

            return res.status(201).json({
                header: {
                    errorCode: '00000',
                    message: 'Success',
                    jwt: token
                },
                body: {
                    name: user.name.toString(),
                    email: user.email.toString()
                }
            })
        })
        .catch(error => {
            console.error('Error in creating user', error);
            next(error)
        })

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
