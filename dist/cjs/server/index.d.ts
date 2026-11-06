import { SchemeNetworkServer, Price, Network, AssetAmount, PaymentRequirements } from '@x402/core/types';

/**
 * Implementation of the x402 Nano "exact" payment scheme for Resource Servers.
 *
 * This class handles price parsing and payment requirement enhancement for Nano cryptocurrency payments.
 * It conforms to the SchemeNetworkServer interface and integrates with the x402 protocol.
 */
declare class ExactNanoScheme implements SchemeNetworkServer {
    /**
     * The payment scheme identifier.
     */
    readonly scheme = "exact";
    readonly defaultAssetTransferMethod = "default";
    readonly paymentFlows: {
        readonly default: {
            readonly supported: readonly ["authorization"];
            readonly default: "authorization";
        };
    };
    /**
     * Parses a price into an AssetAmount object.
     *
     * Normalizes all Price amounts to raw units for consistency.
     *
     * @param price - The price to parse as an AssetAmount object, string or number
     * @param network - The target network (unused in this function as we are dealing with a single native token)
     * @returns Promise that resolves to the parsed AssetAmount
     *
     * @example
     * ```ts
     * const asset = await server.parsePrice(
     *  price: {
     *    amount: "2500000000000000000000000",
     *    asset: "XNO",
     *  },
     *  "nano:mainnet"
     * )
     * // Returns { amount: "2500000000000000000000000", asset: "XNO", extra: {} }
     * ```
     */
    parsePrice(price: Price, network: Network): Promise<AssetAmount>;
    /**
     * Build payment requirements for this scheme/network combination
     *
     * @param paymentRequirements - The base payment requirements
     * @param supportedKind - The supported kind from facilitator
     * @param supportedKind.x402Version - The x402 version
     * @param supportedKind.scheme - The logical payment scheme
     * @param supportedKind.network - The network identifier in CAIP-2 format
     * @param supportedKind.extra - Optional extra metadata regarding scheme/network implementation details
     * @param extensionKeys - Extension keys supported by the facilitator (unused)
     * @returns Promise that resolves to the enhanced payment requirements
     */
    enhancePaymentRequirements(paymentRequirements: PaymentRequirements, supportedKind: {
        x402Version: number;
        scheme: string;
        network: Network;
        extra?: Record<string, unknown>;
    }, extensionKeys: string[]): Promise<PaymentRequirements>;
}

export { ExactNanoScheme };
