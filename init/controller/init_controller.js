const User = require('../model/serverConnection');
const Configuration = require('../model/configuration');


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


exports.getConfiguration = async (req, res, next) => {
    try {
        const configuration = await Configuration.find()

        if (!configuration) {
            return res.status(200).json({
                header: {
                    errorCode: '00001',
                    message: 'No Data Was Found'
                }
            });
        } else {
            return res.status(200).json({
                header: {
                    errorCode: '00000',
                    message: 'Success'
                },
                body: {
                    countryCodes: configuration,
                },
            });
        }
    } catch (error) {
        console.error('Error in Finding data', error);
        next(error)
    }

}