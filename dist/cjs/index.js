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

// src/typescript/index.ts
var typescript_exports = {};
__export(typescript_exports, {
  CLIENT_NO_WORK: () => CLIENT_NO_WORK,
  CURRENCY_CODE_XNO: () => CURRENCY_CODE_XNO,
  DEFAULT_MAX_TIMEOUT_SECONDS: () => DEFAULT_MAX_TIMEOUT_SECONDS,
  DEPRECATION_NOTICE: () => DEPRECATION_NOTICE,
  ERROR_ACCOUNT_NOT_FOUND: () => ERROR_ACCOUNT_NOT_FOUND,
  ERROR_AMOUNT_MISMATCH: () => ERROR_AMOUNT_MISMATCH,
  ERROR_BLOCK_ALREADY_CONFIRMED: () => ERROR_BLOCK_ALREADY_CONFIRMED,
  ERROR_BLOCK_AMOUNT_MISMATCH: () => ERROR_BLOCK_AMOUNT_MISMATCH,
  ERROR_BLOCK_AWAITING_CONFIRMATION: () => ERROR_BLOCK_AWAITING_CONFIRMATION,
  ERROR_BLOCK_GENERATION: () => ERROR_BLOCK_GENERATION,
  ERROR_BLOCK_NOT_BROADCAST: () => ERROR_BLOCK_NOT_BROADCAST,
  ERROR_CONFIG: () => ERROR_CONFIG,
  ERROR_CONFIG_INVALID_RPC_URL: () => ERROR_CONFIG_INVALID_RPC_URL,
  ERROR_CONFIG_TEXT_INVALID_CONFIG: () => ERROR_CONFIG_TEXT_INVALID_CONFIG,
  ERROR_CONFIG_TEXT_RPC_URL_NOT_SET: () => ERROR_CONFIG_TEXT_RPC_URL_NOT_SET,
  ERROR_FACILITATOR: () => ERROR_FACILITATOR,
  ERROR_FRONTIER_NOT_CONFIRMED: () => ERROR_FRONTIER_NOT_CONFIRMED,
  ERROR_INVALID_ASSET: () => ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK: () => ERROR_INVALID_BLOCK,
  ERROR_INVALID_WORK: () => ERROR_INVALID_WORK,
  ERROR_NANO_RPC: () => ERROR_NANO_RPC,
  ERROR_NANO_WORK_GENERATION: () => ERROR_NANO_WORK_GENERATION,
  ERROR_NETWORK_MISMATCH: () => ERROR_NETWORK_MISMATCH,
  ERROR_NOT_ENOUGH_BALANCE: () => ERROR_NOT_ENOUGH_BALANCE,
  ERROR_NO_ACCOUNT_FRONTIER: () => ERROR_NO_ACCOUNT_FRONTIER,
  ERROR_PAYTO_LINK_MISMATCH: () => ERROR_PAYTO_LINK_MISMATCH,
  ERROR_PREVIOUS_NOT_FRONTIER: () => ERROR_PREVIOUS_NOT_FRONTIER,
  ERROR_PRICE: () => ERROR_PRICE,
  ERROR_RAW_AMOUNT: () => ERROR_RAW_AMOUNT,
  ERROR_SIGNER: () => ERROR_SIGNER,
  ERROR_TIMEOUT_EXPIRED: () => ERROR_TIMEOUT_EXPIRED,
  ERROR_UNSUPPORTED_NETWORK: () => ERROR_UNSUPPORTED_NETWORK,
  ERROR_UNSUPPORTED_SCHEME: () => ERROR_UNSUPPORTED_SCHEME,
  ERROR_UNSUPPORTED_X402_VERSION: () => ERROR_UNSUPPORTED_X402_VERSION,
  ERROR_WORK_UNAVAILABLE: () => ERROR_WORK_UNAVAILABLE,
  ExactNanoClientScheme: () => ExactNanoScheme,
  ExactNanoFacilitatorScheme: () => ExactNanoScheme3,
  ExactNanoScheme: () => ExactNanoScheme,
  ExactNanoServerScheme: () => ExactNanoScheme2,
  NANO_BETANET_CAIP2: () => NANO_BETANET_CAIP2,
  NANO_MAINNET_CAIP2: () => NANO_MAINNET_CAIP2,
  NANO_PREFIX: () => NANO_PREFIX,
  NANO_TESTNET_CAIP2: () => NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2: () => NANO_WILDCARD_CAIP2,
  ONE_SECOND: () => ONE_SECOND,
  SEND_BLOCK_WORK_THRESHOLD_BETANET: () => SEND_BLOCK_WORK_THRESHOLD_BETANET,
  SEND_BLOCK_WORK_THRESHOLD_MAINNET: () => SEND_BLOCK_WORK_THRESHOLD_MAINNET,
  SUPPORTED_NANO_NETWORKS: () => SUPPORTED_NANO_NETWORKS,
  XRB_PREFIX: () => XRB_PREFIX,
  createClientNanoSigner: () => createClientNanoSigner,
  createFacilitatorNanoSigner: () => createFacilitatorNanoSigner,
  createResourceServerNanoSigner: () => createResourceServerNanoSigner,
  deriveAccountFromPrivateKey: () => deriveAccountFromPrivateKey,
  fromHelperConfig: () => fromHelperConfig,
  priceNanoUnits: () => priceNanoUnits2,
  priceRawUnits: () => priceRawUnits2
});
module.exports = __toCommonJS(typescript_exports);

