/**
 * Nano Exact Scheme - Live Integration Tests
 *
 * This test suite validates end-to-end payment flows for the x402 protocol
 * using the Nano network's "exact" payment scheme. It orchestrates live
 * transactions between a Client, a Resource Server, and a Facilitator to
 * verify payment creation, validation, and settlement on the Nano mainnet.
 *
 * Prerequisites:
 * - A Nano account funded with a small amount to act as the payer. Visit a Nano faucet online to get some funds for testing.
 * - Access to a Nano RPC node and a work generation service.
 * - All required environment variables configured (see README.md in project root).
 *
 */

import { describe, expect, it } from "vitest";
import { Nano } from "nano-sdk";
import { x402Client } from "@x402/core/client";
import { x402Facilitator } from "@x402/core/facilitator";
import { type FacilitatorClient, x402ResourceServer } from "@x402/core/server";
import type {
  Network,
  PaymentPayload,
  PaymentRequirements,
  SettleResponse,
  SupportedResponse,
  VerifyResponse,
} from "@x402/core/types";
import { ERROR_BLOCK_ALREADY_CONFIRMED } from "../../constants";
import {
  ExactNanoClientScheme,
  ExactNanoServerScheme,
  ExactNanoFacilitatorScheme,
  createClientNanoSigner,
  createFacilitatorNanoSigner,
  fromHelperConfig,
  ClientSignerConfig,
  FacilitatorSignerConfig,
  CURRENCY_CODE_XNO,
  NANO_MAINNET_CAIP2,
} from "../../../../dist/esm/index.mjs";

const accountPrivateKey = process.env.CLIENT_NANO_ACCOUNT_PRIVATE_KEY || "";
const nanoAccountToPay = process.env.PAYMENT_REQUIREMENT_PAY_TO || "";
const nanoAmountToPay = process.env.PAYMENT_REQUIREMENT_AMOUNT || "100000000000000000000000000"; // 0.0001 nano;
const rpcUrl = process.env.NANO_RPC_URL || "";
const rpcApiKey = process.env.NANO_RPC_API_KEY || "";
const workGenerationUrl = process.env.NANO_WORK_GENERATION_URL || "";
const workGenerationApiKey = process.env.NANO_WORK_GENERATION_API_KEY || "";

const network = NANO_MAINNET_CAIP2 as Network;

const resource = {
  url: "https://example.com/weather",
  description: "Weather data",
  mimeType: "application/json",
};

const paymentRequirement: PaymentRequirements = {
  scheme: "exact",
  network,
  asset: CURRENCY_CODE_XNO,
  payTo: nanoAccountToPay,
  amount: nanoAmountToPay,
  maxTimeoutSeconds: 120,
  extra: {},
};

const CLIENT_CONFIG_WITH_WORK_GENERATION = {
  rpcUrl,
  rpcApiKey,
  workGenerationUrl,
  workGenerationApiKey,
  accountPrivateKey,
};

const CLIENT_CONFIG_WITHOUT_WORK_GENERATION = {
  rpcUrl,
  rpcApiKey,
  accountPrivateKey,
};

const FACILITATOR_CONFIG_WITH_WORK_GENERATION = {
  rpcUrl,
  rpcApiKey,
  workGenerationUrl,
  workGenerationApiKey,
};

const FACILITATOR_CONFIG_WITHOUT_WORK_GENERATION = {
  rpcUrl,
  rpcApiKey,
};

// ---------------------------------------------------

class NanoFacilitatorClient implements FacilitatorClient {
  readonly scheme = "exact";
  readonly network = network;
  readonly x402Version = 2;

  constructor(private readonly facilitator: x402Facilitator) {}

  verify(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirements,
  ): Promise<VerifyResponse> {
    return this.facilitator.verify(paymentPayload, paymentRequirements);
  }

  settle(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirements,
  ): Promise<SettleResponse> {
    return this.facilitator.settle(paymentPayload, paymentRequirements);
  }

  getSupported(): Promise<SupportedResponse> {
    return Promise.resolve(this.facilitator.getSupported());
  }
}

// ---------------------------------------------------

function getExtra(facilitator: x402Facilitator) {
  const supported = facilitator.getSupported();

  const kindsForNetwork = supported.kinds.filter(function (kind) {
    return kind.network === network;
  });

  let extra = {};
  if (kindsForNetwork.length) {
    extra = kindsForNetwork[0].extra || {};
  }

  return extra;
}

// ---------------------------------------------------

