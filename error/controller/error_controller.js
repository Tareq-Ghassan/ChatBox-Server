const ErrorLog = require('../model/errorLogs');

// Error handling middleware for 404 errors
exports.handle404 = (req, res, next) => {
    res.status(404).json({
        errorCode: '404',
        message: 'This route does not exist.',
    });
}

// Error handling middleware for 404 errors
exports.handle405 = (req, res, next) => {
    if (req.route && !req.route.methods[req.method.toLowerCase()]) {
        return res.status(405).json({
            errorCode: '405',
            message: `The ${req.method} method is not allowed for this route.`,
        });
    }
    next();
}

// Error handling middleware for 500 errors
exports.handle500 = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    new ErrorLog({
        errorStack: err.stack,
        timestamp: new Date()
    })
        .save()
        .then(() => {
            console.log('Error logged to database');
        })
        .catch(error => {
            console.error('Failed to log error to database:', error);
        });
    res.status(500).json({
        header: {
            errorCode: '-5',
            message: 'Server Error'
        }
    });
};