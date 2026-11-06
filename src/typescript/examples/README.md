# x402 Nano Payment Example Using Exact Scheme

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)
[![x402](https://img.shields.io/badge/protocol-x402-0066ff?style=flat-square)](https://www.x402.org)
[![Nano](https://img.shields.io/badge/crypto-Nano-4fc0d0?style=flat-square&logo=nano)](https://nano.org)

This repository contains **minimal, runnable examples** showing how to implement fixed-amount Nano (XNO) payments of any size over [x402 protocol](https://x402.org/) via the `exact` scheme.

The **x402 protocol** (reviving HTTP **402 Payment Required**) enables simple, programmatic micropayments — perfect for APIs, content, AI inference, or any pay-per-use resource without subscriptions or API keys.

## Components

The examples consists of three independent components:

| Service               | Role                              | Main file                 | Description                                                             |
| --------------------- | --------------------------------- | ------------------------- | ----------------------------------------------------------------------- |
| **`Client`**          | Pays for resource                 | `example-client.mjs`      | Requests resource → creates Nano payment → retries request with payment |
| **`Resource Server`** | Paywalls content / API            | `example-server.mjs`      | Returns 402 → verifies & settles → delivers content                     |
| **`Facilitator`**     | Payment verification & settlement | `example-facilitator.mjs` | Validates Nano blocks & publishes them to the network                   |

## Flow (simplified)

```text
Client ──► Resource Server  (GET /premium-api)
           │
           └─ 402 Payment Required + PAYMENT-REQUIRED header
           │
Client ──► creates Nano send block (via Signer)
           │
Client ──► Resource Server  (same GET + PAYMENT-SIGNATURE header)
           │
Resource Server ──► Facilitator (/verify)
           │
Resource Server ──► Facilitator (/settle) → Nano network
           │
           └─ 200 OK + PAYMENT-RESPONSE header + content
```

## Prerequisites

- **Nano account** and its associated private key (🚨 **not** wallet seed 🚨). Use a Nano account with a small balance.
- Access to a **Nano RPC** endpoint
- Access to a **work generation** endpoint for Proof-of-Work generation. This can also be the **Nano RPC** endpoint if it allows the `work_generate` action.

## Setup

1. **In project root, copy `.env.example` to `.env`**

2. **Setup environment variables in `.env`**

   ```env
   # Nano account private key of Client (64 hex characters – NOT the wallet seed!)
   CLIENT_NANO_ACCOUNT_PRIVATE_KEY=...

   # Nano RPC endpoint
   NANO_RPC_URL=https://rpc.nano.org

   # Optional – dedicated work server (defaults to NANO_RPC_URL value)
   NANO_WORK_GENERATION_URL=https://work-server.example.com/rpc

   # Where payments should be sent (your receiving Nano account)
   PAYMENT_REQUIREMENT_PAY_TO=nano_1abc...123

   # Amount to charge – in **raw units**
   # Example: 0.001 Nano = 1000000000000000000000000000 raw units
   PAYMENT_REQUIREMENT_AMOUNT=1000000000000000000000000000

   # Path & ports
   RESOURCE_PATH=/premium-api
   RESOURCE_SERVER_PORT=3121
   FACILITATOR_PORT=3122
   ```

   **Important security note**: Never commit `/src/typescript/.env` to version control.

4. **Navigate to `/src/typescript/examples/` folder**

5. **Install required packages using `npm install`**

## Running the examples

Open **three terminals** in the `exact/src/typescript/examples/` directory and run the specified commands in the following order:

**`Terminal 1 – Facilitator`**

```bash
npm run facilitator
```

**`Terminal 2 – Resource Server`**

```bash
npm run server
```

**`Terminal 3 – Client`**

```bash
npm run client
```

Expected output in `Terminal 3 - Client` (indicating successful payment flow):

```
✅ Settlement:
  Transaction: <hash of confirmed block>
  Payer: nano_...
  Network: nano:mainnet

✅ Unlocked content:
{ data: "Here is your unlocked content!", timestamp: "2026-..." }
```

## Project Structure

```
exact/src/typescript/examples/
├── example-client.mjs       # Demonstrates x402Client + ExactNanoScheme
├── example-facilitator.mjs  # Demonstrates x402Facilitator + ExactNanoScheme
└── example-server.mjs       # Demonstrates x402ResourceServer + ExactNanoScheme

```

## Packages Used

- `@x402/core` — core x402 protocol logic (x402Client, x402ResourceServer, x402Facilitator)
- `@x402nano/exact` — Nano-specific "exact" payment scheme implementation
- `express` - Needed for example Facilitator and example Resource Server

## Security Note

- **Never** use a mainnet private key containing a lot of Nano for these examples. Test with **very small amounts** only.

## Learn More

- [x402 Overview](https://docs.x402.org/introduction)
- [Nano RPC Documentation](https://docs.nano.org/commands/rpc-protocol/)
