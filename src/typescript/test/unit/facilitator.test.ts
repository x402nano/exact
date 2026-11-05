import { describe, it, expect, vi } from "vitest";
import { x402Facilitator } from "@x402/core/facilitator";
import { ExactNanoScheme as FacilitatorExactNanoScheme } from "../../facilitator";
import {
  ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK,
  ERROR_NETWORK_MISMATCH,
  ERROR_NOT_ENOUGH_BALANCE,
  ERROR_UNSUPPORTED_NETWORK,
} from "../../constants";
import {
  MOCK_SIGNER,
  MOCK_SIGNER_BLOCK_ALREADY_EXISTS,
  MOCK_SIGNER_BLOCK_FRONTIER_CHANGED,
  MOCK_SIGNER_WITH_BLOCK_INFO_FOR_SETTLEMENT_TEST,
  MOCK_PAYMENT_PAYLOAD,
  MOCK_PAYMENT_PAYLOAD_INVALID,
  MOCK_PAYMENT_PAYLOAD_INVALID_SIGNATURE,
  MOCK_PAYMENT_REQUIREMENT_A,
  MOCK_SEND_BLOCK,
  MOCK_SETTLED_BLOCK_HASH,
  NETWORK,
  UNSUPPORTED_X402_VERSION,
  UNSUPPORTED_NETWORK,
  UNSUPPORTED_ASSET,
  MOCK_SIGNER_SMALL_BALANCE,
} from "./setup";

// ---------------------------------------------------

