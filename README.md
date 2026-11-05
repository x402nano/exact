# @x402nano/exact

[![x402](https://img.shields.io/badge/protocol-x402-0066ff?style=flat-square)](https://www.x402.org)
[![Nano](https://img.shields.io/badge/crypto-Nano-4fc0d0?style=flat-square&logo=nano)](https://nano.org)

Implementation of [`exact`](https://github.com/x402nano/schemes/blob/main/exact.md) scheme for fixed-amount Nano (XNO) payments over x402 protocol

<p align="center">
  <br/>
  <b style="font-size: 120%">x402 + Nano = instant, feeless micropayments for APIs & content</b><br/><br/>
</p>

## Features

- Enables fixed-amount Nano (XNO) payments of any size over x402 protocol
- `Client`, `Resource Server` & `Facilitator` component implementations
- Supports the `nano:*` family of networks e.g. `nano:mainnet`, `nano:betanet`
- Ready-to-run [examples](https://github.com/x402nano/exact/tree/main/src/typescript/examples) (`Client` ↔ `Resource Server` ↔ `Facilitator`)

## Components

| Component                      | Role                                                                                                                                        | Used By                          |                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------- |
| **`Client`**          | Creates a payment payload (which includes a Nano send block) to satisfy a payment requirement returned by a **`Resource Server`**.                                 | Wallet developers                | [usage example](https://github.com/x402nano/exact/blob/main/src/typescript/examples/example-client.mjs) / [docs](https://github.com/x402nano/exact/blob/main/src/typescript/client/README.md)                |
| **`Resource Server`** | Defines payment requirements for a resource (e.g. API, content), and delivers the resource to **`Client`** on successful payment.           | API providers, content providers | [usage example](https://github.com/x402nano/exact/blob/main/src/typescript/examples/example-server.mjs) / [docs](https://github.com/x402nano/exact/blob/main/src/typescript/server/README.md)                |
| **`Facilitator`**     | Verifies and settles payments for a **`Resource Server`**. | API providers, content providers | [usage example](https://github.com/x402nano/exact/blob/main/src/typescript/examples/example-facilitator.mjs) / [docs](https://github.com/x402nano/exact/blob/main/src/typescript/facilitator/README.md)                |

See [`/examples/`](https://github.com/x402nano/exact/tree/main/src/typescript/examples) folder for runnable versions of all three components.

## Installation

### **TypeScript**

```bash
npm install @x402nano/exact
```

## Project Structure

### **TypeScript**

```text
src/typescript/
 ├── client/          # "exact" scheme implementation for Clients
 ├── server/          # "exact" scheme implementation for Resource Servers
 ├── facilitator/     # "exact" scheme implementation for Facilitators
 ├── examples/        # Ready-to-run example files
 └── test/            # Test files
    ├── unit/         # Unit testing
    └── integration/  # Integration testing
 .env.example         # Example environment variables. Copy, rename to .env and change values.
                        Used in runnable examples and integration testing
```

## Development

### **TypeScript**

```bash
npm install

# Builds ESM + CJS + types
npm run build
```

## Unit Tests

### **TypeScript**

```bash
npm run test
```

## Integration Tests

### **TypeScript**

To run an integration test which performs a live Nano transaction:

1. **Copy `/src/typescript/.env.example` to `/src/typescript/.env`**

2. **Setup environment variables in `/src/typescript/.env`**

   ```env
   # Nano account private key of Client (64 hex characters – NOT the wallet seed!)
   CLIENT_NANO_ACCOUNT_PRIVATE_KEY=...

   # Nano RPC endpoint
   NANO_RPC_URL=https://nano-rpc-provider.com/rpc

   # Optional – dedicated work server (defaults to NANO_RPC_URL value)
   NANO_WORK_GENERATION_URL=https://work-server.example.com/rpc

   # Where payments should be sent (your receiving Nano account)
   PAYMENT_REQUIREMENT_PAY_TO=nano_1abc...123

   # Amount to charge – in **raw units**
   # Example: 1000000000000000000000000000 raw units (0.001 nano units)
   PAYMENT_REQUIREMENT_AMOUNT=1000000000000000000000000000

   # Path & ports
   RESOURCE_PATH=/premium-api
   RESOURCE_SERVER_PORT=3121
   FACILITATOR_PORT=3122

   # Nano network to use (leave blank or omit altogether to default to "nano:mainnet")
   NANO_NETWORK=nano:mainnet
   ```

   **Important security note**: Never commit `/src/typescript/.env` to version control.
3. **Run the integration test** 

```bash
npm run test:integration
```

## Security Notes 🚨

This is new software and hasn't yet been deployed heavily in production environments yet. Please test with small amounts of Nano only! The authors and contributors shall not be held liable for any use of this software's functionality, intentional or unintentional, that leads to an undesired lose of funds.

## Contributing

We welcome developers to submit full implementations of the `exact` scheme in other languages e.g. Python, Go, etc...

Join the [x402 Nano Discord](https://discord.gg/JAMgp8EXQk) for coordination and discussion!

## Related Projects

- [x402.org](https://www.x402.org) – Official x402 protocol website
- [nano.org](https://nano.org) – Official Nano website

## License

MIT
