
exports.validateCreateStory = (req, res, next) => {
    // content validation
    if (!req.body.content) {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, Content can't be empty or null"
            }
        });
    }
    // type validation
    const validTypes = ['image', 'video'];
    if (!req.body.type || !validTypes.includes(req.body.type)) {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, Invalid type. Allowed types are: image and video."
            }
        });
    }

    if (req.body.expirationDate && isNaN(Date.parse(req.body.expirationDate))) {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, Invalid expirationDate."
            }
        });
    }
    next();
}