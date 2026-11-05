import { describe, it, expect, beforeEach } from "vitest";
import { x402Client } from "@x402/core/client";
import { ExactNanoScheme as ClientExactNanoScheme } from "../../client";
import {
  MOCK_SIGNER,
  MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT,
  MOCK_PAYMENT_PAYLOAD,
  NETWORK,
  SUPPORTED_X402_VERSION,
  UNSUPPORTED_X402_VERSION,
  SCHEME,
} from "./setup";
import { CURRENCY_CODE_XNO } from "../../constants";

// ---------------------------------------------------

function changeMockPaymentPayloadSendBlock(propertyToChange: object) {
  return {
    ...MOCK_PAYMENT_PAYLOAD,
    payload: {
      block: {
        ...MOCK_PAYMENT_PAYLOAD.payload.block,
        ...propertyToChange,
      },
    },
  };
}

// ---------------------------------------------------
describe("@x402nano/exact - Client", () => {
  let scheme: ClientExactNanoScheme;
  let client: x402Client;

  beforeEach(() => {
    scheme = new ClientExactNanoScheme(MOCK_SIGNER);
    client = new x402Client();
    client.register(NETWORK, scheme);
    client.setSpendControls({
      allowedAssets: [{ network: NETWORK, asset: CURRENCY_CODE_XNO }],
    });
  });

  // -----

  it("should export ExactNanoScheme", () => {
    expect(scheme).toBeDefined();
  });

  // -----

  it("should create Client instance", () => {
    expect(client).toBeDefined();
  });

  // -----

  it(`should have the scheme "${SCHEME}" on network "${NETWORK}" registered to Client`, () => {
    expect(
      client.registeredClientSchemes?.get(SUPPORTED_X402_VERSION)?.get(NETWORK)?.get(SCHEME)
        ?.scheme,
    ).toBe(SCHEME);
  });

  // -----

  it("should reject an unsupported x402 version", async () => {
    await expect(
      client.createPaymentPayload({
        ...MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT,
        x402Version: UNSUPPORTED_X402_VERSION,
      }),
    ).rejects.toThrow(`No client registered for x402 version: ${UNSUPPORTED_X402_VERSION}`);
  });

  // -----

  it("should have valid PaymentPayload", async () => {
    expect(await client.createPaymentPayload(MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT)).toStrictEqual(
      MOCK_PAYMENT_PAYLOAD,
    );
  });

  // -----

  it("should support nano:* wildcard registration", async () => {
    const wildcardClient = new x402Client();
    wildcardClient.register("nano:*", scheme);
    wildcardClient.setSpendControls({
      allowedAssets: [{ network: NETWORK, asset: CURRENCY_CODE_XNO }],
    });

    const result = await wildcardClient.createPaymentPayload(MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT);

    expect(result).toHaveProperty("payload.block");
  });

  // -----

  it("should not accept an invalid send block in PaymentPayload", async () => {
    expect(
      await client.createPaymentPayload(MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT),
    ).not.toStrictEqual(changeMockPaymentPayloadSendBlock({ type: "epoch" }));

    expect(
      await client.createPaymentPayload(MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT),
    ).not.toStrictEqual(
      changeMockPaymentPayloadSendBlock({
        account: "raiblocks_1dz4mfgu5a1iq1zmnfcui1kwuno3nw9togicmmszm4ci7w51nqjd3sbej48e",
      }),
    );

    expect(
      await client.createPaymentPayload(MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT),
    ).not.toStrictEqual(
      changeMockPaymentPayloadSendBlock({ balance: "9.1258410000000000000000000000" }),
    );
  });
});
