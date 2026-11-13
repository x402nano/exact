import {
  ASSET_AMOUNT,
  ERROR_PRICE,
  convertNanoToRaw,
  isNanoUnits,
  isRawUnits,
  priceRawUnits
} from "./chunk-ENXE72SS.mjs";
import {
  __publicField
} from "./chunk-NSSMTXJJ.mjs";

// src/typescript/server/scheme.ts
var ExactNanoScheme = class {
  constructor() {
    /**
     * The payment scheme identifier.
     */
    __publicField(this, "scheme", "exact");
    __publicField(this, "defaultAssetTransferMethod", "default");
    __publicField(this, "paymentFlows", {
      default: { supported: ["authorization"], default: "authorization" }
    });
  }
  /**
   * Parses a price into an AssetAmount object.
   *
   * Normalizes all Price amounts to raw units for consistency.
   *
   * @param price - The price to parse as an AssetAmount object, string or number
   * @param network - The target network (unused in this function as we are dealing with a single native token)
   * @returns Promise that resolves to the parsed AssetAmount
   *
   * @example
   * ```ts
   * const asset = await server.parsePrice(
   *  price: {
   *    amount: "2500000000000000000000000",
   *    asset: "XNO",
   *  },
   *  "nano:mainnet"
   * )
   * // Returns { amount: "2500000000000000000000000", asset: "XNO", extra: {} }
   * ```
   */
  async parsePrice(price, network) {
    void network;
    const errorMessage = `${ERROR_PRICE} - Invalid Price.`;
    let price_;
    const priceParsedToAssetAmount = ASSET_AMOUNT.safeParse(price);
    if (!priceParsedToAssetAmount.success) {
      if (typeof price === "number") {
        price = String(price);
      }
      if (typeof price === "string") {
        if (isRawUnits(price)) {
          price_ = priceRawUnits(price);
        } else if (isNanoUnits(price)) {
          price_ = priceRawUnits(convertNanoToRaw(price));
        } else {
          throw new Error(errorMessage);
        }
      } else {
        throw new Error(errorMessage);
      }
    } else {
      price_ = priceParsedToAssetAmount.data;
    }
    return price_;
  }
  /**
   * Build payment requirements for this scheme/network combination
   *
   * @param paymentRequirements - The base payment requirements
   * @param supportedKind - The supported kind from facilitator
   * @param supportedKind.x402Version - The x402 version
   * @param supportedKind.scheme - The logical payment scheme
   * @param supportedKind.network - The network identifier in CAIP-2 format
   * @param supportedKind.extra - Optional extra metadata regarding scheme/network implementation details
   * @param extensionKeys - Extension keys supported by the facilitator (unused)
   * @returns Promise that resolves to the enhanced payment requirements
   */
  enhancePaymentRequirements(paymentRequirements, supportedKind, extensionKeys) {
    void extensionKeys;
    const extra = { ...paymentRequirements.extra };
    if (supportedKind?.extra?.workOptional === true && extra.workOptional === void 0) {
      extra.workOptional = true;
    }
    return Promise.resolve({ ...paymentRequirements, extra });
  }
};

export {
  ExactNanoScheme
};
//# sourceMappingURL=chunk-YDXN5SQV.mjs.map