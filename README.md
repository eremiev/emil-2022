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