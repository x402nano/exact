import {
  SchemeNetworkFacilitator,
  PaymentPayload,
  PaymentRequirements,
  VerifyResponse,
  SettleResponse,
  Network,
} from '@x402/core/types'
import BigNumber from 'bignumber.js'
import {
  HelperClass,
  ExactNanoPayload,
  ProcessBlockResponse,
  Hex64,
  NANO_SEND_BLOCK,
  SEND_BLOCK_WORK_THRESHOLD,
  NANO_ACCOUNT_PRIVATE_KEY_PROPERTY,
} from '@x402nano/typescript-common'
import { Nano } from 'nano-sdk'

/**
 * Error codes used throughout the ExactNanoScheme implementation.
 */
const ERROR_X402_VERSION_NOT_SUPPORTED: string = 'error_x402_version_not_supported'
const ERROR_INVALID_BLOCK: string = 'error_invalid_block'
const ERROR_INVALID_WORK: string = 'error_invalid_work'
const ERROR_NO_ACCOUNT_FRONTIER: string = 'error_no_account_frontier'
const ERROR_NOT_ENOUGH_BALANCE: string = 'error_not_enough_balance'
const ERROR_PAYTO_LINK_MISMATCH: string = 'error_payto_link_mismatch'
const ERROR_NANO_RPC: string = 'error_nano_rpc'
const ERROR_INVALID_HELPER: string = 'error_invalid_helper'
const ERROR_FACILITATOR: string = 'error_facilitator'

/**
 * List of supported x402 protocol versions by this implementation.
 */
const SUPPORTED_X402_VERSIONS: number[] = [2]

/**
 * Current Nano address prefix.
 */
const NANO_PREFIX: string = 'nano_'

/**
 * Legacy Nano address prefix.
 */
const XRB_PREFIX: string = 'xrb_'

/**
 * Parameters for constructing an invalid verification response.
 */
type ConstructVerifyInvalidResponseParams = {
  invalidReason: string
  payer: string
}

/**
 * Constructs a standardized invalid verification response.
 *
 * @param params - The parameters for the response
 * @param params.invalidReason - The reason for the invalidation
 * @param params.payer - The Nano account that initiated the payment
 * @returns A VerifyResponse object indicating failure
 */
function constructVerifyInvalidResponse({
  invalidReason,
  payer,
}: ConstructVerifyInvalidResponseParams): VerifyResponse {
  return {
    isValid: false,
    invalidReason,
    payer,
  }
}

/**
 * Parameters for constructing an unsuccessful settlement response.
 */
type ConstructSettleUnsuccessfulResponseParams = {
  network: Network
  errorReason: string
  payer: string
}

/**
 * Constructs a standardized unsuccessful settlement response.
 *
 * @param params - The parameters for the response
 * @param params.network - Nano network being used
 * @param params.errorReason - The reason for the unsuccessful settlement
 * @param params.payer - The Nano account that initiated the payment
 * @returns A SettleResponse object indicating failure
 */
function constructSettleUnsuccessfulResponse({
  network,
  errorReason,
  payer,
}: ConstructSettleUnsuccessfulResponseParams): SettleResponse {
  return {
    success: false,
    network,
    transaction: '',
    errorReason,
    payer,
  }
}

// ---------------------------------------------------

/**
 * Implementation of the x402 Nano "exact" payment scheme for Facilitators.
 *
 * This facilitator handles verification and settlement of payments using the Nano blockchain.
 * It validates payment payloads and processes transactions according to the x402 protocol.
 */
export class ExactNanoScheme implements SchemeNetworkFacilitator {
  /**
   * The payment scheme identifier.
   */
  readonly scheme: string = 'exact'

  /**
   * CAIP-2 identifier for the Nano network family e.g. nano:mainnet, nano:testnet
   */
  readonly caipFamily: string = 'nano:*'

  /**
   * Creates a new ExactNanoScheme instance.
   *
   * @param helper - The Helper instance used for communicating with Nano RPC and generating send blocks
   */
  constructor(private readonly helper: HelperClass) {
    if (NANO_ACCOUNT_PRIVATE_KEY_PROPERTY in helper.getConfig()) {
      throw new Error(
        `[${ERROR_INVALID_HELPER}] - ${NANO_ACCOUNT_PRIVATE_KEY_PROPERTY} is set in Helper config for Facilitator and must be removed.`,
      )
    }
  }

  /**
   * Gets additional scheme-specific metadata (none for this implementation).
   *
   * @returns undefined as no extra metadata is provided
   */
  getExtra() {
    return undefined
  }

  /**
   * Gets the list of signers required for this scheme (none for this implementation).
   *
   * @param _ - Unused parameter (requirements)
   * @returns Empty array as no additional signers are needed
   */
  getSigners(_) {
    return []
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
  async verify(
    payload: PaymentPayload,
    requirements: PaymentRequirements,
  ): Promise<VerifyResponse> {
    try {
      const exactNanoPayload = payload.payload as ExactNanoPayload

      // -----
      // Validate Nano block format
      if (!NANO_SEND_BLOCK.safeParse(exactNanoPayload.block).success) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_INVALID_BLOCK,
          payer: '',
        })
      }

