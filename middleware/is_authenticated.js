require('dotenv').config();

const jwt = require('jsonwebtoken');

const BlackList = require("../helper/blacklist")

module.exports = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({
            header: {
                errorCode: '401',
                message: "Unauthorized"
            }
        });
    }

    BlackList.findOne({ token: token })
        .then(blacklistedToken => {
            if (blacklistedToken) {
                return res.status(401).json({
                    header: {
                        errorCode: '401',
                        message: "Token is invalid"
                    }
                });
            }

        })

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                header: {
                    errorCode: '403',
                    message: "Forbidden"
                }
            });
        }
        req.user = user;
        next();
    })
}