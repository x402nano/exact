import { describe, it, expect } from "vitest";
import {
  priceNanoUnits,
  priceRawUnits,
  validateNanoRpcUrl,
  validateNanoWorkGenerationUrl,
  validateNanoAccountPrivateKey,
  validateCustomWorkGenerator,
} from "../../utils";
import { CURRENCY_CODE_XNO } from "../../constants";

// ---------------------------------------------------

describe("@x402nano/exact - utils", () => {
  describe("priceNanoUnits", () => {
    it(`should accept a nano value (string)`, async () => {
      expect(priceNanoUnits("123")).toStrictEqual({
        amount: "123000000000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should accept a nano value (number)`, async () => {
      expect(priceNanoUnits(123)).toStrictEqual({
        amount: "123000000000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should accept a decimal nano value (string)`, async () => {
      expect(priceNanoUnits("444.555")).toStrictEqual({
        amount: "444555000000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should accept a nano value (number)`, async () => {
      expect(priceNanoUnits(555.888)).toStrictEqual({
        amount: "555888000000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should pass along extra object`, async () => {
      expect(priceNanoUnits(555.888, { abc: "xyz" })).toStrictEqual({
        amount: "555888000000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: { abc: "xyz" },
      });
    });

    it(`should convert leading decimal values`, async () => {
      expect(priceNanoUnits(".0003")).toStrictEqual({
        amount: "300000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should convert leading decimal values`, async () => {
      expect(priceNanoUnits(".000002")).toStrictEqual({
        amount: "2000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });
  });

  // -----

  describe("priceRawUnits", () => {
    it(`should accept a raw value (string or number type)`, async () => {
      expect(priceRawUnits("100000000000000000000000000")).toStrictEqual({
        amount: "100000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
      expect(priceRawUnits(300000000000000000000000000)).toStrictEqual({
        amount: "300000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should pass along extra object`, async () => {
      expect(priceRawUnits("90000000000000000000000000000", { abc: "xyz" })).toStrictEqual({
        amount: "90000000000000000000000000000",
        asset: CURRENCY_CODE_XNO,
        extra: { abc: "xyz" },
      });
    });

    it(`should handle smallest possible Nano value (1 raw)`, async () => {
      expect(priceRawUnits("1")).toStrictEqual({
        amount: "1",
        asset: CURRENCY_CODE_XNO,
        extra: {},
      });
    });

    it(`should throw if nano unit amount is passed to 'priceRawUnits'`, async () => {
      expect(() => priceRawUnits("88.0001")).toThrow();
      expect(() => priceRawUnits(88.0001)).toThrow();
    });
  });

  // -----

  describe("validateNanoRpcUrl", () => {
    it(`should accept a valid URL`, async () => {
      expect(validateNanoRpcUrl("https://nano-rpc.com/rpc")).toBeTruthy();
      expect(validateNanoRpcUrl("http://127.0.0.1/rpc")).toBeTruthy();
    });

    it(`should throw if non-URL passed`, async () => {
      expect(() => validateNanoRpcUrl("192.188.2.12")).toThrow();
      expect(() => validateNanoRpcUrl("not_a_URL")).toThrow();
    });
  });

  // -----

  describe("validateNanoWorkGenerationUrl", () => {
    it(`should accept a valid URL`, async () => {
      expect(validateNanoWorkGenerationUrl("https://nano-work-generator.com/work")).toBeTruthy();
      expect(validateNanoWorkGenerationUrl("http://127.0.0.1/work")).toBeTruthy();
    });

    it(`should throw if non-URL passed`, async () => {
      expect(() => validateNanoWorkGenerationUrl("192.188.2.12")).toThrow();
      expect(() => validateNanoWorkGenerationUrl("not_a_URL")).toThrow();
    });
  });

  // -----

  describe("validateNanoAccountPrivateKey", () => {
    it(`'validateNanoAccountPrivateKey' should accept valid Nano account private keys`, async () => {
      expect(
        validateNanoAccountPrivateKey(
          "091DE1FB729AC9ADBC2BD272448FECBC692CFB67A4D884AEC518BD7630392CAF",
        ),
      ).toBeTruthy();
    });

    it(`should throw if non-Nano private key passed to 'validateNanoAccountPrivateKey'`, async () => {
      expect(() => validateNanoAccountPrivateKey("abc123")).toThrow();
    });
  });

  // -----

  describe("validateCustomWorkGenerator", () => {
    it(`should accept function`, async () => {
      expect(
        validateCustomWorkGenerator(async function ({ block, network }) {
          void block; // normally used in this function but voided for this test
          void network; // normally used in this function but voided for this test
          let work = "";
          /* generate work... */
          work = "generated_work_value_here";
          return work;
        }),
      ).toBeTruthy();
    });

    it(`should throw if non-function passed`, async () => {
      expect(() => validateCustomWorkGenerator("abc123")).toThrow();
    });
  });
});
