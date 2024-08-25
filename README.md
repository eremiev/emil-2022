Bitpay - Task
=======================

## Client

### Available commands:

** Generate asymmetric keypair.***
Optional: password

```
client.js --generate-keys {password}
client.js --gk {password}
```

** Submit the public key to the server via a password-authenticated http request.***
Required: password
```
client.js --send-public-key {password}
client.js --spk {password}
```

** Sign message.***
Required: message
Optional: password
```
client.js --sign-message {message} {password}
client.js --sm {message} {password}
```

** Verify message.***
Required: message
```
client.js --verify-message {message}
client.js --vm {message}
```

** Get keys.***
```
client.js --get-keys
```

** Help. Look for all commands***
```
client.js --help
client.js -h
```

## Server

** Run the server***
Use password by default.
```
npm run start
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