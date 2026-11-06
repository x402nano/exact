"use strict";
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

// src/typescript/schemas.ts
var z = __toESM(require("zod"));
var import_types2 = require("nano-sdk/types");
var import_blocks = require("nano-sdk/blocks");

// src/typescript/constants.ts
var ERROR_CONFIG = "error_config";
var ERROR_PRICE = "error_price";
var ERROR_RAW_AMOUNT = "error_raw_amount";
var ERROR_TEXT_RPCURL_NOT_FOUND = `${ERROR_CONFIG} - 'rpcUrl' not specified`;
var CURRENCY_CODE_XNO = "XNO";

// src/typescript/utils.ts
var import_bignumber = __toESM(require("bignumber.js"));
var import_math = require("nano-sdk/math");
var import_crypto = require("nano-sdk/crypto");
var import_types = require("nano-sdk/types");
function priceRawUnits(amount, extra = {}) {
  const stringAmount = parseAmountToString(amount);
  if (stringAmount.includes(".")) {
    throw new Error(
      `${ERROR_PRICE} - Nano unit amount passed to 'priceRawUnits'. Please provide raw units.`
    );
  }
  return {
    asset: CURRENCY_CODE_XNO,
    amount: parseAmountToString(amount),
    extra
  };
}
function parseAmountToString(amount) {
  if (typeof amount === "string") {
    const amount_ = amount.trim();
    try {
      if (STRING_DECIMAL.safeParse(amount_).success) {
        return amount_;
      }
      return (0, import_bignumber.default)(amount_).toFixed();
    } catch (error) {
      void error;
      return amount_;
    }
  }
  if (typeof amount === "number") {
    return (0, import_bignumber.default)(amount).toFixed();
  }
  return String(amount);
}
function isRawUnits(amount) {
  return (0, import_types.RawAmountString)().safeParse(amount).success;
}
function isNanoUnits(amount) {
  return (0, import_types.NanoAmountString)().safeParse(amount).success;
}
function convertNanoToRaw(amount) {
  return (0, import_math.nanoToRaw)({ nano: amount });
}

// src/typescript/schemas.ts
var STRING_INT = z.string().regex(/^\d+$/);
var STRING_DECIMAL = z.string().regex(/^\d*\.\d+$/);
var URL = z.url();
var HEADERS = z.record(z.string(), z.string()).default({});
var WORK_GENERATOR = z.function({
  input: [
    z.object({
      block: z.lazy(() => (0, import_blocks.StateBlock)()),
      network: z.templateLiteral([z.string(), z.literal(`:`), z.string()]).optional()
    })
  ],
  output: z.promise(z.lazy(() => (0, import_types2.WorkString)()))
});
var ACCOUNT_INFO_SUCCESS = z.object({
  frontier: (0, import_types2.HashString)(),
  open_block: (0, import_types2.HashString)(),
  representative_block: (0, import_types2.HashString)(),
  representative: (0, import_types2.AccountString)(),
  balance: (0, import_types2.RawAmountString)(),
  modified_timestamp: import_types2.Timestamp,
  block_count: STRING_INT,
  account_version: STRING_INT,
  confirmed_balance: (0, import_types2.RawAmountString)(),
  confirmed_height: STRING_INT,
  confirmed_frontier: (0, import_types2.HashString)(),
  confirmed_representative: (0, import_types2.AccountString)()
});
var BLOCK_INFO_SUCCESS = z.object({
  block_account: (0, import_types2.AccountString)(),
  amount: (0, import_types2.RawAmountString)(),
  balance: (0, import_types2.RawAmountString)(),
  height: STRING_INT,
  local_timestamp: STRING_INT,
  successor: (0, import_types2.HashString)(),
  confirmed: z.union([z.literal("true"), z.literal("false")]),
  contents: (0, import_blocks.StateBlock)(),
  subtype: (0, import_types2.SubtypeString)()
});
var BASE_CONFIG = {
  workGenerator: WORK_GENERATOR.optional()
};
var RPC_CONFIG = {
  rpcUrl: URL,
  rpcApiKey: z.string().optional()
};
var WORK_GENERATION_CONFIG = {
  workGenerationUrl: URL.optional(),
  workGenerationApiKey: z.string().optional()
};
var CLIENT_SIGNER_CONFIG = z.object({
  accountPrivateKey: (0, import_types2.PrivateKeyString)(),
  ...RPC_CONFIG,
  ...WORK_GENERATION_CONFIG,
  ...BASE_CONFIG
}).strict();
var RESOURCE_SERVER_SIGNER_CONFIG = z.object({ ...WORK_GENERATION_CONFIG, ...BASE_CONFIG }).strict();
var FACILITATOR_SIGNER_CONFIG = z.object({
  ...RPC_CONFIG,
  ...WORK_GENERATION_CONFIG,
  ...BASE_CONFIG
}).strict();
var HELPER_CONFIG_DEPRECATED = z.object({
  NANO_RPC_URL: URL.optional(),
  NANO_WORK_GENERATION_URL: URL.optional(),
  NANO_ACCOUNT_PRIVATE_KEY: (0, import_types2.HashString)().optional()
});
var PROCESS_BLOCK_SUCCESS = z.object({
  hash: (0, import_types2.HashString)()
});
var NANO_RPC_ERROR = z.object({
  error: z.string()
});
var NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE = z.object({
  work: (0, import_types2.WorkString)(),
  difficulty: (0, import_types2.WorkDifficultyString)(),
  multiplier: z.string(),
  hash: (0, import_types2.HashString)()
});
var EXACT_NANO_PAYLOAD = z.object({
  block: (0, import_blocks.StateBlock)()
});
var ASSET_AMOUNT = z.object({
  asset: z.literal(CURRENCY_CODE_XNO),
  amount: (0, import_types2.RawAmountString)(),
  extra: z.object().optional()
}).strict().refine(
  (data) => {
    const rawAmount = isRawUnits(data.amount) ? data.amount : convertNanoToRaw(data.amount);
    return (0, import_types2.RawAmountString)().safeParse(rawAmount).success;
  },
  {
    message: ERROR_RAW_AMOUNT,
    path: ["amount"]
    // Pinpoints the error to the amount field
  }
).transform((data) => {
  return {
    ...data,
    amount: isRawUnits(data.amount) ? data.amount : convertNanoToRaw(data.amount)
  };
});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExactNanoScheme
});
//# sourceMappingURL=index.js.map