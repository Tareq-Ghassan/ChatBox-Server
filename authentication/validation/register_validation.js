const User = require('../../user/models/user');

exports.validateRegister = async (req, res, next) => {
    //? missing || null request parameter checks
    if (_checkIfNotEmptyOrNull(req, res)) return;

    //? check email if valid and not already exists
    if (await _checkIfEmailIsValidAndNotExist(req, res)) return;

    //? check name if 2 syllables
    if (_checkIfNameIs2Syllables(req, res)) return;

    //? check password if valid
    if (_checkIfPasswordIsValid(req, res)) return;

    //? check phone number if valid
    if (await _checkIfPhoneNumberIsValid(req, res)) return;

    //* go to the next middleware
    next();
}

function _checkIfNotEmptyOrNull(req, res) {
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
    else if (req.body.countryCode == null || req.body.countryCode.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, country Code can't be empty or null"
            }
        });
    } else if (req.body.phoneNumber == null || req.body.phoneNumber.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, phone Number can't be empty or null"
            }
        });
    }
}

async function _checkIfEmailIsValidAndNotExist(req, res) {
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(req.body.email.toString())) {
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
}

function _checkIfNameIs2Syllables(req, res) {
    if (req.body.name.toString().split(' ').length < 2 ||
        req.body.name.toString().split(' ')[0].trim() === '' ||
        req.body.name.toString().split(' ')[1].trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '00002',
                message: "Name must be 2 syllables or more"
            }
        });
    }
}


function _checkIfPasswordIsValid(req, res) {
    if (req.body.password.length < 6) {
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
}


async function _checkIfPhoneNumberIsValid(req, res) {
    //! Ensures the country code starts with `+` followed by 1-4 digits
    if (!/^\+\d{1,4}$/.test(req.body.countryCode.trim())) {
        return res.status(400).json({
            header: { errorCode: '00009', message: "Invalid country code format. Example: +1, +91, +44" }
        });
    }
    //! Ensures the phone number contains only digits and has a valid length
    else if (!/^\d{4,15}$/.test(req.body.phoneNumber)) {
        return res.status(400).json({
            header: { errorCode: '00010', message: "Invalid phone number format. Must be 4-15 digits." }
        });
    }
    //! Remove the leading '0'
    if (req.body.phoneNumber.startsWith('0')) {
        req.body.phoneNumber = req.body.phoneNumber.slice(1);
    }
    //! Ensures the phone number doesn't exist 
    if (await User.findOne({ "phoneNumber.code": req.body.countryCode, "phoneNumber.number": req.body.phoneNumber })) {
        return res.status(409).json({
            header: { errorCode: '409', message: "Phone number already exists" }
        });
    }


}