import {
  __publicField
} from "./chunk-NSSMTXJJ.mjs";

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

export {
  ExactNanoScheme
};
//# sourceMappingURL=chunk-I4PM46R4.mjs.map