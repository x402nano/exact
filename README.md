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
- `Client`, `Resource Server` & `Facilitator` implementations
- Supports the `nano:*` family of networks e.g. `nano:mainnet`, `nano:betanet`
- Ready-to-run [examples](https://github.com/x402nano/exact/tree/main/src/typescript/examples) (`Client` ↔ `Resource Server` ↔ `Facilitator`)

## Implementations

|              | Role                              | Used By                                                             |
| ------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| **`Client`** | Controls a payer's Nano account, capable of generating and signing send state blocks to pay for a resource.            | Wallet developers                     |
| **`Resource Server`**     | Defines payment requirements for a resource (e.g. API, content), and delivers the resource to **`Client`** on successful payment. | API providers, content providers
| **`Facilitator`**          | Service that verifies and/or settles payments for a **`Resource Server`** (performed by a third-party or the **`Resource Server`** itself).                 | API providers, content providers |


See [`/examples/`](https://github.com/x402nano/exact/tree/main/src/typescript/examples) folder for complete runnable versions of all three implementations.

## Installation

> **TypeScript**

```bash
npm install @x402nano/exact @x402nano/helper
```

## Usage

## Project Structure

```text
src/typescript/
 ├── client/          # "exact" scheme implementation for Clients
 ├── server/          # "exact" scheme implementation for Resource Servers
 ├── facilitator/     # "exact" scheme implementation for Facilitators
 ├── common.ts        # Shared functions and constants
 └── examples/        # Ready-to-run example files
```

## Development

> **TypeScript**

```bash
# Install dependencies
npm install

# Build (ESM + CJS + types)
npm run build

# Run unit tests
npm run test
```

## Security Notes 🚨

This is new software and hasn't yet been deployed heavily in production environments yet. Please test with small amounts of Nano only! The authors and contributors shall not be held liable for any use of this software's functionality, intentional or unintentional, that leads to an undesired lose of funds.

## Contributing

We welcome developers to submit implementations of the `exact` scheme in other languages e.g. Python, Go, etc...

Join the [x402 Nano Discord](https://discord.gg/s22QDgc3eJ) for coordination and discussion!

## Related Projects

- [@x402nano/helper](https://github.com/x402nano/helper) – `Helper` module used by `exact` scheme
- [x402.org](https://www.x402.org) – Official x402 protocol website
- [nano.org](https://nano.org) – Official Nano website

## License

MIT
