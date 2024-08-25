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