import {
  __publicField
} from "../chunk-NSSMTXJJ.mjs";

// src/typescript/server/scheme.ts
import { Nano } from "nano-sdk";
import BigNumber from "bignumber.js";
import { ASSET_AMOUNT, STRING_DECIMAL } from "@x402nano/typescript-common";

// src/typescript/common.ts
var CURRENCY_CODE_XNO = "XNO";

// src/typescript/server/scheme.ts
function convertNanoToRaw(amount) {
  return Nano.Math.nanoToRaw({ nano: amount });
}
function parseAmountToString(amount) {
  if (typeof amount === "string") {
    const amount_ = amount.trim();
    try {
      if (!STRING_DECIMAL.safeParse(amount_).success) {
        return amount_;
      }
      return BigNumber(amount_).toFixed();
    } catch (error) {
      void error;
      return amount_;
    }
  }
  if (typeof amount === "number") {
    return BigNumber(amount).toFixed();
  }
  return String(amount);
}
var ExactNanoScheme = class {
  constructor() {
    /**
     * The payment scheme identifier.
     */
    __publicField(this, "scheme", "exact");
    /**
     * Asset-transfer method used when a payment requirement does not specify one.
     *
     * "exact" payments are a single on-chain transfer with no wire-level
     * asset-transfer method, so core's reserved "default" key applies.
     */
    __publicField(this, "defaultAssetTransferMethod", "default");
    /**
     * Payment flows supported per asset-transfer method.
     *
     * "exact" uses the authorization flow: the facilitator verifies the signed
     * block before the resource handler runs and only broadcasts it once the
     * handler succeeds. Clients are therefore never charged for failed requests.
     */
    __publicField(this, "paymentFlows", {
      default: {
        default: "authorization",
        supported: ["authorization"]
      }
    });
  }
  /**
   * Parses a price into an AssetAmount object.
   *
   * Supports both direct AssetAmount input and simple price values (string/number).
   * Converts all amounts to raw units for consistency.
   *
   * @param price - The price to parse, either as a direct AssetAmount or a simple value
   * @param network - The target network (unused in this implementation)
   * @returns Promise that resolves to the parsed AssetAmount
   *
   * @example
   * ```ts
   * const asset = await server.parsePrice("2.5", "nano:mainnet")
   * // Returns { amount: "2500000000000000000000000", asset: "XNO", extra: {} }
   * ```
   */
  async parsePrice(price, network) {
    if (typeof price === "object" && ASSET_AMOUNT.safeParse(price).success) {
      if (price.asset.toUpperCase() !== CURRENCY_CODE_XNO) {
        throw new Error(`Asset must be specified as "${CURRENCY_CODE_XNO}" for AssetAmount`);
      }
      let price_to_string2 = parseAmountToString(price);
      return {
        amount: convertNanoToRaw(price_to_string2),
        asset: price.asset,
        extra: price.extra || {}
      };
    }
    let price_to_string = parseAmountToString(price);
    let isRawUnits;
    if (!STRING_DECIMAL.safeParse(price_to_string).success) {
      isRawUnits = true;
    }
    return {
      amount: isRawUnits ? price_to_string : convertNanoToRaw(price_to_string),
      asset: CURRENCY_CODE_XNO,
      extra: {}
    };
  }
  /**
   * Build payment requirements for this scheme/network combination
   *
   * @param paymentRequirements - The base payment requirements
   * @param supportedKind - The supported kind from facilitator (unused)
   * @param supportedKind.x402Version - The x402 version
   * @param supportedKind.scheme - The logical payment scheme
   * @param supportedKind.network - The network identifier in CAIP-2 format
   * @param supportedKind.extra - Optional extra metadata regarding scheme/network implementation details
   * @param extensionKeys - Extension keys supported by the facilitator (unused)
   * @returns Promise that resolves to the enhanced payment requirements
   */
  enhancePaymentRequirements(paymentRequirements, supportedKind, extensionKeys) {
    void supportedKind;
    void extensionKeys;
    return Promise.resolve(paymentRequirements);
  }
};
export {
  ExactNanoScheme
};
//# sourceMappingURL=index.mjs.map