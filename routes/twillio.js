const express = require('express')

const twilioController = require('../controllers/twilio')

const router = express.Router()


router.post('/whatsapp-webhook',twilioController.whatsapp_Response)


module.exports = router