describe("@x402nano/exact - Facilitator", () => {
  let scheme: FacilitatorExactNanoScheme;
  let facilitator: x402Facilitator;

  // -----

  it("should export ExactNanoScheme", () => {
    scheme = new FacilitatorExactNanoScheme(MOCK_SIGNER);
    expect(scheme).toBeDefined();
  });

  // -----

  it("should create Facilitator instance", () => {
    facilitator = new x402Facilitator();
    expect(facilitator).toBeDefined();
  });

  // -----

  it(`should have the network "${NETWORK}" registered to Facilitator`, () => {
    facilitator.register(NETWORK, scheme);
    expect(facilitator.getSupported().kinds[0]?.network === NETWORK).toBeTruthy();
  });

  // -----

  it("should reject an unsupported x402 version", async () => {
    await expect(
      facilitator.verify(
        { ...MOCK_PAYMENT_PAYLOAD, x402Version: UNSUPPORTED_X402_VERSION },
        MOCK_PAYMENT_REQUIREMENT_A,
      ),
    ).rejects.toThrow(`No facilitator registered for x402 version: ${UNSUPPORTED_X402_VERSION}`);
  });

  // -----

  it("should reject an unsupported network", async () => {
    expect(
      await facilitator.verify(
        {
          ...MOCK_PAYMENT_PAYLOAD,
          accepted: { ...MOCK_PAYMENT_PAYLOAD.accepted, network: UNSUPPORTED_NETWORK },
        },
        MOCK_PAYMENT_REQUIREMENT_A,
      ),
    ).toHaveProperty("invalidReason", ERROR_UNSUPPORTED_NETWORK);
  });

  // -----

  it("should reject mismatched networks", async () => {
    expect(
      await facilitator.verify(
        {
          ...MOCK_PAYMENT_PAYLOAD,
          accepted: { ...MOCK_PAYMENT_PAYLOAD.accepted, network: "nano:testnet" },
        },
        MOCK_PAYMENT_REQUIREMENT_A,
      ),
    ).toHaveProperty("invalidReason", ERROR_NETWORK_MISMATCH);
  });

  // -----

  it("should reject an unsupported asset", async () => {
    expect(
      await facilitator.verify(
        {
          ...MOCK_PAYMENT_PAYLOAD,
          accepted: { ...MOCK_PAYMENT_PAYLOAD.accepted, asset: UNSUPPORTED_ASSET },
        },
        MOCK_PAYMENT_REQUIREMENT_A,
      ),
    ).toHaveProperty("invalidReason", ERROR_INVALID_ASSET);
  });

  // -----

  it("should reject an invalid block signature", async () => {
    expect(
      await facilitator.verify(MOCK_PAYMENT_PAYLOAD_INVALID_SIGNATURE, MOCK_PAYMENT_REQUIREMENT_A),
    ).toHaveProperty("invalidReason", ERROR_INVALID_BLOCK);
  });

  // -----

  it(`should reject a payment with not enough balance`, async () => {
    const schemeSmallBalance = new FacilitatorExactNanoScheme(MOCK_SIGNER_SMALL_BALANCE);
    const facilitatorSmallBalance = new x402Facilitator();
    facilitatorSmallBalance.register(NETWORK, schemeSmallBalance);
    expect(
      await facilitatorSmallBalance.verify(MOCK_PAYMENT_PAYLOAD, MOCK_PAYMENT_REQUIREMENT_A),
    ).toHaveProperty("invalidReason", ERROR_NOT_ENOUGH_BALANCE);
  });

  // -----

  it(`should reject an invalid verification`, async () => {
    expect(
      (await facilitator.verify(MOCK_PAYMENT_PAYLOAD_INVALID, MOCK_PAYMENT_REQUIREMENT_A)).isValid,
    ).toBeFalsy();

    // Create a scenario where we are trying to verify a payment for which the send block has already previously been submitted to the network
    const schemeBlockAlreadyExists = new FacilitatorExactNanoScheme(
      MOCK_SIGNER_BLOCK_ALREADY_EXISTS,
    );
    const facilitatorBlockAlreadyExists = new x402Facilitator();
    facilitatorBlockAlreadyExists.register(NETWORK, schemeBlockAlreadyExists);
    expect(
      (await facilitatorBlockAlreadyExists.verify(MOCK_PAYMENT_PAYLOAD, MOCK_PAYMENT_REQUIREMENT_A))
        .isValid,
    ).toBeFalsy();

    // Create a scenario where we are trying to verify a payment for which the send block has an outdated previous value (not equal to frontier)
    const schemeBlockFrontierChanged = new FacilitatorExactNanoScheme(
      MOCK_SIGNER_BLOCK_FRONTIER_CHANGED,
    );
    const facilitatorBlockFrontierChanged = new x402Facilitator();
    facilitatorBlockFrontierChanged.register(NETWORK, schemeBlockFrontierChanged);
    expect(
      (
        await facilitatorBlockFrontierChanged.verify(
          MOCK_PAYMENT_PAYLOAD,
          MOCK_PAYMENT_REQUIREMENT_A,
        )
      ).isValid,
    ).toBeFalsy();
  });

  // -----

  it(`should return a valid settlement response`, async () => {
    const schemeBlockInfoForSettlementTest = new FacilitatorExactNanoScheme(
      MOCK_SIGNER_WITH_BLOCK_INFO_FOR_SETTLEMENT_TEST,
    );
    const facilitatorBlockInfoForSettlementTest = new x402Facilitator();
    facilitatorBlockInfoForSettlementTest.register(NETWORK, schemeBlockInfoForSettlementTest);

    vi.useFakeTimers();

    const settlementPromise = facilitatorBlockInfoForSettlementTest.settle(
      MOCK_PAYMENT_PAYLOAD,
      MOCK_PAYMENT_REQUIREMENT_A,
    );

    await vi.runAllTimersAsync();

    expect(await settlementPromise).toStrictEqual({
      success: true,
      transaction: MOCK_SETTLED_BLOCK_HASH,
      network: NETWORK,
      payer: MOCK_SEND_BLOCK.account,
    });

    vi.useRealTimers();
  });

  // -----

  it(`should reject an invalid settlement`, async () => {
    expect(
      (await facilitator.settle(MOCK_PAYMENT_PAYLOAD_INVALID, MOCK_PAYMENT_REQUIREMENT_A)).success,
    ).toBeFalsy();
  });
});
