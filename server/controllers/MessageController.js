const crypto = require('crypto');
const keyStorage = require('../stores/keyAndPasswordStorage');

class MessageController {
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

  static verifyMessage(req, res) {
    const {message, signature} = req.body;

    if (!message || !signature) {
      return res.status(400).json({error: 'Message and Signature are required'});
    }

    try {
      const decodedPublicKey = keyStorage.getPublicKey();
      const verify = crypto.createVerify('SHA256');
      verify.update(message);
      verify.end();
      const isValid = verify.verify(decodedPublicKey, signature, 'hex');
      const validation = isValid ? 'Message is valid' : 'Message is not valid';
      return res.status(200).json({message: validation});
    } catch (error) {
      console.error('Error verifying the signature:', error.message);
      return false;
    }
  }
}

module.exports = MessageController;