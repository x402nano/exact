var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/typescript/server/index.ts
var server_exports = {};
__export(server_exports, {
  ExactNanoScheme: () => ExactNanoScheme
});
module.exports = __toCommonJS(server_exports);

// src/typescript/server/scheme.ts
var import_nano_sdk = require("nano-sdk");
var import_bignumber = __toESM(require("bignumber.js"));
var import_typescript_common = require("@x402nano/typescript-common");

// src/typescript/common.ts
function validate(zodSchema, toParse) {
  return zodSchema.safeParse(toParse).success;
}
var CURRENCY_CODE_XNO = "XNO";

// src/typescript/server/scheme.ts
function convertNanoToRaw(amount) {
  return import_nano_sdk.Nano.Math.nanoToRaw({ nano: amount });
}
function parseAmountToString(amount) {
  if (typeof amount === "string") {
    const amount_ = amount.trim();
    try {
      if (validate(import_typescript_common.STRING_DECIMAL, amount_)) {
        return amount_;
      }
      return (0, import_bignumber.default)(amount_).toFixed();
    } catch (_) {
      return amount_;
    }
  }
  if (typeof amount === "number") {
    return (0, import_bignumber.default)(amount).toFixed();
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
    if (typeof price === "object" && validate(import_typescript_common.ASSET_AMOUNT, price)) {
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
    if (!validate(import_typescript_common.STRING_DECIMAL, price_to_string)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExactNanoScheme
});
//# sourceMappingURL=index.js.map