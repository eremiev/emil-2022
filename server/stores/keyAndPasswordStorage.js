let publicKeyStorage = null;
let passwordStorage = null;
let saltStorage = null;

module.exports = {
    savePublicKey: (publicKey) => {
        publicKeyStorage = publicKey;
    },
    getPublicKey: () => publicKeyStorage,
    savePassword: (password) => {
        passwordStorage = password;
    },
    getPassword: () => passwordStorage,
    saveSalt: (salt) => {
        saltStorage = salt;
    },
    getSalt: () => saltStorage,
};