import { PaymentPayload, PaymentRequirements, SchemeNetworkClient } from "@x402/core/types";
import { SignerClass, ExactNanoPayload } from "../types";
import { StateBlock } from "nano-sdk/blocks";

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
  readonly scheme = "exact";

  /**
   * Creates a new ExactNanoClient instance.
   *
   * @param signer - The Signer instance used for generating send blocks and communicating with Nano RPC
   */
  constructor(private readonly signer: SignerClass) {}

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
  async createPaymentPayload(
    x402Version: number,
    paymentRequirements: PaymentRequirements,
  ): Promise<Pick<PaymentPayload, "x402Version" | "payload">> {
    let skipWorkGeneration: boolean = false;

    if (!paymentRequirements.payTo?.trim()) {
      throw new Error("Missing required payment field: payTo");
    }

    if (!paymentRequirements.amount?.trim()) {
      throw new Error("Missing required payment field: amount");
    }

    if (
      paymentRequirements?.extra.workOptional === true &&
      !this.signer.getConfig().workGenerator &&
      !this.signer.getConfig().workGenerationUrl
    ) {
      skipWorkGeneration = true;
    }

    let sendBlock: StateBlock;
    try {
      sendBlock = await this.signer.generateSendBlock({
        payTo: paymentRequirements.payTo,
        amount: paymentRequirements.amount,
        network: paymentRequirements.network,
        skipWorkGeneration,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to generate Nano send block for Client. Cause: ${error.message.includes("Resulting raw amount must not be negative") ? "Not enough balance" : error.message}`,
        );
      }

      throw new Error(`Failed to generate Nano send block for Client`);
    }

    const payload: ExactNanoPayload = { block: sendBlock };

    return {
      x402Version,
      payload,
    };
  }
}
