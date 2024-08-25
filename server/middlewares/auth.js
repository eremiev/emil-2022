const passwordAndSaltStorage = require('../stores/keyAndPasswordStorage');
const PasswordManager = require('../services/PasswordManager');

/**
 * Authenticate the user
 */
module.exports = (req, res, next) => {
    const providedPassword = req.body.password || req.headers['x-password'];
    if(!providedPassword) {

      return res.status(403).json({ error: 'Unauthorized: Incorrect password' });
    }
    const storedHashedPassword  = passwordAndSaltStorage.getPassword();
    const isPasswordCorrect = PasswordManager.verifyPassword(
        storedHashedPassword,
        passwordAndSaltStorage.getSalt(),
        providedPassword
    );

    if (isPasswordCorrect) {
      next();
    } else {

      return res.status(403).json({ error: 'Unauthorized: Incorrect password' });
    }
};