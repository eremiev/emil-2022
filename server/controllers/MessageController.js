const keyStorage = require('../stores/keyAndPasswordStorage');
const KeyManager = require('../services/KeyManager');

class MessageController {

  /**
   * Store public Key
   */
  static storePublicKey(req, res) {
    const {publicKey} = req.body;
    try {
      if (!publicKey) {
        return res.status(400).json({error: 'Public key is required.'});
      }
      keyStorage.savePublicKey(publicKey);

      return res.status(200).json({message: 'Public key stored successfully'});
    } catch (error) {
      console.error('Error storing public key:', error);

      return res.status(500).json({error: 'Internal Server Error'});
    }
  }

  /**
   * Verify message
   */
  static verifyMessage(req, res) {
    const {message, signature} = req.body;
    if (!message || !signature) {

      return res.status(400).json({error: 'Message and Signature are required'});
    }
    try {
      const isValid = KeyManager.verifyMessage(message, signature);
      const result = isValid ? 'Message is valid' : 'Message is not valid';

      return res.status(200).json({message: result});
    } catch (error) {
      console.error('Error verifying the signature:', error.message);

      return res.status(500).json({error: 'Internal Server Error'});
    }
  }
}

module.exports = MessageController;