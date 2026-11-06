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
var ERROR_INVALID_WORK = "error_invalid_work";
var ERROR_TIMEOUT_EXPIRED = "error_timeout_expired";
var ERROR_ACCOUNT_NOT_FOUND = "error_account_not_found";
var ERROR_BLOCK_ALREADY_CONFIRMED = "error_block_already_confirmed";
var ERROR_BLOCK_AWAITING_CONFIRMATION = "error_block_awaiting_confirmation";
var ERROR_BLOCK_NOT_BROADCAST = "error_block_not_broadcast";
var ERROR_WORK_UNAVAILABLE = "error_work_unavailable";
var ERROR_FACILITATOR = "error_facilitator";
var ERROR_TEXT_RPCURL_NOT_FOUND = `${ERROR_CONFIG} - 'rpcUrl' not specified`;
var DEPRECATION_NOTICE = "DEPRECATION";
var CURRENCY_CODE_XNO = "XNO";
var NANO_PREFIX = "nano_";
var XRB_PREFIX = "xrb_";
var CLIENT_NO_WORK = "0000000000000000";
var DEFAULT_MAX_TIMEOUT_SECONDS = 60;
var ONE_SECOND = 1e3;

// src/typescript/utils.ts
import BigNumber from "bignumber.js";
import { nanoToRaw } from "nano-sdk/math";
import { deriveAccountFromPrivateKey as deriveAccountFromPrivateKey_ } from "nano-sdk/crypto";
import { RawAmountString as RawAmountString2, NanoAmountString, PrivateKeyString as PrivateKeyString2 } from "nano-sdk/types";

