import {
  __publicField
} from "./chunk-NSSMTXJJ.mjs";

// src/typescript/client/scheme.ts
var ExactNanoScheme = class {
  /**
   * Creates a new ExactNanoClient instance.
   *
   * @param helper - The Helper instance used for communicating with Nano RPC and generating send blocks
   */
  constructor(helper) {
    this.helper = helper;
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
   * const payload = await client.createPaymentPayload(1, {
   *   payTo: 'nano_...',
   *   amount: '1000000000000000000000000'
   * })
   * ```
   */
  async createPaymentPayload(x402Version, paymentRequirements) {
    if (!paymentRequirements.payTo?.trim()) {
      throw new Error("Missing required payment field: payTo");
    }
    if (!paymentRequirements.amount?.trim()) {
      throw new Error("Missing required payment field: amount");
    }
    let sendBlock;
    try {
      sendBlock = await this.helper.generateSendBlock({
        payTo: paymentRequirements.payTo,
        amount: paymentRequirements.amount
      });
    } catch (error) {
      throw new Error(`Failed to generate Nano send block for Client 
Cause: ${error.message}`);
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
//# sourceMappingURL=chunk-KG42KI3U.mjs.map