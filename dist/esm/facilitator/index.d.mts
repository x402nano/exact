import { SchemeNetworkFacilitator, PaymentPayload, PaymentRequirements, VerifyResponse, SettleResponse } from '@x402/core/types';
import { HelperClass } from '@x402nano/typescript-common';

/**
 * Implementation of the x402 Nano "exact" payment scheme for Facilitators.
 *
 * This facilitator handles verification and settlement of payments using the Nano blockchain.
 * It validates payment payloads and processes transactions according to the x402 protocol.
 */
declare class ExactNanoScheme implements SchemeNetworkFacilitator {
    private readonly helper;
    /**
     * The payment scheme identifier.
     */
    readonly scheme: string;
    /**
     * CAIP-2 identifier for the Nano network family e.g. nano:mainnet, nano:testnet
     */
    readonly caipFamily: string;
    /**
     * Creates a new ExactNanoScheme instance.
     *
     * @param helper - The Helper instance used for communicating with Nano RPC and generating send blocks
     */
    constructor(helper: HelperClass);
    /**
     * Gets additional scheme-specific metadata (none for this implementation).
     *
     * @returns undefined as no extra metadata is provided
     */
    getExtra(): any;
    /**
     * Gets the list of signers required for this scheme (none for this implementation).
     *
     * @param _ - Unused parameter (requirements)
     * @returns Empty array as no additional signers are needed
     */
    getSigners(_: any): any[];
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
    verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse>;
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
    settle(payload: PaymentPayload, requirements: PaymentRequirements): Promise<SettleResponse>;
}

export { ExactNanoScheme };
