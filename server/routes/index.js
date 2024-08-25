const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const MessageController = require('../controllers/MessageController');


// Route with middleware to store public key
router.post('/store-public-key', authenticate, MessageController.storePublicKey);

router.post('/validate-message', MessageController.validateMessage);

module.exports = router;