// Server
// Capabilities
// 1. Accept requests via an http server (http is fine, no need for https)
//     2. Allow us to set a password of some kind that will be used for authentication by the client
// ● No real registration needed, just let us set it via an argument when starting the server
// ● Once submitted, the password should be stored securely just as if it was a real production password submitted via a user
// registration.
// 3. Allow the client to store their public key on the server via an HTTP request
// ● Require the client be authenticated with the password
// 4. Allow anyone to submit a signed message to the server for verification via an HTTP request
// ● Server should verify whether or not the message signature is valid and was actually signed by the client
// ● Server should respond with verification findings
// ● No authentication required for this endpoint
// ● Totally fine to write logic expecting only a single authenticated client and public key to exist