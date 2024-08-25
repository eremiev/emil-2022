const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const MessageController = require('../controllers/MessageController');


// Route with middleware to store public key
router.post('/store-public-key', authenticate, MessageController.storePublicKey);

router.post('/verify-message', MessageController.verifyMessage);

module.exports = router;