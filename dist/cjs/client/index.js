var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/typescript/client/index.ts
var client_exports = {};
__export(client_exports, {
  ExactNanoScheme: () => ExactNanoScheme
});
module.exports = __toCommonJS(client_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExactNanoScheme
});
//# sourceMappingURL=index.js.map