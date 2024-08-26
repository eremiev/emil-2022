Bitpay - Task
=======================

## Client

### Available commands:

* Generate asymmetric keypair.
Optional: privateKeyPassword

```
client.js --generate-keys {privateKeyPassword}
client.js --gk {privateKeyPassword}
```

* Submit the public key to the server via a password-authenticated http request.
Required: serverPassword
```
client.js --send-public-key {serverPassword}
client.js --spk {serverPassword}
```

* Sign message.
Required: message
Optional: privateKeyPassword
```
client.js --sign-message {message} {privateKeyPassword}
client.js --sm {message} {privateKeyPassword}
```

* Verify message.
Required: message, signature
```
client.js --verify-message {message} {signature}
client.js --vm {message} {signature}
```

* Get keys.
```
client.js --get-keys
```

* Help. Look for all commands
```
client.js --help
client.js -h
```

## Server

* Run the server
Use default password:'passs'.
```
npm run start
```

If you want a custom password run:
```
node server.js {password}
```

### Endpoints:

Authenticated:
```
'/api/store-public-key'
```

Non authenticated:
```
'/api/verify-message'
```
