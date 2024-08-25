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
// 4. Submit a message + signature combo to the server to verify its authenticity via an http requestconst {post} = require('axios');

const {generateKeyPairSync, createPrivateKey, createSign} = require('crypto');
const {writeFileSync, promises, constants} = require('fs');
const {join} = require('path');

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
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      ...(password && {
        cipher: 'aes-256-cbc',
        passphrase: password
      })
    }
  };

  const {publicKey, privateKey} = generateKeyPairSync('rsa', keyOptions);

  const publicKeyPath = join(__dirname, 'public_key.pem');
  const privateKeyPath = join(__dirname, 'private_key.pem');
  writeFileSync(publicKeyPath, publicKey);
  writeFileSync(privateKeyPath, privateKey);
  console.log('Keys generated successfully!');
}

/**
 * Get stored keys
 * @returns {object} public and private key
 */
async function getKeys() {
  try {
    const publicKeyPath = join(__dirname, 'public_key.pem');
    const privateKeyPath = join(__dirname, 'private_key.pem');

    await promises.access(publicKeyPath, constants.F_OK);
    const publicKey = await promises.readFile(publicKeyPath, 'utf8');

    await promises.access(privateKeyPath, constants.F_OK);
    const privateKey = await promises.readFile(privateKeyPath, 'utf8');

    return {
      publicKey,
      privateKey
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Keys does not exist.');
    } else {
      throw new Error(error.message);
    }
  }
}

/**
 * Sign a message
 * @param {string} message
 * @param {string} password
 * @returns {object} output the message and signature
 */
async function signMessage(message, password = null) {
  try {
    const {privateKey: encryptedPrivateKey} = await getKeys();
    if (!message) {
      console.error('No message provided');
    }

    const privateKey = createPrivateKey({
      key: encryptedPrivateKey,
      format: 'pem',
      ...(password && {passphrase: password})
    });

    const sign = createSign('SHA256');
    sign.update(message);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');
    console.log({
      message,
      signature
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
    console.log('Server auth password is required.');
    return;
  }
  try {
    const {publicKey} = await getKeys();
    const response = await post('http://localhost:8081/api/store-public-key',
      {
        publicKey
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-password': password
        }
      });

    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.log(`File upload failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error.response.data.error || error.message);
  }
}

/**
 * Verify the message with the server
 * @param {string} message
 * @param {string} signature
 * @returns {string} verified result from the server
 */
async function verifyMessage(message, signature) {
  if (!message || !signature) {
    console.log('Message and Signature are required.');
    return;
  }
  try {
    const response = await post('http://localhost:8081/api/verify-message',
      {
        message,
        signature
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.log(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Parse command-line arguments
(async () => {
  const [command, arg, arg2] = process.argv.slice(2);

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
    case '--verify-message':
    case '-vm':
      verifyMessage(arg, arg2);
      break;
    case '--get-keys':
      const keys = await getKeys();
      console.log(keys);
      break;
    case '--help':
    case '-h':
      console.log(
        'Generate Keys: \n' +
        '--generate-keys\n' +
        '-gk\n' +
        '\n' +
        'Send Public Key (Server password required):\n' +
        '--send-public-key {password}\n' +
        '-spk {password}\n' +
        '\n' +
        'Sign Message (privateKeyPassword optional):\n' +
        '--sign-message {message} {privateKeyPassword}\n' +
        '-sm {message} {privateKeyPassword}\n' +
        '\n' +
        'Verify Message (message and signature required)\n' +
        '--verify-message {message} {signature}\n' +
        '-vm  {message} {signature}\n' +
        '\n' +
        'List Keys\n' +
        '--get-keys\n' +
        '\n' +
        'Help\n' +
        '--help\n' +
        '-h\n');
      break;
    default:
      console.log('Invalid command');
  }
})();

