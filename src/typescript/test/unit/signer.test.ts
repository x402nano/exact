import { describe, it, expect, vi } from "vitest";
import { x402Client } from "@x402/core/client";
import {
  ExactNanoScheme as ClientExactNanoScheme,
  createClientNanoSigner,
  createFacilitatorNanoSigner,
} from "../../";
import {
  MOCK_SIGNER,
  MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT,
  NETWORK,
  SUPPORTED_X402_VERSION,
} from "./setup";

// ---------------------------------------------------
describe("@x402nano/exact - Signer module", () => {
  it("should forward errors from 'createClientNanoSigner' when an invalid config object is provided", async () => {
    expect(() => {
      createClientNanoSigner({
        accountPrivateKey: "ABCDEFG", // ** invalid private key format **
        rpcUrl: "http://127.0.0.1/rpc",
      });
    }).toThrow();

    expect(() => {
      createClientNanoSigner({
        accountPrivateKey: "93269A4A1793A2D904C224A820061DDCD1D4CC270EEBCD2E6A8FC581CFA8DB81",
        rpcUrl: "not_a_url", // ** invalid RPC URL format **
      });
    }).toThrow();

    expect(() => {
      createClientNanoSigner({
        // ** accountPrivateKey is missing **
        rpcUrl: "http://127.0.0.1/rpc",
      });
    }).toThrow();

    expect(() => {
      createClientNanoSigner({
        accountPrivateKey: "93269A4A1793A2D904C224A820061DDCD1D4CC270EEBCD2E6A8FC581CFA8DB81",
        // ** rpcUrl is missing **
      });
    }).toThrow();

    expect(() => {
      createClientNanoSigner({
        accountPrivateKey: "93269A4A1793A2D904C224A820061DDCD1D4CC270EEBCD2E6A8FC581CFA8DB81",
        rpcUrl: "http://127.0.0.1/rpc",
        rpcApiKey: 1234, // ** invalid RPC API key format **
      });
    }).toThrow();

    expect(() => {
      createClientNanoSigner({
        accountPrivateKey: "93269A4A1793A2D904C224A820061DDCD1D4CC270EEBCD2E6A8FC581CFA8DB81",
        rpcUrl: "http://127.0.0.1/rpc",
        workGenerationUrl: "not_a_url", // ** invalid work generation URL format **
      });
    }).toThrow();

    expect(() => {
      createClientNanoSigner({
        accountPrivateKey: "93269A4A1793A2D904C224A820061DDCD1D4CC270EEBCD2E6A8FC581CFA8DB81",
        rpcUrl: "http://127.0.0.1/rpc",
        workGenerationUrl: "http://127.0.0.1/work",
        workGenerationApiKey: 1234, // ** invalid work generation API key format **
      });
    }).toThrow();
  });

  // -----

  it("should forward errors from 'createFacilitatorNanoSigner' when an invalid config object is provided", async () => {
    expect(() => {
      createFacilitatorNanoSigner({
        rpcUrl: "not_a_url", // ** invalid RPC URL format **
      });
    }).toThrow();

    expect(() => {
      createFacilitatorNanoSigner({
        rpcUrl: "http://127.0.0.1/rpc",
        rpcApiKey: 1234, // ** invalid RPC API key format **
      });
    }).toThrow();
  });

  // -----

  it("should forward errors from 'Signer.generateSendBlock'", async () => {
    const failingSigner = {
      ...MOCK_SIGNER,
      generateSendBlock: vi.fn().mockRejectedValue(new Error("Insufficient balance")),
    };

    const failingScheme = new ClientExactNanoScheme(failingSigner);
    const badClient = new x402Client();
    badClient.register(NETWORK, failingScheme);

    await expect(
      badClient.createPaymentPayload(SUPPORTED_X402_VERSION, MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT),
    ).rejects.toThrow();
  });

  // -----

  it("should forward errors from 'Signer.getAccountInfo'", async () => {
    const failingSigner = {
      ...MOCK_SIGNER,
      getAccountInfo: vi.fn().mockRejectedValue(new Error("getAccountInfo failed")),
    };

    const failingScheme = new ClientExactNanoScheme(failingSigner);
    const badClient = new x402Client();
    badClient.register(NETWORK, failingScheme);

    await expect(
      badClient.createPaymentPayload(SUPPORTED_X402_VERSION, MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT),
    ).rejects.toThrow();
  });
});
