import {
  AssetAmount,
  Network,
  PaymentRequirements,
  Price,
  SchemeNetworkServer,
} from '@x402/core/types'
import { Nano } from 'nano-sdk'
import BigNumber from 'bignumber.js'
import { ASSET_AMOUNT, STRING_DECIMAL } from '@x402nano/typescript-common'
import { CURRENCY_CODE_XNO } from '../common'

/**
 * Converts a nano amount to its raw unit equivalent.
 *
 * @param amount - The amount in Nano (string representation)
 * @returns The equivalent amount in raw units as a string
 *
 * @example
 * ```ts
 * const raw = convertNanoToRaw("1.5") // Converts 1.5 Nano to raw
 * ```
 */
function convertNanoToRaw(amount: string) {
  // if price is in nano units then convert to raw units
  return Nano.Math.nanoToRaw({ nano: amount })
}

/**
 * Handles conversion of raw or nano unit amount to a string
 *
 * @param amount - Amount in raw units (e.g. 1000000000000000000000000000) or nano units (e.g. 0.001)
 * @returns string representation of amount
 *
 * @example
 * ```ts
 * const rawString = parseAmountToString(1000000000000000000000000000) // returns "1000000000000000000000000000"
 * const nanoString = parseAmountToString(0.001) // returns "1000000000000000000000000000"
 * ```
 */
function parseAmountToString(amount: string | number | unknown) {
  if (typeof amount === 'string') {
    const amount_ = amount.trim()

    try {
      if (!STRING_DECIMAL.safeParse(amount_).success) {
        return amount_
      }
      return BigNumber(amount_).toFixed()
    } catch (error) {
      void error
      return amount_
    }
  }

  if (typeof amount === 'number') {
    return BigNumber(amount).toFixed()
  }

  return String(amount)
}

// ---------------------------------------------------

/**
 * Implementation of the x402 Nano "exact" payment scheme for Resource Servers.
 *
 * This class handles price parsing and payment requirement enhancement for Nano cryptocurrency payments.
 * It conforms to the SchemeNetworkServer interface and integrates with the x402 protocol.
 */
export class ExactNanoScheme implements SchemeNetworkServer {
  /**
   * The payment scheme identifier.
   */
  readonly scheme = 'exact'

  /**
   * Asset-transfer method used when a payment requirement does not specify one.
   *
   * "exact" payments are a single on-chain transfer with no wire-level
   * asset-transfer method, so core's reserved "default" key applies.
   */
  readonly defaultAssetTransferMethod = 'default'

  /**
   * Payment flows supported per asset-transfer method.
   *
   * "exact" uses the authorization flow: the facilitator verifies the signed
   * block before the resource handler runs and only broadcasts it once the
   * handler succeeds. Clients are therefore never charged for failed requests.
   */
  readonly paymentFlows = {
    default: {
      default: 'authorization',
      supported: ['authorization'],
    },
  } as const

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
  async parsePrice(price: Price, network: Network): Promise<AssetAmount> {
    if (typeof price === 'object' && ASSET_AMOUNT.safeParse(price).success) {
      if (price.asset.toUpperCase() !== CURRENCY_CODE_XNO) {
        throw new Error(`Asset must be specified as "${CURRENCY_CODE_XNO}" for AssetAmount`)
      }

      let price_to_string: string = parseAmountToString(price)

      return {
        amount: convertNanoToRaw(price_to_string),
        asset: price.asset,
        extra: price.extra || {},
      }
    }

    let price_to_string: string = parseAmountToString(price)

    let isRawUnits
    if (!STRING_DECIMAL.safeParse(price_to_string).success) {
      isRawUnits = true
    }

    return {
      amount: isRawUnits ? price_to_string : convertNanoToRaw(price_to_string),
      asset: CURRENCY_CODE_XNO,
      extra: {},
    }
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
  enhancePaymentRequirements(
    paymentRequirements: PaymentRequirements,
    supportedKind: {
      x402Version: number
      scheme: string
      network: Network
      extra?: Record<string, unknown>
    },
    extensionKeys: string[],
  ): Promise<PaymentRequirements> {
    void supportedKind
    void extensionKeys

    return Promise.resolve(paymentRequirements)
  }
}
