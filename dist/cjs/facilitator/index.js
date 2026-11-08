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

// src/typescript/facilitator/index.ts
var facilitator_exports = {};
__export(facilitator_exports, {
  ExactNanoScheme: () => ExactNanoScheme
});
module.exports = __toCommonJS(facilitator_exports);

// src/typescript/facilitator/scheme.ts
var import_bignumber2 = __toESM(require("bignumber.js"));

// src/typescript/constants.ts
var NANO_BETANET_CAIP2 = "nano:betanet";
var NANO_TESTNET_CAIP2 = "nano:testnet";
var SEND_BLOCK_WORK_THRESHOLD_MAINNET = "fffffff800000000";
var SEND_BLOCK_WORK_THRESHOLD_BETANET = "fffff00000000000";
var ERROR_CONFIG = "error_config";
var ERROR_NANO_RPC = "error_nano_rpc";
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
var ERROR_TEXT_RPCURL_NOT_FOUND = `${ERROR_CONFIG} - 'rpcUrl' not specified`;
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
var import_types2 = require("nano-sdk/types");

// src/typescript/schemas.ts
var z = __toESM(require("zod"));
var import_types = require("nano-sdk/types");
var import_blocks = require("nano-sdk/blocks");
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
  output: z.promise(z.lazy(() => (0, import_types.WorkString)()))
});
var ACCOUNT_INFO_SUCCESS = z.object({
  frontier: (0, import_types.HashString)(),
  open_block: (0, import_types.HashString)(),
  representative_block: (0, import_types.HashString)(),
  representative: (0, import_types.AccountString)(),
  balance: (0, import_types.RawAmountString)(),
  modified_timestamp: import_types.Timestamp,
  block_count: STRING_INT,
  account_version: STRING_INT,
  confirmed_balance: (0, import_types.RawAmountString)(),
  confirmed_height: STRING_INT,
  confirmed_frontier: (0, import_types.HashString)(),
  confirmed_representative: (0, import_types.AccountString)()
});
var BLOCK_INFO_SUCCESS = z.object({
  block_account: (0, import_types.AccountString)(),
  amount: (0, import_types.RawAmountString)(),
  balance: (0, import_types.RawAmountString)(),
  height: STRING_INT,
  local_timestamp: STRING_INT,
  successor: (0, import_types.HashString)(),
  confirmed: z.union([z.literal("true"), z.literal("false")]),
  contents: (0, import_blocks.StateBlock)(),
  subtype: (0, import_types.SubtypeString)()
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
  accountPrivateKey: (0, import_types.PrivateKeyString)(),
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
  NANO_ACCOUNT_PRIVATE_KEY: (0, import_types.HashString)().optional()
});
var PROCESS_BLOCK_SUCCESS = z.object({
  hash: (0, import_types.HashString)()
});
var NANO_RPC_ERROR = z.object({
  error: z.string()
});
var NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE = z.object({
  work: (0, import_types.WorkString)(),
  difficulty: (0, import_types.WorkDifficultyString)(),
  multiplier: z.string(),
  hash: (0, import_types.HashString)()
});
var EXACT_NANO_PAYLOAD = z.object({
  block: (0, import_blocks.StateBlock)()
});
var ASSET_AMOUNT = z.object({
  asset: z.literal(CURRENCY_CODE_XNO),
  amount: (0, import_types.RawAmountString)(),
  extra: z.object().optional()
}).strict().refine(
  (data) => {
    const rawAmount = isRawUnits(data.amount) ? data.amount : convertNanoToRaw(data.amount);
    return (0, import_types.RawAmountString)().safeParse(rawAmount).success;
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
function isRawUnits(amount) {
  return (0, import_types2.RawAmountString)().safeParse(amount).success;
}
function convertNanoToRaw(amount) {
  return (0, import_math.nanoToRaw)({ nano: amount });
}

// src/typescript/facilitator/scheme.ts
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
var ExactNanoScheme = class {
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
          if (getBlockInfoResponse.amount !== payload.accepted.amount || getBlockInfoResponse.subtype !== "send") {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExactNanoScheme
});
//# sourceMappingURL=index.js.map