// src/typescript/schemas.ts
import * as z from "zod";
import {
  AccountString,
  HashString,
  PrivateKeyString,
  RawAmountString,
  SubtypeString,
  Timestamp,
  WorkDifficultyString,
  WorkString
} from "nano-sdk/types";
import { StateBlock } from "nano-sdk/blocks";
var STRING_INT = z.string().regex(/^\d+$/);
var STRING_DECIMAL = z.string().regex(/^\d*\.\d+$/);
var URL = z.url();
var HEADERS = z.record(z.string(), z.string()).default({});
var WORK_GENERATOR = z.function({
  input: [
    z.object({
      block: z.lazy(() => StateBlock()),
      network: z.templateLiteral([z.string(), z.literal(`:`), z.string()]).optional()
    })
  ],
  output: z.promise(z.lazy(() => WorkString()))
});
var ACCOUNT_INFO_SUCCESS = z.object({
  frontier: HashString(),
  open_block: HashString(),
  representative_block: HashString(),
  representative: AccountString(),
  balance: RawAmountString(),
  modified_timestamp: Timestamp,
  block_count: STRING_INT,
  account_version: STRING_INT,
  confirmed_balance: RawAmountString(),
  confirmed_height: STRING_INT,
  confirmed_frontier: HashString(),
  confirmed_representative: AccountString()
});
var BLOCK_INFO_SUCCESS = z.object({
  block_account: AccountString(),
  amount: RawAmountString(),
  balance: RawAmountString(),
  height: STRING_INT,
  local_timestamp: STRING_INT,
  successor: HashString(),
  confirmed: z.union([z.literal("true"), z.literal("false")]),
  contents: StateBlock(),
  subtype: SubtypeString()
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
  accountPrivateKey: PrivateKeyString(),
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
  NANO_ACCOUNT_PRIVATE_KEY: HashString().optional()
});
var PROCESS_BLOCK_SUCCESS = z.object({
  hash: HashString()
});
var NANO_RPC_ERROR = z.object({
  error: z.string()
});
var NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE = z.object({
  work: WorkString(),
  difficulty: WorkDifficultyString(),
  multiplier: z.string(),
  hash: HashString()
});
var EXACT_NANO_PAYLOAD = z.object({
  block: StateBlock()
});
var ASSET_AMOUNT = z.object({
  asset: z.literal(CURRENCY_CODE_XNO),
  amount: RawAmountString(),
  extra: z.object().optional()
}).strict().refine(
  (data) => {
    const rawAmount = isRawUnits(data.amount) ? data.amount : convertNanoToRaw(data.amount);
    return RawAmountString().safeParse(rawAmount).success;
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

// src/typescript/utils.ts
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
    amount: nanoToRaw({ nano: stringAmount }),
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
function isRawUnits(amount) {
  return RawAmountString2().safeParse(amount).success;
}
function isNanoUnits(amount) {
  return NanoAmountString().safeParse(amount).success;
}
function convertNanoToRaw(amount) {
  return nanoToRaw({ nano: amount });
}
function validateNanoRpcUrl(rpcUrl, bypassNullCheck = false) {
  if (!bypassNullCheck) {
    if (!rpcUrl) {
      throw new Error(`${ERROR_CONFIG} - Configuration missing: 'rpcUrl'`);
    }
    if (!URL.safeParse(rpcUrl).success) {
      throw new Error(ERROR_TEXT_RPCURL_NOT_FOUND);
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
    if (!PrivateKeyString2().safeParse(accountPrivateKey).success) {
      throw new Error(
        `${ERROR_CONFIG} - accountPrivateKey is not of a valid format (should be 64 hexadecimal characters)`
      );
    }
  }
  return true;
}
function validateCustomWorkGenerator(workGenerator) {
  if (!WORK_GENERATOR.safeParse(workGenerator).success) {
    throw new Error(`${ERROR_NANO_WORK_GENERATION} - Custom work generator is not valid`);
  }
  return true;
}
function deriveAccountFromPrivateKey(privateKey) {
  return deriveAccountFromPrivateKey_({ privateKey });
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

export {
  NANO_MAINNET_CAIP2,
  NANO_BETANET_CAIP2,
  NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2,
  SEND_BLOCK_WORK_THRESHOLD_MAINNET,
  SEND_BLOCK_WORK_THRESHOLD_BETANET,
  SUPPORTED_NANO_NETWORKS,
  ERROR_SIGNER,
  ERROR_CONFIG,
  ERROR_BLOCK_GENERATION,
  ERROR_NANO_WORK_GENERATION,
  ERROR_NANO_RPC,
  ERROR_PRICE,
  ERROR_RAW_AMOUNT,
  ERROR_UNSUPPORTED_X402_VERSION,
  ERROR_UNSUPPORTED_NETWORK,
  ERROR_NETWORK_MISMATCH,
  ERROR_UNSUPPORTED_SCHEME,
  ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK,
  ERROR_PAYTO_LINK_MISMATCH,
  ERROR_NO_ACCOUNT_FRONTIER,
  ERROR_PREVIOUS_NOT_FRONTIER,
  ERROR_FRONTIER_NOT_CONFIRMED,
  ERROR_NOT_ENOUGH_BALANCE,
  ERROR_AMOUNT_MISMATCH,
  ERROR_INVALID_WORK,
  ERROR_TIMEOUT_EXPIRED,
  ERROR_ACCOUNT_NOT_FOUND,
  ERROR_BLOCK_ALREADY_CONFIRMED,
  ERROR_BLOCK_AWAITING_CONFIRMATION,
  ERROR_BLOCK_NOT_BROADCAST,
  ERROR_WORK_UNAVAILABLE,
  ERROR_FACILITATOR,
  ERROR_TEXT_RPCURL_NOT_FOUND,
  DEPRECATION_NOTICE,
  CURRENCY_CODE_XNO,
  NANO_PREFIX,
  XRB_PREFIX,
  CLIENT_NO_WORK,
  DEFAULT_MAX_TIMEOUT_SECONDS,
  ONE_SECOND,
  ensureNanoPrefix,
  priceNanoUnits,
  priceRawUnits,
  isRawUnits,
  isNanoUnits,
  convertNanoToRaw,
  validateNanoRpcUrl,
  validateNanoWorkGenerationUrl,
  validateNanoAccountPrivateKey,
  validateCustomWorkGenerator,
  deriveAccountFromPrivateKey,
  fromHelperConfig,
  CLIENT_SIGNER_CONFIG,
  RESOURCE_SERVER_SIGNER_CONFIG,
  FACILITATOR_SIGNER_CONFIG,
  ASSET_AMOUNT
};
//# sourceMappingURL=chunk-PAVQFMWI.mjs.map