describe("Nano exact live settlement [Client generates work]", () => {
  let server: x402ResourceServer;
  let paymentPayload: PaymentPayload;
  let accepted: PaymentRequirements;
  let settle: SettleResponse;

  it("settles a real transfer from payer to payTo", async () => {
    const clientSigner = createClientNanoSigner(CLIENT_CONFIG_WITH_WORK_GENERATION);

    const facilitatorSigner = createFacilitatorNanoSigner(
      FACILITATOR_CONFIG_WITHOUT_WORK_GENERATION,
    );

    const client = new x402Client().register(network, new ExactNanoClientScheme(clientSigner));

    // Configure client to only create Nano payments
    client.setSpendControls({
      allowedAssets: [{ network: network, asset: CURRENCY_CODE_XNO }],
    });

    const facilitator = new x402Facilitator().register(
      network,
      new ExactNanoFacilitatorScheme(facilitatorSigner),
    );

    server = new x402ResourceServer(new NanoFacilitatorClient(facilitator));
    server.register(network, new ExactNanoServerScheme());
    await server.initialize();

    const accepts: PaymentRequirements[] = [
      { ...paymentRequirement, extra: getExtra(facilitator) },
    ];

    const paymentRequired = await server.createPaymentRequiredResponse(accepts, resource);
    paymentPayload = await client.createPaymentPayload(paymentRequired);

    accepted = server.findMatchingRequirements(accepts, paymentPayload);
    expect(accepted).toBeDefined();

    const verify = await server.verifyPayment(paymentPayload, accepted!);

    expect(verify.isValid).toBe(true);

    expect(verify.payer).toBe(
      Nano.Crypto.deriveAccountFromPublicKey({
        publicKey: Nano.Crypto.derivePublicKeyFromPrivateKey({
          privateKey: accountPrivateKey,
        }),
      }),
    );

    settle = await server.settlePayment(paymentPayload, accepted);

    expect(settle.success).toBe(true);
    expect(settle.transaction).toBeTruthy();
  }, 120_000);

  it("should return correct confirmation hash on settlement replay", async () => {
    expect(await server.settlePayment(paymentPayload, accepted))
      .toHaveProperty("errorReason", ERROR_BLOCK_ALREADY_CONFIRMED)
      .toHaveProperty("transaction", settle.transaction);
  }, 120_000);
});

// ---------------------------------------------------

describe("Nano exact live settlement [Facilitator generates work]", () => {
  let server: x402ResourceServer;
  let paymentPayload: PaymentPayload;
  let accepted: PaymentRequirements;
  let settle: SettleResponse;

  it("settles a real transfer from payer to payTo", async () => {
    const clientSigner = createClientNanoSigner(CLIENT_CONFIG_WITHOUT_WORK_GENERATION);

    const facilitatorSigner = createFacilitatorNanoSigner(FACILITATOR_CONFIG_WITH_WORK_GENERATION);

    const client = new x402Client().register(network, new ExactNanoClientScheme(clientSigner));

    // Configure client to only create Nano payments
    client.setSpendControls({
      allowedAssets: [{ network: network, asset: CURRENCY_CODE_XNO }],
    });

    const facilitator = new x402Facilitator().register(
      network,
      new ExactNanoFacilitatorScheme(facilitatorSigner),
    );

    server = new x402ResourceServer(new NanoFacilitatorClient(facilitator));
    server.register(network, new ExactNanoServerScheme());
    await server.initialize();

    const accepts: PaymentRequirements[] = [
      { ...paymentRequirement, extra: getExtra(facilitator) },
    ];

    const paymentRequired = await server.createPaymentRequiredResponse(accepts, resource);
    paymentPayload = await client.createPaymentPayload(paymentRequired);

    accepted = server.findMatchingRequirements(accepts, paymentPayload);
    expect(accepted).toBeDefined();

    const verify = await server.verifyPayment(paymentPayload, accepted!);

    expect(verify.isValid).toBe(true);

    expect(verify.payer).toBe(
      Nano.Crypto.deriveAccountFromPublicKey({
        publicKey: Nano.Crypto.derivePublicKeyFromPrivateKey({
          privateKey: accountPrivateKey,
        }),
      }),
    );

    settle = await server.settlePayment(paymentPayload, accepted);

    expect(settle.success).toBe(true);
    expect(settle.transaction).toBeTruthy();
  }, 120_000);

  it("should return correct confirmation hash on settlement replay", async () => {
    expect(await server.settlePayment(paymentPayload, accepted))
      .toHaveProperty("errorReason", ERROR_BLOCK_ALREADY_CONFIRMED)
      .toHaveProperty("transaction", settle.transaction);
  }, 120_000);
});

// ---------------------------------------------------

