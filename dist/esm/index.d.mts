import { SchemeNetworkClient, PaymentRequirements, PaymentPayload } from '@x402/core/types';
import { HelperClass } from '@x402nano/typescript-common';

/**
 * Implementation of the x402 Nano "exact" payment scheme for Clients.
 *
 * This client generates payment payloads containing a Nano send block for fixed-amount payments.
 * It integrates with the x402 protocol to enable blockchain-based micropayments.
 */
declare class ExactNanoScheme implements SchemeNetworkClient {
    private readonly helper;
    /**
     * The payment scheme identifier.
     */
    readonly scheme = "exact";
    /**
     * Creates a new ExactNanoClient instance.
     *
     * @param helper - The Helper instance used for communicating with Nano RPC and generating send blocks
     */
    constructor(helper: HelperClass);
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
    createPaymentPayload(x402Version: number, paymentRequirements: PaymentRequirements): Promise<Pick<PaymentPayload, 'x402Version' | 'payload'>>;
}

export { ExactNanoScheme };