      const payer = exactNanoPayload.block.account

      // -----
      // Check if x402 version is supported
      if (!SUPPORTED_X402_VERSIONS.includes(payload.x402Version)) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_X402_VERSION_NOT_SUPPORTED,
          payer,
        })
      }

      // -----
      // Verify that when link field in block is decoded as a Nano account
      // (link_as_account), it exactly matches payTo account
      if (
        requirements.payTo.replace(XRB_PREFIX, NANO_PREFIX) !==
        exactNanoPayload.block.link_as_account
      ) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_PAYTO_LINK_MISMATCH,
          payer,
        })
      }
      // -----

      const payAmount = requirements.amount

      let getAccountInfoResponse = await this.helper.getAccountInfo({
        account: exactNanoPayload.block.account,
      })

      if ('error' in getAccountInfoResponse) {
        return constructVerifyInvalidResponse({
          invalidReason: `[${ERROR_NANO_RPC}]: ${getAccountInfoResponse.error}`,
          payer,
        })
      }

      let { frontier, balance } = getAccountInfoResponse

      // -----
      // Verify that frontier exists for payers's Nano account (i.e. the account is opened)
      if (!frontier) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_NO_ACCOUNT_FRONTIER,
          payer,
        })
      }

      // -----
      // Check if payer has enough balance to perform payment
      if (BigNumber(balance).minus(payAmount).isNegative()) {
        return constructVerifyInvalidResponse({
          invalidReason: ERROR_NOT_ENOUGH_BALANCE,
          payer,
        })
      }

      // -----
      // Check if supplied Proof-of-Work (PoW) for block is valid
      try {
        let isWorkValid = Nano.Crypto.verifyWork({
          hash: frontier,
          work: exactNanoPayload.block.work,
          threshold: SEND_BLOCK_WORK_THRESHOLD,
        })

        if (!isWorkValid) {
          throw new Error()
        }
      } catch (error) {
        return constructVerifyInvalidResponse({
          invalidReason:
            `${ERROR_INVALID_WORK}` + (error instanceof Error ? ` - ${error.message} ` : ``),
          payer,
        })
      }

      // -----
      // Verify block

      try {
        let publicKey = Nano.Crypto.derivePublicKeyFromAccount({
          account: exactNanoPayload.block.account,
        })

        let isBlockVerified = Nano.Crypto.verifyBlock({
          block: exactNanoPayload.block as ExactNanoPayload['block'] & {
            link_as_account: string
          },
          publicKey,
        })

        if (!isBlockVerified) {
          throw new Error()
        }
      } catch (error) {
        return constructVerifyInvalidResponse({
          invalidReason:
            `${ERROR_INVALID_BLOCK}` + (error instanceof Error ? ` - ${error.message} ` : ``),
          payer,
        })
      }

      const facilitatorSuccess: VerifyResponse = {
        isValid: true,
        invalidReason: undefined,
        payer,
      }

      return facilitatorSuccess
    } catch (error) {
      // Handle unexpected errors
      return constructVerifyInvalidResponse({
        invalidReason: `[${ERROR_FACILITATOR}] - ${error.message}`,
        payer: '',
      })
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
  async settle(
    payload: PaymentPayload,
    requirements: PaymentRequirements,
  ): Promise<SettleResponse> {
    try {
      const exactNanoPayload = payload.payload as ExactNanoPayload

      // Validate Nano block format
      if (!NANO_SEND_BLOCK.safeParse(exactNanoPayload.block).success) {
        return constructSettleUnsuccessfulResponse({
          network: payload.accepted.network,
          errorReason: ERROR_INVALID_BLOCK,
          payer: '',
        })
      }

      const unsuccessfulResponse = constructSettleUnsuccessfulResponse({
        network: payload.accepted.network,
        errorReason: ERROR_NANO_RPC,
        payer: exactNanoPayload.block.account,
      })

      let getProcessBlockResponse: ProcessBlockResponse
      try {
        getProcessBlockResponse = await this.helper.processBlock({ block: exactNanoPayload.block })
      } catch (error) {
        void error
        return unsuccessfulResponse
      }

      let hash: Hex64 = getProcessBlockResponse.hash

      if ('error' in getProcessBlockResponse || !hash) {
        return unsuccessfulResponse
      }

      let successResponse: SettleResponse = {
        success: true,
        transaction: hash,
        network: payload.accepted.network,
        payer: exactNanoPayload.block.account,
      }

      return successResponse
    } catch (error) {
      // Handle unexpected errors
      return constructSettleUnsuccessfulResponse({
        network: payload?.accepted?.network,
        errorReason: `[${ERROR_FACILITATOR}] - ${error.message}`,
        payer: '',
      })
    }
  }
}
