import { PaymentPayload, PaymentRequirements, SchemeNetworkClient } from '@x402/core/types'
import { HelperClass, ExactNanoPayload, NanoSendBlock } from '@x402nano/typescript-common'

/**
 * Implementation of the x402 Nano "exact" payment scheme for Clients.
 *
 * This client generates payment payloads containing a Nano send block for fixed-amount payments.
 * It integrates with the x402 protocol to enable blockchain-based micropayments.
 */
export class ExactNanoScheme implements SchemeNetworkClient {
  /**
   * The payment scheme identifier.
   */
  readonly scheme = 'exact'

  /**
   * Creates a new ExactNanoClient instance.
   *
   * @param helper - The Helper instance used for communicating with Nano RPC and generating send blocks
   */
  constructor(private readonly helper: HelperClass) {}

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
   * const payload = await client.createPaymentPayload(1, {
   *   payTo: 'nano_...',
   *   amount: '1000000000000000000000000'
   * })
   * ```
   */
  async createPaymentPayload(
    x402Version: number,
    paymentRequirements: PaymentRequirements,
  ): Promise<Pick<PaymentPayload, 'x402Version' | 'payload'>> {
    if (!paymentRequirements.payTo?.trim()) {
      throw new Error('Missing required payment field: payTo')
    }

    if (!paymentRequirements.amount?.trim()) {
      throw new Error('Missing required payment field: amount')
    }

    let sendBlock: NanoSendBlock
    try {
      sendBlock = await this.helper.generateSendBlock({
        payTo: paymentRequirements.payTo,
        amount: paymentRequirements.amount,
      })
    } catch (error) {
      throw new Error(`Failed to generate Nano send block for Client \nCause: ${error.message}`)
    }

    const payload: ExactNanoPayload = { block: sendBlock }

    return {
      x402Version,
      payload,
    }
  }
}
