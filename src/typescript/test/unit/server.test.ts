import { describe, it, expect, vi } from "vitest";
import { SchemeNetworkServer } from "@x402/core/types";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactNanoScheme as ServerExactNanoScheme } from "../../server";
import {
  SCHEME,
  NETWORK,
  SUPPORTED_X402_VERSION,
  MOCK_ROUTES,
  MOCK_ROUTE_A_KEY,
  MOCK_RESOURCE_A,
  MOCK_PAYMENT_REQUIRED_RESPONSE_SERVER,
} from "./setup";
import { CURRENCY_CODE_XNO } from "../../constants";
import { priceNanoUnits, priceRawUnits } from "../../utils";

let paymentRequirement;

// ---------------------------------------------------

describe("@x402nano/exact - Resource Server", () => {
  let scheme: SchemeNetworkServer;
  let server: x402ResourceServer;

  it("should export ExactNanoScheme", () => {
    scheme = new ServerExactNanoScheme();
    expect(scheme).toBeDefined();
  });

  // -----

  it("should create Server instance", async () => {
    let facilitatorClient = new HTTPFacilitatorClient();

    facilitatorClient.getSupported = vi.fn().mockResolvedValue({
      kinds: [
        {
          x402Version: SUPPORTED_X402_VERSION,
          scheme: SCHEME,
          network: NETWORK,
        },
      ],
      extensions: [],
    });

    server = new x402ResourceServer(facilitatorClient);

    expect(server).toBeDefined();
  });

  // -----

  it(`should have the scheme "${SCHEME}" on network "${NETWORK}" registered to Server`, async () => {
    server.register(NETWORK, scheme);
    await server.initialize();
    expect(server.registeredServerSchemes?.get(NETWORK)?.get(SCHEME)?.scheme).toBe(SCHEME);
  });

  // -----

  it(`should have a valid Payment Required response`, async () => {
    paymentRequirement = (await server.buildPaymentRequirements(MOCK_ROUTES[MOCK_ROUTE_A_KEY]))[0];
    let paymentRequiredResponse = await server.createPaymentRequiredResponse(
      [paymentRequirement],
      MOCK_RESOURCE_A,
    );

    expect(paymentRequiredResponse).toStrictEqual(MOCK_PAYMENT_REQUIRED_RESPONSE_SERVER);
  });

  // -----

  it(`should carry the Facilitator's "extra.workOptional" into the Payment Required response when the route config does not set it`, async () => {
    let facilitatorClient = new HTTPFacilitatorClient();

    facilitatorClient.getSupported = vi.fn().mockResolvedValue({
      kinds: [
        {
          x402Version: SUPPORTED_X402_VERSION,
          scheme: SCHEME,
          network: NETWORK,
          extra: { workOptional: true },
        },
      ],
      extensions: [],
    });

    let serverWithWorkGeneration = new x402ResourceServer(facilitatorClient);
    serverWithWorkGeneration.register(NETWORK, new ServerExactNanoScheme());
    await serverWithWorkGeneration.initialize();

    expect(MOCK_ROUTES[MOCK_ROUTE_A_KEY]).not.toHaveProperty("extra");

    let [requirement] = await serverWithWorkGeneration.buildPaymentRequirements(
      MOCK_ROUTES[MOCK_ROUTE_A_KEY],
    );

    expect(requirement.extra).toStrictEqual({ workOptional: true });
    // a Facilitator that does not advertise work generation leaves "extra" untouched
    expect(paymentRequirement.extra).toStrictEqual({});
  });

  // -----

  it(`should parse a price (raw units, string type)`, async () => {
    expect(
      await scheme.parsePrice(priceRawUnits("10000000000000000000000000"), NETWORK),
    ).toStrictEqual({
      amount: "10000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a price (raw units, number type)`, async () => {
    expect(
      await scheme.parsePrice(priceRawUnits(300000000000000000000000000), NETWORK),
    ).toStrictEqual({
      amount: "300000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a price (nano units, string type)`, async () => {
    expect(await scheme.parsePrice(priceNanoUnits(1.1), NETWORK)).toStrictEqual({
      amount: "1100000000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a price (nano units, number type)`, async () => {
    expect(await scheme.parsePrice(priceNanoUnits("999999.999999"), NETWORK)).toStrictEqual({
      amount: "999999999999000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a Price object (nano units, string type)`, async () => {
    expect(await scheme.parsePrice(priceNanoUnits("0.0001"), NETWORK)).toStrictEqual({
      amount: "100000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a valid non-AssetAmount type (raw units, string type)'`, async () => {
    expect(await scheme.parsePrice("10000000000000000000000000", NETWORK)).toStrictEqual({
      amount: "10000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a valid non-AssetAmount type (nano units, string type)'`, async () => {
    expect(await scheme.parsePrice("0.00001", NETWORK)).toStrictEqual({
      amount: "10000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a valid non-AssetAmount type (raw units, number type)'`, async () => {
    expect(await scheme.parsePrice(100000000000, NETWORK)).toStrictEqual({
      amount: "100000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should parse a valid non-AssetAmount type (nano units, number type)'`, async () => {
    expect(await scheme.parsePrice(0.00001, NETWORK)).toStrictEqual({
      amount: "10000000000000000000000000",
      asset: CURRENCY_CODE_XNO,
      extra: {},
    });
  });

  // -----

  it(`should throw if too large of a raw unit amount is provided to 'parsePrice'`, async () => {
    await expect(
      scheme.parsePrice(
        priceRawUnits(
          "1000000000000000000000000000000000000000000000000000000000000000000000000000000",
        ),
        NETWORK,
      ),
    ).rejects.toThrow();
  });

  it(`should throw if a negative raw unit amount is provided to 'parsePrice'`, async () => {
    await expect(
      scheme.parsePrice(priceRawUnits("-10000000000000000000000000"), NETWORK),
    ).rejects.toThrow();
  });

  it(`should throw if too large of a nano unit amount is provided to 'parsePrice'`, async () => {
    await expect(() =>
      scheme.parsePrice(
        priceNanoUnits(
          "1000000000000000000000000000000000000000000000000000000000000000000000000000000.0001",
        ),
        NETWORK,
      ),
    ).toThrow();
  });

  it(`should throw if a negative nano unit amount is provided to 'parsePrice'`, async () => {
    await expect(() => scheme.parsePrice(priceNanoUnits("-1000.001"), NETWORK)).toThrow();
    await expect(() => scheme.parsePrice(priceNanoUnits(-1000.001), NETWORK)).toThrow();
  });
});
