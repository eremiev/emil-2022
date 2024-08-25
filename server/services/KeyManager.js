const {createVerify} = require('crypto');
const keyStorage = require('../stores/keyAndPasswordStorage');

class KeyManager {

  static verifyMessage(message, signature) {
    const decodedPublicKey = keyStorage.getPublicKey();
    const verify = createVerify('SHA256');
    verify.update(message);
    verify.end();
    return verify.verify(decodedPublicKey, signature, 'hex');
  }
}

module.exports = KeyManager;