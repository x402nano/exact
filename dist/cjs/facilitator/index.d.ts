import { SchemeNetworkFacilitator, Network, PaymentPayload, PaymentRequirements, VerifyResponse, SettleResponse } from '@x402/core/types';
import { S as SignerClass } from '../types-D7EwDFVM.js';
import 'zod';
import 'nano-sdk/types';
import 'nano-sdk/blocks';

/**
 * Implementation of the x402 Nano "exact" payment scheme for Facilitators.
 *
 * This facilitator handles verification and settlement of payments using the Nano blockchain.
 * It validates payment payloads and processes transactions according to the x402 protocol.
 */
declare class ExactNanoScheme implements SchemeNetworkFacilitator {
    private readonly signer;
    /**
     * The payment scheme identifier.
     */
    readonly scheme: string;
    /**
     * CAIP-2 identifier for the Nano network family e.g. nano:mainnet, nano:betanet
     */
    readonly caipFamily: string;
    /**
     * Creates a new ExactNanoScheme instance.
     *
     * @param signer - The Signer instance used for generating send blocks and communicating with Nano RPC
     */
    constructor(signer: SignerClass);
    /**
     * Gets additional scheme-specific metadata (none for this implementation).
     *
     * @param network - Current network
     * @returns undefined as no extra metadata is provided
     */
    getExtra(network: Network): {
        workOptional: boolean;
    } | undefined;
    /**
     * Gets the list of signers required for this scheme (none for this implementation).
     *
     * @returns Empty array as no additional signers are needed
     */
    getSigners(): never[];
    /**
     * Verifies a payment payload.
     *
     * @param payload - The payment payload to verify
     * @param requirements - The payment requirements
     * @returns Promise resolving to verification response
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
    /**
     * Verifies a payment payload for validity against the specified payment requirements.
     *
     * Performs multiple verification checks:
     * 1. x402 Version Check
     * 2. Scheme Check
     * 3. Network Supported Check
     * 4. Network Mismatch Check
     * 5. Asset Check
     * 6. Amount Check
     * 7. Block Structure Check
     * 8. Valid Block Check
     * 9. payTo Check
     * 10. Previous Confirmation Check
     * 11. Account Check
     * 12. Frontier Hash Check
     * 13. Balance Check
     * 14. Work Difficulty Check
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
    private _verify;
}

export { ExactNanoScheme };
