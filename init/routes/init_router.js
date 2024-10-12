const express = require('express')
const router = express.Router()

const initController= require('../controller/init_controller')

router.post('/serverInit',initController.init)

module.exports = router