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
var import_bignumber = __toESM(require("bignumber.js"));
var import_typescript_common = require("@x402nano/typescript-common");

// src/typescript/common.ts
function validate(zodSchema, toParse) {
  return zodSchema.safeParse(toParse).success;
}

// src/typescript/facilitator/scheme.ts
var import_nano_sdk = require("nano-sdk");
var ERROR_X402_VERSION_NOT_SUPPORTED = "error_x402_version_not_supported";
var ERROR_INVALID_BLOCK = "error_invalid_block";
var ERROR_INVALID_WORK = "error_invalid_work";
var ERROR_NO_ACCOUNT_FRONTIER = "error_no_account_frontier";
var ERROR_NOT_ENOUGH_BALANCE = "error_not_enough_balance";
var ERROR_PAYTO_LINK_MISMATCH = "error_payto_link_mismatch";
var ERROR_NANO_RPC = "error_nano_rpc";
var ERROR_INVALID_HELPER = "error_invalid_helper";
var ERROR_FACILITATOR = "error_facilitator";
var SUPPORTED_X402_VERSIONS = [2];
var NANO_PREFIX = "nano_";
var XRB_PREFIX = "xrb_";
function constructVerifyInvalidResponse({
  invalidReason,
  payer
}) {
  return {
    isValid: false,
    invalidReason,
    payer
  };
}
function constructSettleUnsuccessfulResponse({
  network,
  errorReason,
  payer
}) {
  return {
    success: false,
    network,
    transaction: "",
    errorReason,
    payer
  };
}
var ExactNanoScheme = class {
  /**
   * Creates a new ExactNanoScheme instance.
   *
   * @param helper - The Helper instance used for communicating with Nano RPC and generating send blocks
   */
  constructor(helper) {
    this.helper = helper;
    /**
     * The payment scheme identifier.
     */
    __publicField(this, "scheme", "exact");
    /**
     * CAIP-2 identifier for the Nano network family e.g. nano:mainnet, nano:testnet
     */
    __publicField(this, "caipFamily", "nano:*");
    const config = helper.config;
    if (config?.[import_typescript_common.NANO_ACCOUNT_PRIVATE_KEY_PROPERTY]) {
      throw new Error(`[${ERROR_INVALID_HELPER}] - ${import_typescript_common.NANO_ACCOUNT_PRIVATE_KEY_PROPERTY} is set in Helper config for Facilitator and must be removed.`);
    }
  }
  /**
   * Gets additional scheme-specific metadata (none for this implementation).
   *
   * @returns undefined as no extra metadata is provided
   */
  getExtra() {
    return void 0;
  }
  /**
   * Gets the list of signers required for this scheme (none for this implementation).
   *
   * @param _ - Unused parameter (requirements)
   * @returns Empty array as no additional signers are needed
   */
  getSigners(_) {
    return [];
  }
  /**
   * Verifies a payment payload for validity against the specified payment requirements.
   *
   * Performs multiple validation steps including:
   * - x402 protocol version check
   * - Account frontier verification
   * - Proof-of-Work validation
   * - Block signature verification
   * - Sufficient balance check
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
  async verify(payload, requirements) {
    try {
      const exactNanoPayload = payload.payload;
      if (!validate(import_typescript_common.NANO_SEND_BLOCK, exactNanoPayload.block)) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_INVALID_BLOCK,
          payer: ""
        });
      }
      const payer = exactNanoPayload.block.account;
      if (!SUPPORTED_X402_VERSIONS.includes(payload.x402Version)) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_X402_VERSION_NOT_SUPPORTED,
          payer
        });
      }
      if (requirements.payTo.replace(XRB_PREFIX, NANO_PREFIX) !== exactNanoPayload.block.link_as_account) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_PAYTO_LINK_MISMATCH,
          payer
        });
      }
      const payAmount = requirements.amount;
      let getAccountInfoResponse = await this.helper.getAccountInfo({
        account: exactNanoPayload.block.account
      });
      if ("error" in getAccountInfoResponse) {
        return constructVerifyInvalidResponse({
          invalidReason: `[${ERROR_NANO_RPC}]: ${getAccountInfoResponse.error}`,
          payer
        });
      }
      let { frontier, balance } = getAccountInfoResponse;
      if (!frontier) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_NO_ACCOUNT_FRONTIER,
          payer
        });
      }
      if ((0, import_bignumber.default)(balance).minus(payAmount).isNegative()) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_NOT_ENOUGH_BALANCE,
          payer
        });
      }
      try {
        let isWorkValid = import_nano_sdk.Nano.Crypto.verifyWork({
          hash: frontier,
          work: exactNanoPayload.block.work,
          threshold: import_typescript_common.SEND_BLOCK_WORK_THRESHOLD
        });
        if (!isWorkValid) {
          throw new Error();
        }
      } catch (error) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_INVALID_WORK,
          payer
        });
      }
      try {
        let publicKey = import_nano_sdk.Nano.Crypto.derivePublicKeyFromAccount({
          account: exactNanoPayload.block.account
        });
        let isBlockVerified = import_nano_sdk.Nano.Crypto.verifyBlock({
          // NanoSendBlock types link_as_account as optional, but it is guaranteed
          // present here: the block passed NANO_SEND_BLOCK validation and the
          // payTo/link_as_account match check above.
          block: exactNanoPayload.block,
          publicKey
        });
        if (!isBlockVerified) {
          throw new Error();
        }
      } catch (error) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_INVALID_BLOCK,
          payer
        });
      }
      const facilitatorSuccess = {
        isValid: true,
        invalidReason: void 0,
        payer
      };
      return facilitatorSuccess;
    } catch (error) {
      return constructVerifyInvalidResponse({
        invalidReason: `[${ERROR_FACILITATOR}] - ${error.message}`,
        payer: ""
      });
    }
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
    try {
      const exactNanoPayload = payload.payload;
      if (!validate(import_typescript_common.NANO_SEND_BLOCK, exactNanoPayload.block)) {
        return constructSettleUnsuccessfulResponse({
          network: payload.accepted.network,
          errorReason: ERROR_INVALID_BLOCK,
          payer: ""
        });
      }
      const unsuccessfulResponse = constructSettleUnsuccessfulResponse({
        network: payload.accepted.network,
        errorReason: ERROR_NANO_RPC,
        payer: exactNanoPayload.block.account
      });
      let getProcessBlockResponse;
      try {
        getProcessBlockResponse = await this.helper.processBlock({ block: exactNanoPayload.block });
      } catch (error) {
        return unsuccessfulResponse;
      }
      let hash = getProcessBlockResponse.hash;
      if ("error" in getProcessBlockResponse || !hash) {
        return unsuccessfulResponse;
      }
      let successResponse = {
        success: true,
        transaction: hash,
        network: payload.accepted.network,
        payer: exactNanoPayload.block.account
      };
      return successResponse;
    } catch (error) {
      return constructSettleUnsuccessfulResponse({
        network: payload?.accepted?.network,
        errorReason: `[${ERROR_FACILITATOR}] - ${error.message}`,
        payer: ""
      });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExactNanoScheme
});
//# sourceMappingURL=index.js.map