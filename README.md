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
'/api/validate-message'
```