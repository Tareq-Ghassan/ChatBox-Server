exports.validateLogin = async (req, res, next) => {
    //? missing || null request parameter checks
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

    //* go to the next middleware
    next();
}
