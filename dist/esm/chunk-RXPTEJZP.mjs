import {
  CLIENT_NO_WORK,
  CURRENCY_CODE_XNO,
  DEFAULT_MAX_TIMEOUT_SECONDS,
  ERROR_ACCOUNT_NOT_FOUND,
  ERROR_AMOUNT_MISMATCH,
  ERROR_BLOCK_ALREADY_CONFIRMED,
  ERROR_BLOCK_AWAITING_CONFIRMATION,
  ERROR_BLOCK_NOT_BROADCAST,
  ERROR_FACILITATOR,
  ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK,
  ERROR_INVALID_WORK,
  ERROR_NANO_RPC,
  ERROR_NETWORK_MISMATCH,
  ERROR_NOT_ENOUGH_BALANCE,
  ERROR_NO_ACCOUNT_FRONTIER,
  ERROR_PAYTO_LINK_MISMATCH,
  ERROR_PREVIOUS_NOT_FRONTIER,
  ERROR_TIMEOUT_EXPIRED,
  ERROR_UNSUPPORTED_NETWORK,
  ERROR_UNSUPPORTED_SCHEME,
  ERROR_UNSUPPORTED_X402_VERSION,
  ERROR_WORK_UNAVAILABLE,
  NANO_BETANET_CAIP2,
  NANO_TESTNET_CAIP2,
  ONE_SECOND,
  SEND_BLOCK_WORK_THRESHOLD_BETANET,
  SEND_BLOCK_WORK_THRESHOLD_MAINNET,
  ensureNanoPrefix
} from "./chunk-7UHAVRU7.mjs";
import {
  __publicField
} from "./chunk-NSSMTXJJ.mjs";

// src/typescript/facilitator/scheme.ts
import BigNumber from "bignumber.js";
import {
  derivePublicKeyFromAccount,
  verifyBlock as verifyBlock_,
  verifyWork,
  hashBlock as hashBlock_,
  deriveAccountFromLink
} from "nano-sdk/crypto";
import { StateBlock } from "nano-sdk/blocks";
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
  return hashBlock_({
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
    let publicKey = derivePublicKeyFromAccount({
      account: block.account
    });
    let isBlockVerified = verifyBlock_({
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
   * 6. Block Structure Check
   * 7. Valid Block Check
   * 8. payTo Check
   * 9. Previous Confirmation Check
   * 10. Account Check
   * 11. Frontier Hash Check
   * 12. Balance Check
   * 13. Work Difficulty Check
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
      if (!StateBlock().safeParse(exactNanoPayload.block).success) {
        return constructVerifyInvalidResponse_(ERROR_INVALID_BLOCK);
      }
      const payer = exactNanoPayload.block.account;
      if (!verifyBlock(exactNanoPayload.block)) {
        return constructVerifyInvalidResponse_(ERROR_INVALID_BLOCK);
      }
      if (!(ensureNanoPrefix(requirements.payTo) === ensureNanoPrefix(payload.accepted.payTo) && ensureNanoPrefix(payload.accepted.payTo) === ensureNanoPrefix(exactNanoPayload.block.link_as_account) && deriveAccountFromLink({ link: exactNanoPayload.block.link }) === exactNanoPayload.block.link_as_account)) {
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
            return constructVerifyInvalidResponse_(ERROR_AMOUNT_MISMATCH);
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
      if (frontier !== exactNanoPayload.block.previous || frontier !== confirmed_frontier) {
        return constructVerifyInvalidResponse_(ERROR_PREVIOUS_NOT_FRONTIER);
      }
      if (payload.accepted.amount !== requirements.amount) {
        return constructVerifyInvalidResponse_(ERROR_AMOUNT_MISMATCH);
      }
      if (BigNumber(previousBalance).minus(payload.accepted.amount).isNegative()) {
        return constructVerifyInvalidResponse_(ERROR_NOT_ENOUGH_BALANCE);
      }
      const balanceDelta = BigNumber(previousBalance).minus(exactNanoPayload.block.balance);
      if (!balanceDelta.isEqualTo(payload.accepted.amount)) {
        return constructVerifyInvalidResponse_(ERROR_AMOUNT_MISMATCH);
      }
      if (!shouldGenerateWork({ signer: this.signer, clientWork: exactNanoPayload.block.work })) {
        let workThreshold;
        if (requirements.network === NANO_BETANET_CAIP2 || requirements.network === NANO_TESTNET_CAIP2) {
          workThreshold = SEND_BLOCK_WORK_THRESHOLD_BETANET;
        } else {
          workThreshold = SEND_BLOCK_WORK_THRESHOLD_MAINNET;
        }
        try {
          let isWorkValid = verifyWork({
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

export {
  ExactNanoScheme
};
//# sourceMappingURL=chunk-RXPTEJZP.mjs.map