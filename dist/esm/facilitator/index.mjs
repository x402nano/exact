import {
  NANO_ACCOUNT_PRIVATE_KEY_PROPERTY,
  NANO_SEND_BLOCK,
  SEND_BLOCK_WORK_THRESHOLD,
  validate
} from "../chunk-XPBYBE7I.mjs";
import {
  __publicField
} from "../chunk-NSSMTXJJ.mjs";

// src/typescript/facilitator/scheme.ts
import BigNumber from "bignumber.js";
import { Nano } from "nano-sdk";
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
    if (helper?.config?.[NANO_ACCOUNT_PRIVATE_KEY_PROPERTY]) {
      throw new Error(`[${ERROR_INVALID_HELPER}] - ${NANO_ACCOUNT_PRIVATE_KEY_PROPERTY} is set in Helper config for Facilitator and must be removed.`);
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
      if (!validate(NANO_SEND_BLOCK, exactNanoPayload.block)) {
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
      if (BigNumber(balance).minus(payAmount).isNegative()) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_NOT_ENOUGH_BALANCE,
          payer
        });
      }
      try {
        let isWorkValid = Nano.Crypto.verifyWork({
          hash: frontier,
          work: exactNanoPayload.block.work,
          threshold: SEND_BLOCK_WORK_THRESHOLD
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
        let publicKey = Nano.Crypto.derivePublicKeyFromAccount({
          account: exactNanoPayload.block.account
        });
        let isBlockVerified = Nano.Crypto.verifyBlock({
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
      if (!validate(NANO_SEND_BLOCK, exactNanoPayload.block)) {
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
export {
  ExactNanoScheme
};
//# sourceMappingURL=index.mjs.map