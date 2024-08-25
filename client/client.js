// Client
// Should be a javascript file ‘client.js’ that we can call with different arguments via CLI.
// ● If you want to split out some functionality into separate files for organization, that is fine. However, all functionality should be
// exposed from the ‘client.js’ file
// Capabilities
// 1. Generate an asymmetric keypair and store it for later use
// ● No specific curve or type required, so long as it can meet the other requirements
// 2. Submit the public key to the server via a password-authenticated http request
// 3. Use the private key to sign a an arbitrary message provided via CLI arguments, and then output the message and signature
// back to the terminal
// 4. Submit a message + signature combo to the server to verify its authenticity via an http request


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

// Parse command-line arguments
const [ command, arg ] = process.argv.slice(2);

switch(command) {
    case '--generate-keys':
    case '-gk':
        const password = arg || null;
        generateKeys(password);
        break;
    case '--help':
    case '-h':
        console.log('--generate-keys {password}');
        console.log('--gk {password}');
        break;
    default:
        console.log('Invalid command');
}


