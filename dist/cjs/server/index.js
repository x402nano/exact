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

// ../typescript-common/dist/esm/index.mjs
var z = __toESM(require("zod"), 1);
var STRING_INT = z.string().regex(/^\d+$/);
var STRING_DECIMAL = z.string().regex(/^\d*\.\d+$/);
var URL = z.url();
var HEX_64 = z.string().length(64).regex(/^[0-9A-F]{64}$/i);
var NANO_WORK = z.string().regex(/^[0-9A-F]+$/i);
var NANO_ACCOUNT = z.string().regex(/^(nano_|xrb_)[13][1-9a-km-uw-z]{59}$/);
var ACCOUNT_INFO_SUCCESS = z.object({
  frontier: HEX_64,
  open_block: HEX_64,
  representative_block: HEX_64,
  representative: NANO_ACCOUNT,
  balance: STRING_INT,
  modified_timestamp: STRING_INT,
  block_count: STRING_INT,
  account_version: STRING_INT.optional(),
  confirmation_height: STRING_INT,
  confirmation_height_frontier: HEX_64
});
var HELPER_CONFIG = z.object({
  NANO_RPC_URL: URL.optional(),
  NANO_WORK_GENERATION_URL: URL.optional(),
  NANO_ACCOUNT_PRIVATE_KEY: HEX_64.optional()
});
var PROCESS_BLOCK_SUCCESS = z.object({
  hash: HEX_64
});
var NANO_RPC_ERROR = z.object({
  error: z.string()
});
var NANO_SEND_BLOCK = z.strictObject({
  type: z.literal("state"),
  account: NANO_ACCOUNT,
  previous: HEX_64,
  representative: NANO_ACCOUNT,
  balance: STRING_INT,
  link: HEX_64,
  link_as_account: NANO_ACCOUNT.optional(),
  work: z.string().regex(/^[0-9A-F]+$/i),
  signature: z.string().regex(/^[0-9A-F]{128}$/i)
});
var NANO_RPC_CALL_WORK_GENERATE_RESPONSE = z.object({
  work: NANO_WORK,
  difficulty: z.string(),
  multiplier: z.string(),
  hash: HEX_64
});
var EXACT_NANO_PAYLOAD = z.object({
  block: NANO_SEND_BLOCK
});
var ASSET_AMOUNT = z.object({
  asset: z.string(),
  amount: z.string(),
  extra: z.object().optional()
});
var WORK_GENERATOR = z.function({
  input: [z.string()],
  output: z.string()
});

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
      if (validate(STRING_DECIMAL, amount_)) {
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
    if (typeof price === "object" && validate(ASSET_AMOUNT, price)) {
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
    if (!validate(STRING_DECIMAL, price_to_string)) {
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