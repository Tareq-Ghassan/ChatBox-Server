const express = require('express')
const router = express.Router()

const initController = require('../controller/init_controller')

router.post('/serverInit', initController.init)
router.get('/getConfiguration', initController.getConfiguration)


module.exports = router