// src/typescript/client/scheme.ts
var ExactNanoScheme = class {
  /**
   * Creates a new ExactNanoClient instance.
   *
   * @param signer - The Signer instance used for generating send blocks and communicating with Nano RPC
   */
  constructor(signer) {
    __publicField(this, "signer", signer);
    /**
     * The payment scheme identifier.
     */
    __publicField(this, "scheme", "exact");
  }
  /**
   * Creates a payment payload for the Exact scheme with the specified requirements.
   *
   * @param x402Version - The version of the x402 protocol to use
   * @param paymentRequirements - The payment details including payTo recipient and amount
   * @returns A promise that resolves to a payment payload containing the protocol version and transaction payload data
   * @throws Error if generating the send block fails
   *
   * @example
   * ```ts
   * const payload = await client.createPaymentPayload(2, {
   *   payTo: 'nano_...',
   *   amount: '1000000000000000000000000'
   * })
   * ```
   */
  async createPaymentPayload(x402Version, paymentRequirements) {
    let skipWorkGeneration = false;
    if (!paymentRequirements.payTo?.trim()) {
      throw new Error("Missing required payment field: payTo");
    }
    if (!paymentRequirements.amount?.trim()) {
      throw new Error("Missing required payment field: amount");
    }
    if (paymentRequirements?.extra.workOptional === true && !this.signer.getConfig().workGenerator && !this.signer.getConfig().workGenerationUrl) {
      skipWorkGeneration = true;
    }
    let sendBlock;
    try {
      sendBlock = await this.signer.generateSendBlock({
        payTo: paymentRequirements.payTo,
        amount: paymentRequirements.amount,
        network: paymentRequirements.network,
        skipWorkGeneration
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to generate Nano send block for Client. Cause: ${error.message.includes("Resulting raw amount must not be negative") ? "Not enough balance" : error.message}`
        );
      }
      throw new Error(`Failed to generate Nano send block for Client`);
    }
    const payload = { block: sendBlock };
    return {
      x402Version,
      payload
    };
  }
};

// src/typescript/schemas.ts
var z = __toESM(require("zod"));
var import_types2 = require("nano-sdk/types");
var import_blocks = require("nano-sdk/blocks");

// src/typescript/constants.ts
var NANO_MAINNET_CAIP2 = "nano:mainnet";
var NANO_BETANET_CAIP2 = "nano:betanet";
var NANO_TESTNET_CAIP2 = "nano:testnet";
var NANO_WILDCARD_CAIP2 = "nano:*";
var SEND_BLOCK_WORK_THRESHOLD_MAINNET = "fffffff800000000";
var SEND_BLOCK_WORK_THRESHOLD_BETANET = "fffff00000000000";
var SUPPORTED_NANO_NETWORKS = [
  NANO_MAINNET_CAIP2,
  NANO_BETANET_CAIP2,
  NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2
];
var ERROR_SIGNER = "error_signer";
var ERROR_CONFIG = "error_config";
var ERROR_BLOCK_GENERATION = "error_block_generation";
var ERROR_NANO_WORK_GENERATION = "error_nano_work_generation";
var ERROR_NANO_RPC = "error_nano_rpc";
var ERROR_PRICE = "error_price";
var ERROR_RAW_AMOUNT = "error_raw_amount";
var ERROR_UNSUPPORTED_X402_VERSION = "error_x402_version_not_supported";
var ERROR_UNSUPPORTED_NETWORK = "error_unsupported_network";
var ERROR_NETWORK_MISMATCH = "error_network_mismatch";
var ERROR_UNSUPPORTED_SCHEME = "error_unsupported_scheme";
var ERROR_INVALID_ASSET = "error_invalid_asset";
var ERROR_INVALID_BLOCK = "error_invalid_block";
var ERROR_PAYTO_LINK_MISMATCH = "error_payto_link_mismatch";
var ERROR_NO_ACCOUNT_FRONTIER = "error_no_account_frontier";
var ERROR_PREVIOUS_NOT_FRONTIER = "error_previous_not_frontier";
var ERROR_FRONTIER_NOT_CONFIRMED = "error_frontier_not_confirmed";
var ERROR_NOT_ENOUGH_BALANCE = "error_not_enough_balance";
var ERROR_AMOUNT_MISMATCH = "error_amount_mismatch";
var ERROR_BLOCK_AMOUNT_MISMATCH = "error_block_amount_mismatch";
var ERROR_INVALID_WORK = "error_invalid_work";
var ERROR_TIMEOUT_EXPIRED = "error_timeout_expired";
var ERROR_ACCOUNT_NOT_FOUND = "error_account_not_found";
var ERROR_BLOCK_ALREADY_CONFIRMED = "error_block_already_confirmed";
var ERROR_BLOCK_AWAITING_CONFIRMATION = "error_block_awaiting_confirmation";
var ERROR_BLOCK_NOT_BROADCAST = "error_block_not_broadcast";
var ERROR_WORK_UNAVAILABLE = "error_work_unavailable";
var ERROR_FACILITATOR = "error_facilitator";
var ERROR_CONFIG_INVALID_RPC_URL = `error_config_invalid_rpc_url`;
var ERROR_CONFIG_TEXT_RPC_URL_NOT_SET = `Config value "rpcUrl" not set`;
var ERROR_CONFIG_TEXT_INVALID_CONFIG = `Invalid config passed to Signer`;
var DEPRECATION_NOTICE = "DEPRECATION";
var CURRENCY_CODE_XNO = "XNO";
var NANO_PREFIX = "nano_";
var XRB_PREFIX = "xrb_";
var CLIENT_NO_WORK = "0000000000000000";
var DEFAULT_MAX_TIMEOUT_SECONDS = 60;
var ONE_SECOND = 1e3;

// src/typescript/utils.ts
var import_bignumber = __toESM(require("bignumber.js"));
var import_math = require("nano-sdk/math");
var import_crypto = require("nano-sdk/crypto");
var import_types = require("nano-sdk/types");
function ensureNanoPrefix(nanoAccount) {
  return nanoAccount.replace(XRB_PREFIX, NANO_PREFIX);
}
function priceNanoUnits(amount, extra = {}) {
  let stringAmount = parseAmountToString(amount);
  if (stringAmount.startsWith(".")) {
    stringAmount = "0" + stringAmount;
  }
  return {
    asset: CURRENCY_CODE_XNO,
    amount: (0, import_math.nanoToRaw)({ nano: stringAmount }),
    extra
  };
}
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
function validateNanoRpcUrl(rpcUrl, bypassNullCheck = false) {
  if (!bypassNullCheck) {
    if (!rpcUrl) {
      throw new Error(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_RPC_URL_NOT_SET}`);
    }
    if (!URL.safeParse(rpcUrl).success) {
      throw new Error(ERROR_CONFIG_INVALID_RPC_URL);
    }
  }
  return true;
}
function validateNanoWorkGenerationUrl(workGenerationUrl, bypassNullCheck = false) {
  if (!bypassNullCheck) {
    if (!URL.safeParse(workGenerationUrl).success) {
      throw new Error(`${ERROR_CONFIG} - 'workGenerationUrl' is not a valid URL`);
    }
  }
  return true;
}
function validateNanoAccountPrivateKey(accountPrivateKey, bypassNullCheck = false) {
  if (!bypassNullCheck) {
    if (!accountPrivateKey) {
      throw new Error(`${ERROR_CONFIG} - accountPrivateKey is not set`);
    }
    if (!(0, import_types.PrivateKeyString)().safeParse(accountPrivateKey).success) {
      throw new Error(
        `${ERROR_CONFIG} - accountPrivateKey is not of a valid format (should be 64 hexadecimal characters)`
      );
    }
  }
  return true;
}
function validateCustomWorkGenerator(workGenerator) {
  if (!WORK_GENERATOR.safeParse(workGenerator).success) {
    throw new Error(
      `${ERROR_NANO_WORK_GENERATION} - Custom work generation function is not valid.`
    );
  }
  return true;
}
function deriveAccountFromPrivateKey(privateKey) {
  return (0, import_crypto.deriveAccountFromPrivateKey)({ privateKey });
}
function fromHelperConfig(helperConfig) {
  let config = {};
  if (helperConfig.NANO_ACCOUNT_PRIVATE_KEY) {
    config.accountPrivateKey = helperConfig.NANO_ACCOUNT_PRIVATE_KEY;
  }
  if (helperConfig.NANO_RPC_URL) {
    config.rpcUrl = helperConfig.NANO_RPC_URL;
  }
  if (helperConfig.NANO_WORK_GENERATION_URL) {
    config.workGenerationUrl = helperConfig.NANO_WORK_GENERATION_URL;
  }
  return config;
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
var ExactNanoScheme2 = class {
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

// src/typescript/facilitator/scheme.ts
var import_bignumber2 = __toESM(require("bignumber.js"));
var import_crypto2 = require("nano-sdk/crypto");
var import_blocks2 = require("nano-sdk/blocks");
var SUPPORTED_X402_VERSIONS = [2];
var NANO_NETWORK_PREFIX = "nano:";
function constructVerifyInvalidResponse(payer) {
  return function(invalidReason) {
    return {
      isValid: false,
      invalidReason,
      payer
    };
  };
}
function constructSettleUnsuccessfulResponse(network, payer) {
  return function(errorReason, blockHash = "") {
    return {
      success: false,
      network,
      transaction: blockHash,
      errorReason,
      payer
    };
  };
}
function hashBlock(block) {
  return (0, import_crypto2.hashBlock)({
    block: {
      account: block.account,
      previous: block.previous,
      representative: block.representative,
      balance: block.balance,
      link: block.link
    }
  });
}
function verifyBlock(block) {
  try {
    let publicKey = (0, import_crypto2.derivePublicKeyFromAccount)({
      account: block.account
    });
    let isBlockVerified = (0, import_crypto2.verifyBlock)({
      block,
      publicKey
    });
    return isBlockVerified;
  } catch (error) {
    void error;
    return false;
  }
}
function shouldGenerateWork({
  signer,
  clientWork
}) {
  const { workGenerator, workGenerationUrl } = signer.getConfig();
  return (workGenerator || workGenerationUrl) && clientWork === CLIENT_NO_WORK;
}
var sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
var ExactNanoScheme3 = class {
  /**
   * Creates a new ExactNanoScheme instance.
   *
   * @param signer - The Signer instance used for generating send blocks and communicating with Nano RPC
   */
  constructor(signer) {
    __publicField(this, "signer", signer);
    /**
     * The payment scheme identifier.
     */
    __publicField(this, "scheme", "exact");
    /**
     * CAIP-2 identifier for the Nano network family e.g. nano:mainnet, nano:betanet
     */
    __publicField(this, "caipFamily", "nano:*");
  }
  /**
   * Gets additional scheme-specific metadata (none for this implementation).
   *
   * @param network - Current network
   * @returns undefined as no extra metadata is provided
   */
  getExtra(network) {
    void network;
    if (this.signer.getConfig().workGenerator || this.signer.getConfig().workGenerationUrl) {
      return {
        workOptional: true
      };
    }
    return void 0;
  }
  /**
   * Gets the list of signers required for this scheme (none for this implementation).
   *
   * @returns Empty array as no additional signers are needed
   */
  getSigners() {
    return [];
  }
  /**
   * Verifies a payment payload.
   *
   * @param payload - The payment payload to verify
   * @param requirements - The payment requirements
   * @returns Promise resolving to verification response
   */
  async verify(payload, requirements) {
    return await this._verify(payload, requirements);
  }
  /**
   * Settles a verified payment by processing the transaction on the Nano network.
   *
   * Submits the payment block to the network and returns the transaction result.
   *
   * @param payload - The payment payload to settle
   * @param requirements - The payment requirements
   * @returns Promise resolving to a settlement response containing transaction hash or error
   *
   * @example
   * ```ts
   * const result = await facilitator.settle(paymentPayload, paymentRequirements)
   * if (result.success) {
   *   console.log('Payment settled with hash:', result.transaction)
   * }
   * ```
   */
  async settle(payload, requirements) {
    const exactNanoPayload = payload.payload;
    const constructSettleUnsuccessfulResponse_ = constructSettleUnsuccessfulResponse(
      payload?.accepted?.network,
      exactNanoPayload?.block?.account
    );
    if (shouldGenerateWork({ signer: this.signer, clientWork: exactNanoPayload.block.work })) {
      try {
        exactNanoPayload.block.work = await this.signer.generateWork({
          block: exactNanoPayload.block,
          network: requirements.network
        });
      } catch (error) {
        void error;
        return constructSettleUnsuccessfulResponse_(ERROR_WORK_UNAVAILABLE);
      }
    }
    const { isValid, invalidReason = "" } = await this._verify(payload, requirements);
    if (!isValid) {
      if (invalidReason === ERROR_BLOCK_ALREADY_CONFIRMED || invalidReason === ERROR_BLOCK_AWAITING_CONFIRMATION) {
        const blockHash = hashBlock(exactNanoPayload.block);
        return constructSettleUnsuccessfulResponse_(invalidReason, blockHash);
      }
      return constructSettleUnsuccessfulResponse_(invalidReason || ERROR_FACILITATOR);
    }
    try {
      if ("getBlockInfo" in this.signer) {
        const blockHash = hashBlock(exactNanoPayload.block);
        try {
          const getBlockInfoResponse = await this.signer.getBlockInfo({
            hash: blockHash
          });
          if (getBlockInfoResponse.confirmed === "true") {
            return constructSettleUnsuccessfulResponse_(ERROR_BLOCK_ALREADY_CONFIRMED, blockHash);
          } else if (getBlockInfoResponse.confirmed === "false") {
            return constructSettleUnsuccessfulResponse_(
              ERROR_BLOCK_AWAITING_CONFIRMATION,
              blockHash
            );
          }
        } catch (error) {
          void error;
          return constructSettleUnsuccessfulResponse_(ERROR_NANO_RPC);
        }
      }
      let getProcessBlockResponse;
      try {
        getProcessBlockResponse = await this.signer.processBlock({
          block: exactNanoPayload.block
        });
      } catch (error) {
        void error;
        return constructSettleUnsuccessfulResponse_(ERROR_NANO_RPC);
      }
      let hash;
      if ("hash" in getProcessBlockResponse) {
        hash = getProcessBlockResponse.hash;
      }
      if ("error" in getProcessBlockResponse || !hash) {
        return constructSettleUnsuccessfulResponse_(ERROR_BLOCK_NOT_BROADCAST);
      }
      if (!this.signer.getBlockInfo) {
        const successResponse = {
          success: true,
          transaction: hash,
          network: payload.accepted.network,
          payer: exactNanoPayload.block.account
        };
        return successResponse;
      }
      await sleep(ONE_SECOND * 0.5);
      let elapsedSeconds = 0;
      while (elapsedSeconds < (requirements.maxTimeoutSeconds || DEFAULT_MAX_TIMEOUT_SECONDS)) {
        elapsedSeconds++;
        let getBlockInfoResponse;
        try {
          getBlockInfoResponse = await this.signer.getBlockInfo({
            hash
          });
        } catch (error) {
          void error;
          return constructSettleUnsuccessfulResponse_(ERROR_NANO_RPC);
        }
        if ("confirmed" in getBlockInfoResponse && getBlockInfoResponse.confirmed === "true") {
          const successResponse = {
            success: true,
            transaction: hash,
            network: payload.accepted.network,
            payer: exactNanoPayload.block.account
          };
          return successResponse;
        }
        await sleep(ONE_SECOND);
      }
      return constructSettleUnsuccessfulResponse_(ERROR_TIMEOUT_EXPIRED);
    } catch (error) {
      void error;
      return constructSettleUnsuccessfulResponse_(ERROR_FACILITATOR);
    }
  }
  /**
   * Verifies a payment payload for validity against the specified payment requirements.
   *
   * Performs multiple verification checks:
   * 1. x402 Version Check
   * 2. Scheme Check
   * 3. Network Supported Check
   * 4. Network Mismatch Check
   * 5. Asset Check
   * 6. Amount Check
   * 7. Block Structure Check
   * 8. Valid Block Check
   * 9. payTo Check
   * 10. Previous Confirmation Check
   * 11. Account Check
   * 12. Frontier Hash Check
   * 13. Balance Check
   * 14. Work Difficulty Check
   * (Documentation for all checks can be found in the Verification section of the x402 exact scheme for Nano)
   *
   * @param payload - The payment payload to verify
   * @param requirements - The expected payment requirements
   * @returns Promise resolving to a verification response
   *
   * @example
   * ```ts
   * const result = await facilitator.verify(paymentPayload, paymentRequirements)
   * if (result.isValid) {
   *   console.log('Payment verified successfully')
   * }
   * ```
   */
  async _verify(payload, requirements) {
    const exactNanoPayload = payload.payload;
    const constructVerifyInvalidResponse_ = constructVerifyInvalidResponse(
      exactNanoPayload?.block?.account
    );
    try {
      if (!SUPPORTED_X402_VERSIONS.includes(payload.x402Version)) {
        return constructVerifyInvalidResponse_(ERROR_UNSUPPORTED_X402_VERSION);
      }
      if (requirements.scheme !== this.scheme || payload.accepted.scheme !== this.scheme) {
        return constructVerifyInvalidResponse_(ERROR_UNSUPPORTED_SCHEME);
      }
      if (!requirements.network.startsWith(NANO_NETWORK_PREFIX) || !payload.accepted.network.startsWith(NANO_NETWORK_PREFIX)) {
        return constructVerifyInvalidResponse_(ERROR_UNSUPPORTED_NETWORK);
      }
      if (requirements.network !== payload.accepted.network) {
        return constructVerifyInvalidResponse_(ERROR_NETWORK_MISMATCH);
      }
      if (requirements.asset !== CURRENCY_CODE_XNO || payload.accepted?.asset !== CURRENCY_CODE_XNO) {
        return constructVerifyInvalidResponse_(ERROR_INVALID_ASSET);
      }
      if (payload.accepted.amount !== requirements.amount) {
        return constructVerifyInvalidResponse_(ERROR_AMOUNT_MISMATCH);
      }
      if (!(0, import_blocks2.StateBlock)().safeParse(exactNanoPayload.block).success) {
        return constructVerifyInvalidResponse_(ERROR_INVALID_BLOCK);
      }
      const payer = exactNanoPayload.block.account;
      if (!verifyBlock(exactNanoPayload.block)) {
        return constructVerifyInvalidResponse_(ERROR_INVALID_BLOCK);
      }
      if (!(ensureNanoPrefix(requirements.payTo) === ensureNanoPrefix(payload.accepted.payTo) && ensureNanoPrefix(payload.accepted.payTo) === ensureNanoPrefix(exactNanoPayload.block.link_as_account) && (0, import_crypto2.deriveAccountFromLink)({ link: exactNanoPayload.block.link }) === exactNanoPayload.block.link_as_account)) {
        return constructVerifyInvalidResponse_(ERROR_PAYTO_LINK_MISMATCH);
      }
      if (this.signer.getBlockInfo) {
        const blockHash = hashBlock(exactNanoPayload.block);
        let getBlockInfoResponse;
        try {
          getBlockInfoResponse = await this.signer.getBlockInfo({
            hash: blockHash
          });
        } catch (error) {
          void error;
          return constructVerifyInvalidResponse_(ERROR_NANO_RPC);
        }
        if (getBlockInfoResponse.contents) {
          if (getBlockInfoResponse.subtype !== "send") {
            return constructVerifyInvalidResponse_(ERROR_INVALID_BLOCK);
          } else if (getBlockInfoResponse.amount !== payload.accepted.amount) {
            return constructVerifyInvalidResponse_(ERROR_BLOCK_AMOUNT_MISMATCH);
          } else if (getBlockInfoResponse.confirmed === "true") {
            return constructVerifyInvalidResponse_(ERROR_BLOCK_ALREADY_CONFIRMED);
          } else if (getBlockInfoResponse.confirmed === "false") {
            return constructVerifyInvalidResponse_(ERROR_BLOCK_AWAITING_CONFIRMATION);
          }
        }
      }
      let getAccountInfoResponse;
      try {
        getAccountInfoResponse = await this.signer.getAccountInfo({
          account: exactNanoPayload.block.account
        });
      } catch (error) {
        void error;
        return constructVerifyInvalidResponse_(ERROR_NANO_RPC);
      }
      if ("error" in getAccountInfoResponse) {
        return constructVerifyInvalidResponse_(ERROR_ACCOUNT_NOT_FOUND);
      }
      let {
        frontier,
        confirmed_frontier,
        confirmed_balance: previousBalance
      } = getAccountInfoResponse;
      if (!frontier) {
        return constructVerifyInvalidResponse_(ERROR_NO_ACCOUNT_FRONTIER);
      }
      if (frontier !== exactNanoPayload.block.previous) {
        return constructVerifyInvalidResponse_(ERROR_PREVIOUS_NOT_FRONTIER);
      }
      if (frontier !== confirmed_frontier) {
        return constructVerifyInvalidResponse_(ERROR_FRONTIER_NOT_CONFIRMED);
      }
      if ((0, import_bignumber2.default)(previousBalance).minus(payload.accepted.amount).isNegative()) {
        return constructVerifyInvalidResponse_(ERROR_NOT_ENOUGH_BALANCE);
      }
      const balanceDelta = (0, import_bignumber2.default)(previousBalance).minus(exactNanoPayload.block.balance);
      if (!balanceDelta.isEqualTo(payload.accepted.amount)) {
        return constructVerifyInvalidResponse_(ERROR_BLOCK_AMOUNT_MISMATCH);
      }
      if (!shouldGenerateWork({ signer: this.signer, clientWork: exactNanoPayload.block.work })) {
        let workThreshold;
        if (requirements.network === NANO_BETANET_CAIP2 || requirements.network === NANO_TESTNET_CAIP2) {
          workThreshold = SEND_BLOCK_WORK_THRESHOLD_BETANET;
        } else {
          workThreshold = SEND_BLOCK_WORK_THRESHOLD_MAINNET;
        }
        try {
          let isWorkValid = (0, import_crypto2.verifyWork)({
            hash: frontier,
            work: exactNanoPayload.block.work,
            threshold: workThreshold
          });
          if (!isWorkValid) {
            throw new Error();
          }
        } catch (error) {
          void error;
          return constructVerifyInvalidResponse_(ERROR_INVALID_WORK);
        }
      }
      const facilitatorSuccess = {
        isValid: true,
        invalidReason: void 0,
        payer
      };
      return facilitatorSuccess;
    } catch (error) {
      void error;
      return constructVerifyInvalidResponse_(ERROR_FACILITATOR);
    }
  }
};

// src/typescript/signer.ts
var import_blocks3 = require("nano-sdk/blocks");
var import_crypto3 = require("nano-sdk/crypto");
var ONE_MINUTE = 60 * ONE_SECOND;
var SIGNER_TYPE_CLIENT = "SIGNER_TYPE_CLIENT";
var SIGNER_TYPE_RESOURCE_SERVER = "SIGNER_TYPE_RESOURCE_SERVER";
var SIGNER_TYPE_FACILITATOR = "SIGNER_TYPE_FACILITATOR";
async function nanoRpcCall({
  url: url2,
  headers,
  action,
  params,
  timeout = ONE_MINUTE,
  isGeneratingWork = false
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const CONTENT_TYPE_APPLICATION_JSON = { "Content-Type": "application/json" };
    const res = await fetch(url2, {
      method: "POST",
      headers: { ...headers, ...CONTENT_TYPE_APPLICATION_JSON },
      signal: controller.signal,
      body: JSON.stringify({ action, ...params })
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const json = await res.json();
    if (json.error && action !== "block_info") {
      throw new Error(json.error);
    }
    return json;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${isGeneratingWork ? ERROR_NANO_WORK_GENERATION : ERROR_NANO_RPC} - ${errorMessage}`
    );
  } finally {
    clearTimeout(timer);
  }
}
async function workGenerateInternal({
  config,
  block,
  network,
  workGenerator
}) {
  let workGenerateResponse;
  if (workGenerator) {
    try {
      let work;
      work = await workGenerator({ block, network });
      return work;
    } catch (error) {
      throw new Error(
        `${ERROR_NANO_WORK_GENERATION} - Error during custom work generation` + (error instanceof Error ? `. Cause: ${error.message}` : ``)
      );
    }
  } else {
    try {
      workGenerateResponse = await nanoRpcCall({
        url: config.workGenerationUrl,
        headers: config.workGenerationApiKey ? { Authorization: `Bearer ${config.workGenerationApiKey}` } : void 0,
        action: "work_generate",
        params: {
          hash: block.previous,
          block,
          json_block: true
        },
        timeout: 5 * ONE_MINUTE,
        isGeneratingWork: true
      });
      let isWorkValid = (0, import_crypto3.verifyWork)({
        hash: block.previous,
        work: workGenerateResponse.work,
        threshold: workGenerateResponse.difficulty
      });
      if (isWorkValid) {
        return workGenerateResponse.work;
      }
    } catch (error) {
      throw new Error(
        `${ERROR_NANO_WORK_GENERATION} - Error during work generation` + (error instanceof Error ? `. Cause: ${error.message}` : ``)
      );
    }
  }
  throw new Error(`${ERROR_NANO_WORK_GENERATION} - Generated work is not valid`);
}
function getAccount({ accountPrivateKey }) {
  if (!accountPrivateKey) {
    throw new Error(`${ERROR_CONFIG} - Config value "accountPrivateKey" not set`);
  }
  return (0, import_crypto3.deriveAccountFromPrivateKey)({ privateKey: accountPrivateKey });
}
function createClientNanoSigner(config) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_CLIENT
  });
}
function createResourceServerNanoSigner(config) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_RESOURCE_SERVER
  });
}
function createFacilitatorNanoSigner(config) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_FACILITATOR
  });
}
var Signer = class {
  // private workGenerator: WorkGenerator | undefined;
  /**
   * Creates a new Signer instance.
   *
   * @param params - Constructor parameters
   * @param params.config - Configuration object for the Signer
   * @param params.signerType - Type of Signer (Client or Facilitator)
   */
  constructor({
    config,
    signerType
  }) {
    /**
     * Configuration for the signer instance.
     */
    __publicField(this, "account");
    __publicField(this, "config", {});
    __publicField(this, "beforeWorkGenerationHooks", []);
    __publicField(this, "afterWorkGenerationHooks", []);
    if (signerType !== SIGNER_TYPE_CLIENT && signerType !== SIGNER_TYPE_RESOURCE_SERVER && signerType !== SIGNER_TYPE_FACILITATOR) {
      throw new Error(
        `${ERROR_SIGNER} - Use 'createClientNanoSigner', 'createResourceServerNanoSigner', or 'createFacilitatorNanoSigner' to create Nano signer`
      );
    }
    if (signerType === SIGNER_TYPE_CLIENT) {
      let clientSignerConfigParsed;
      clientSignerConfigParsed = CLIENT_SIGNER_CONFIG.safeParse(config);
      if (!clientSignerConfigParsed.success) {
        throw new Error(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_INVALID_CONFIG}`);
      }
      this.config = clientSignerConfigParsed.data;
      if ("accountPrivateKey" in this.config) {
        this.account = getAccount({ accountPrivateKey: this.config.accountPrivateKey });
      }
      return;
    }
    if (signerType === SIGNER_TYPE_RESOURCE_SERVER) {
      let resourceServerSignerConfigParsed;
      resourceServerSignerConfigParsed = RESOURCE_SERVER_SIGNER_CONFIG.safeParse(config);
      if (!resourceServerSignerConfigParsed.success) {
        throw new Error(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_INVALID_CONFIG}`);
      }
      this.config = resourceServerSignerConfigParsed.data;
      return;
    }
    if (signerType === SIGNER_TYPE_FACILITATOR) {
      let facilitatorSignerConfigParsed;
      facilitatorSignerConfigParsed = FACILITATOR_SIGNER_CONFIG.safeParse(config);
      if (!facilitatorSignerConfigParsed.success) {
        throw new Error(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_INVALID_CONFIG}`);
      }
      this.config = facilitatorSignerConfigParsed.data;
      return;
    }
  }
  /**
   * Retrieves account information from the Nano node.
   *
   * @param params - The configuration object
   * @param params.account - The account address to query
   * @returns Promise resolving to account info (frontier, balance, representative, etc.)
   * @throws Error if RPC URL is invalid or request fails
   */
  async getAccountInfo({ account }) {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);
      return await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config?.rpcApiKey ? { Authorization: `Bearer ${this.config.rpcApiKey}` } : void 0,
        action: "account_info",
        params: {
          account,
          include_confirmed: "true",
          representative: "true"
        }
      });
    }
    return Promise.reject(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_RPC_URL_NOT_SET}`);
  }
  /**
   * Retrieves block information from the Nano node.
   *
   * @param params - The configuration object
   * @param params.hash - Hash of the block to retrive information for
   * @returns Promise resolving to block info
   * @throws Error if RPC URL is invalid or request fails
   */
  async getBlockInfo({ hash }) {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);
      return await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config?.rpcApiKey ? { Authorization: `Bearer ${this.config?.rpcApiKey}` } : void 0,
        action: "block_info",
        params: {
          hash,
          json_block: "true"
        }
      });
    }
    return Promise.reject(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_RPC_URL_NOT_SET}`);
  }
  /**
   * Generates a signed Nano send block for a payment transaction.
   *
   * @param params - Parameters including amount and destination address (payTo)
   * @returns Promise resolving to the generated send block
   * @throws Error if configuration is invalid, account is unopened, or balance is insufficient
   */
  async generateSendBlock(params) {
    const clientSignerConfig = this.config;
    validateNanoAccountPrivateKey(clientSignerConfig.accountPrivateKey);
    validateNanoRpcUrl(clientSignerConfig.rpcUrl);
    if (!params.skipWorkGeneration && !clientSignerConfig.workGenerator) {
      validateNanoWorkGenerationUrl(clientSignerConfig.workGenerationUrl);
    }
    let sourceAccount;
    sourceAccount = getAccount({ accountPrivateKey: clientSignerConfig.accountPrivateKey });
    let sourceAccountInfo = await this.getAccountInfo({
      account: sourceAccount
    });
    let sourceAccountFrontierBlockInfo = await this.getBlockInfo({
      hash: sourceAccountInfo.frontier
    });
    if (!sourceAccountInfo.frontier) {
      throw new Error(
        `${ERROR_BLOCK_GENERATION} - Source account has no frontier (unopened account)`
      );
    }
    let block;
    block = (0, import_blocks3.createSendBlock)({
      amount: params.amount,
      destination: params.payTo,
      frontierBlock: sourceAccountFrontierBlockInfo.contents,
      privateKey: clientSignerConfig.accountPrivateKey,
      representative: sourceAccountFrontierBlockInfo.contents.representative
    });
    if (!params.skipWorkGeneration) {
      block.work = await this.generateWork({ block, network: params.network });
    }
    block.account = ensureNanoPrefix(block.account);
    block.link_as_account = ensureNanoPrefix(block.link_as_account);
    return block;
  }
  /**
   * Generates work for a signed Nano send block.
   *
   * @param params - Parameters object
   * @param params.block - The block to generate work for
   * @param params.network - The Nano network being used
   * @returns Promise resolving to the generated work
   * @throws Error if something goes wrong during work generation
   */
  async generateWork({ block, network }) {
    const context = {
      hash: block.previous
    };
    for (const beforeWorkGenerationHook of this.beforeWorkGenerationHooks) {
      await beforeWorkGenerationHook(context);
    }
    let work = await workGenerateInternal({
      config: this.config,
      block,
      network,
      workGenerator: this.config.workGenerator
    });
    for (const afterWorkGenerationHook of this.afterWorkGenerationHooks) {
      await afterWorkGenerationHook(Object.assign(context, { work }));
    }
    return work;
  }
  /**
   * Submits a block to the Nano network for processing.
   *
   * @param params - The configuration object
   * @param params.block - The block to process
   * @returns Promise resolving to the processing result containing transaction hash
   * @throws Error if RPC call fails
   */
  async processBlock({ block }) {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);
      return await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config.rpcApiKey ? { Authorization: `Bearer ${this.config.rpcApiKey}` } : void 0,
        action: "process",
        params: {
          json_block: "true",
          subtype: "send",
          block
        }
      });
    }
    return Promise.reject(`${ERROR_CONFIG} - ${ERROR_CONFIG_TEXT_RPC_URL_NOT_SET}`);
  }
  /**
   * Sets a custom work generator.
   *
   * @param workGenerator - Work generator function
   * @throws Error if the work generation function is not valid
   */
  setCustomWorkGenerator(workGenerator) {
    validateCustomWorkGenerator(workGenerator);
    this.config.workGenerator = workGenerator;
  }
  /**
   * Sets a hook that will be called before work generation takes place.
   *
   * @param hook - Hook function that will be called
   * @returns The current Signer class instance
   * @throws Error if the hook function itself throws an Error
   */
  onBeforeWorkGeneration(hook) {
    this.beforeWorkGenerationHooks.push(hook);
    return this;
  }
  /**
   * Sets a hook that will be called after work generation takes place.
   *
   * @param hook - Hook function that will be called
   * @returns The current Signer class instance
   * @throws Error if the hook function itself throws an Error
   */
  onAfterWorkGeneration(hook) {
    this.afterWorkGenerationHooks.push(hook);
    return this;
  }
  /**
   * Returns the current configuration values (without account private key for security purposes).
   *
   * @returns Current configuration values (without account private key)
   */
  getConfig() {
    let config_ = { ...this.config };
    if ("accountPrivateKey" in config_) {
      config_.accountPrivateKey = "";
    }
    return { ...config_, workGenerator: this.config.workGenerator };
  }
};
var priceRawUnits2 = priceRawUnits;
var priceNanoUnits2 = priceNanoUnits;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CLIENT_NO_WORK,
  CURRENCY_CODE_XNO,
  DEFAULT_MAX_TIMEOUT_SECONDS,
  DEPRECATION_NOTICE,
  ERROR_ACCOUNT_NOT_FOUND,
  ERROR_AMOUNT_MISMATCH,
  ERROR_BLOCK_ALREADY_CONFIRMED,
  ERROR_BLOCK_AMOUNT_MISMATCH,
  ERROR_BLOCK_AWAITING_CONFIRMATION,
  ERROR_BLOCK_GENERATION,
  ERROR_BLOCK_NOT_BROADCAST,
  ERROR_CONFIG,
  ERROR_CONFIG_INVALID_RPC_URL,
  ERROR_CONFIG_TEXT_INVALID_CONFIG,
  ERROR_CONFIG_TEXT_RPC_URL_NOT_SET,
  ERROR_FACILITATOR,
  ERROR_FRONTIER_NOT_CONFIRMED,
  ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK,
  ERROR_INVALID_WORK,
  ERROR_NANO_RPC,
  ERROR_NANO_WORK_GENERATION,
  ERROR_NETWORK_MISMATCH,
  ERROR_NOT_ENOUGH_BALANCE,
  ERROR_NO_ACCOUNT_FRONTIER,
  ERROR_PAYTO_LINK_MISMATCH,
  ERROR_PREVIOUS_NOT_FRONTIER,
  ERROR_PRICE,
  ERROR_RAW_AMOUNT,
  ERROR_SIGNER,
  ERROR_TIMEOUT_EXPIRED,
  ERROR_UNSUPPORTED_NETWORK,
  ERROR_UNSUPPORTED_SCHEME,
  ERROR_UNSUPPORTED_X402_VERSION,
  ERROR_WORK_UNAVAILABLE,
  ExactNanoClientScheme,
  ExactNanoFacilitatorScheme,
  ExactNanoScheme,
  ExactNanoServerScheme,
  NANO_BETANET_CAIP2,
  NANO_MAINNET_CAIP2,
  NANO_PREFIX,
  NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2,
  ONE_SECOND,
  SEND_BLOCK_WORK_THRESHOLD_BETANET,
  SEND_BLOCK_WORK_THRESHOLD_MAINNET,
  SUPPORTED_NANO_NETWORKS,
  XRB_PREFIX,
  createClientNanoSigner,
  createFacilitatorNanoSigner,
  createResourceServerNanoSigner,
  deriveAccountFromPrivateKey,
  fromHelperConfig,
  priceNanoUnits,
  priceRawUnits
});
//# sourceMappingURL=index.js.map