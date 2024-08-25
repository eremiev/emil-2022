const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const MessageController = require('../controllers/MessageController');


// Auth routes
// Route with middleware to store public key
router.post('/store-public-key', authenticate, MessageController.storePublicKey);

// public routes
router.post('/verify-message', MessageController.verifyMessage);

module.exports = router;