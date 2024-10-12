const User = require('../model/serverConnection');

exports.init = (req, res, next) => {
    const appKey = req.body.appKey
    const appSecret = req.body.appSecret
    if (!appKey || !appSecret) {
        return res.status(400).json({
            header: {
                errorCode: '-1',
                message: 'Invalid request, appKey and appSecret are required'
            }
        });
    } else {
        User.find({}).then(users => {
            console.log('All users:', users);
        });
        User.findOne({ appKey: appKey, appSecret: appSecret })
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        header: {
                            errorCode: '-2',
                            message: 'Invalid appKey or appSecret'
                        }
                    });
                }
                return res.status(200).json({
                    header: {
                        errorCode: '0',
                        message: 'Success'
                    },
                });
            })
            .catch(error => {
                console.error('Error in Finding user', error);
                next(error)
            })

    }

}