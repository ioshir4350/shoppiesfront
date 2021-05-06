const express = require('express')

const nominationControllers = require('../controllers/nomination')

const router = express.Router()

router.post('/nominate', nominationControllers.nominate)

router.post('/remove', nominationControllers.remove)

router.get('/getNominations', nominationControllers.getNominations)

module.exports = router