describe('Nano exact live settlement [Client custom "workGenerator" function generates work]', () => {
  let server: x402ResourceServer;
  let paymentPayload: PaymentPayload;
  let accepted: PaymentRequirements;
  let settle: SettleResponse;

  it("settles a real transfer from payer to payTo", async () => {
    const clientSigner = createClientNanoSigner({
      ...CLIENT_CONFIG_WITHOUT_WORK_GENERATION,
      workGenerator: async function ({ block, network }) {
        void network;
        const res = await fetch(workGenerationUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "work_generate",
            hash: block.previous,
            block,
            json_block: true,
          }),
        });

        const json = await res.json();

        return json.work;
      },
    });

    const facilitatorSigner = createFacilitatorNanoSigner(
      FACILITATOR_CONFIG_WITHOUT_WORK_GENERATION,
    );

    const client = new x402Client().register(network, new ExactNanoClientScheme(clientSigner));

    // Configure client to only create Nano payments
    client.setSpendControls({
      allowedAssets: [{ network: network, asset: CURRENCY_CODE_XNO }],
    });

    const facilitator = new x402Facilitator().register(
      network,
      new ExactNanoFacilitatorScheme(facilitatorSigner),
    );

    server = new x402ResourceServer(new NanoFacilitatorClient(facilitator));
    server.register(network, new ExactNanoServerScheme());
    await server.initialize();

    const accepts: PaymentRequirements[] = [
      { ...paymentRequirement, extra: getExtra(facilitator) },
    ];

    const paymentRequired = await server.createPaymentRequiredResponse(accepts, resource);
    paymentPayload = await client.createPaymentPayload(paymentRequired);

    accepted = server.findMatchingRequirements(accepts, paymentPayload);
    expect(accepted).toBeDefined();

    const verify = await server.verifyPayment(paymentPayload, accepted!);

    expect(verify.isValid).toBe(true);

    expect(verify.payer).toBe(
      Nano.Crypto.deriveAccountFromPublicKey({
        publicKey: Nano.Crypto.derivePublicKeyFromPrivateKey({
          privateKey: accountPrivateKey,
        }),
      }),
    );

    settle = await server.settlePayment(paymentPayload, accepted);

    expect(settle.success).toBe(true);
    expect(settle.transaction).toBeTruthy();
  }, 120_000);

  it("should return correct confirmation hash on settlement replay", async () => {
    expect(await server.settlePayment(paymentPayload, accepted))
      .toHaveProperty("errorReason", ERROR_BLOCK_ALREADY_CONFIRMED)
      .toHaveProperty("transaction", settle.transaction);
  }, 120_000);
});

// ---------------------------------------------------

describe("Nano exact live settlement [fromHelperConfig used]", () => {
  let server: x402ResourceServer;
  let paymentPayload: PaymentPayload;
  let accepted: PaymentRequirements;
  let settle: SettleResponse;

  it("settles a real transfer from payer to payTo", async () => {
    const clientSigner = createClientNanoSigner(
      fromHelperConfig({
        NANO_ACCOUNT_PRIVATE_KEY: accountPrivateKey,
        NANO_RPC_URL: rpcUrl,
        NANO_WORK_GENERATION_URL: workGenerationUrl,
      }) as ClientSignerConfig,
    );

    const facilitatorSigner = createFacilitatorNanoSigner(
      fromHelperConfig({
        NANO_RPC_URL: rpcUrl,
      }) as FacilitatorSignerConfig,
    );

    const client = new x402Client().register(network, new ExactNanoClientScheme(clientSigner));

    // Configure client to only create Nano payments
    client.setSpendControls({
      allowedAssets: [{ network: network, asset: CURRENCY_CODE_XNO }],
    });

    const facilitator = new x402Facilitator().register(
      network,
      new ExactNanoFacilitatorScheme(facilitatorSigner),
    );

    server = new x402ResourceServer(new NanoFacilitatorClient(facilitator));
    server.register(network, new ExactNanoServerScheme());
    await server.initialize();

    const accepts: PaymentRequirements[] = [
      { ...paymentRequirement, extra: getExtra(facilitator) },
    ];

    const paymentRequired = await server.createPaymentRequiredResponse(accepts, resource);
    paymentPayload = await client.createPaymentPayload(paymentRequired);

    accepted = server.findMatchingRequirements(accepts, paymentPayload);
    expect(accepted).toBeDefined();

    const verify = await server.verifyPayment(paymentPayload, accepted!);

    expect(verify.isValid).toBe(true);

    expect(verify.payer).toBe(
      Nano.Crypto.deriveAccountFromPublicKey({
        publicKey: Nano.Crypto.derivePublicKeyFromPrivateKey({
          privateKey: accountPrivateKey,
        }),
      }),
    );

    settle = await server.settlePayment(paymentPayload, accepted);

    expect(settle.success).toBe(true);
    expect(settle.transaction).toBeTruthy();
  }, 120_000);

  it("should return correct confirmation hash on settlement replay", async () => {
    expect(await server.settlePayment(paymentPayload, accepted))
      .toHaveProperty("errorReason", ERROR_BLOCK_ALREADY_CONFIRMED)
      .toHaveProperty("transaction", settle.transaction);
  }, 120_000);
});
