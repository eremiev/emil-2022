const keyStorage = require('../stores/keyAndPasswordStorage');

class MessageController {
  static storePublicKey(req, res) {
    const { file } = req.body;
    try {
      if (!file) {
        return res.status(400).json({ error: 'Public key is required.' });
      }
    const decodedFileData = Buffer.from(file, 'base64').toString('utf-8');
    keyStorage.savePublicKey(decodedFileData);

    return res.status(200).json({ message: 'Public key stored successfully' });
    } catch (error) {
      console.error('Error storing public key:', error);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = MessageController;