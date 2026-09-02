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
    /**
     * Asset-transfer method used when a payment requirement does not specify one.
     *
     * "exact" payments are a single on-chain transfer with no wire-level
     * asset-transfer method, so core's reserved "default" key applies.
     */
    readonly defaultAssetTransferMethod = "default";
    /**
     * Payment flows supported per asset-transfer method.
     *
     * "exact" uses the authorization flow: the facilitator verifies the signed
     * block before the resource handler runs and only broadcasts it once the
     * handler succeeds. Clients are therefore never charged for failed requests.
     */
    readonly paymentFlows: {
        readonly default: {
            readonly default: "authorization";
            readonly supported: readonly ["authorization"];
        };
    };
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
    parsePrice(price: Price, network: Network): Promise<AssetAmount>;
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
    enhancePaymentRequirements(paymentRequirements: PaymentRequirements, supportedKind: {
        x402Version: number;
        scheme: string;
        network: Network;
        extra?: Record<string, unknown>;
    }, extensionKeys: string[]): Promise<PaymentRequirements>;
}

export { ExactNanoScheme };
