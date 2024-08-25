const crypto = require('crypto');
class PasswordManager {
    static algorithm = 'sha256';
    static saltLength = 16; // Salt length in bytes

    static generateSalt() {
        return crypto.randomBytes(this.saltLength).toString('hex');
    }

    static hashPassword(password, salt) {
        const hash = crypto.createHmac(this.algorithm, salt);
        hash.update(password);
        return hash.digest('hex');
    }

    static verifyPassword(storedHash, salt, passwordToVerify) {
        const hash = crypto.createHmac(this.algorithm, salt);
        hash.update(passwordToVerify);
        const computedHash = hash.digest('hex');
        return computedHash === storedHash;
    }
}

module.exports = PasswordManager;