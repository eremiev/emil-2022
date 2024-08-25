// Client
// Should be a javascript file ‘client.js’ that we can call with different arguments via CLI.
// ● If you want to split out some functionality into separate files for organization, that is fine. However, all functionality should be
// exposed from the ‘client.js’ file
// Capabilities
// 1. Generate an asymmetric keypair and store it for later use
// ● No specific curve or type required, so long as it can meet the other requirements
// 2. Submit the public key to the server via a password-authenticated http request
// 3. Use the private key to sign an arbitrary message provided via CLI arguments, and then output the message and signature
// back to the terminal
// 4. Submit a message + signature combo to the server to verify its authenticity via an http request

const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generate an asymmetric keypair and store it
 * @param {string} password (optional)
 * @returns {void} store locally the keys
 */
function generateKeys(password = null) {
    const keyOptions = {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            ...(password && {
                cipher: 'aes-256-cbc',
                passphrase: password,
            }),
        },
    };

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', keyOptions);

    const publicKeyPath = path.join(__dirname, 'public_key.pem');
    const privateKeyPath = path.join(__dirname, 'private_key.pem');
    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log('Keys generated successfully!');
}

async function getKeys() {
    try {
        const publicKeyPath = path.join(__dirname, 'public_key.pem');
        const privateKeyPath = path.join(__dirname, 'private_key.pem');

        await fs.promises.access(publicKeyPath, fs.constants.F_OK);
        const publicKey = await fs.promises.readFile(publicKeyPath, 'utf8');

        await fs.promises.access(privateKeyPath, fs.constants.F_OK);
        const privateKey = await fs.promises.readFile(privateKeyPath, 'utf8');

        return {
            publicKey,
            privateKey
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('Keys does not exist.')
        } else {
            throw new Error(error.message)
        }
    }
}

/**
 * Generate an asymmetric keypair and store it
 * @param {string} message
 * @param {string} password
 * @returns {object} output the message and signature
 */
async function signMessage(message, password = null) {
    try {
        const { privateKey: encryptedPrivateKey  } = await getKeys();
        if (!message) {
            console.error('No message provided');
        }

        const privateKey = crypto.createPrivateKey({
            key: encryptedPrivateKey,
            format: 'pem',
            ...(password && { passphrase: password })
        });

        const sign = crypto.createSign('SHA256');
        sign.update(message);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');
        console.log({
            message,
            signature,
        });
    } catch (error) {
        console.error('Error signing the message:', error.message);
    }
}

/**
 * Submit the public key to the server
 * @param {string} password
 * @returns {void} store locally the keys
 */
async function sendPublicKey(password) {
    if (!password) {
        console.log('Password is required.');
        return;
    }
    try {
        const { publicKey } = await getKeys();
        const postData = {
            file: publicKey.toString('base64'),
        };

        const response = await axios.post('http://localhost:8081/api/store-public-key', postData, {
            headers: {
                'Content-Type': 'application/json',
                'x-password': password,
            },
        });

        if (response.status === 200) {
            console.log(response.data.message);
        } else {
            console.log(`File upload failed with status: ${response.status}`);
        }
    } catch (error) {
            console.error('Error:', error.message);
    }
}

// Parse command-line arguments
(async () => {
    const [command, arg,arg2] = process.argv.slice(2);

    switch (command) {
        case '--generate-keys':
        case '-gk':
            const password = arg || null;
            generateKeys(password);
            break;
        case '--send-public-key':
        case '-spk':
            await sendPublicKey(arg);
            break;
        case '--sign-message':
        case '-sm':
            await signMessage(arg, arg2);
            break;
        case '--help':
        case '-h':
            console.log('--generate-keys {password}');
            console.log('--gk {password}');
            break;
        default:
            console.log('Invalid command');
    }
})();

