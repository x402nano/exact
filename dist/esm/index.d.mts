export { ExactNanoScheme as ExactNanoClientScheme, ExactNanoScheme } from './client/index.mjs';
export { ExactNanoScheme as ExactNanoServerScheme } from './server/index.mjs';
export { ExactNanoScheme as ExactNanoFacilitatorScheme } from './facilitator/index.mjs';
import { H as HelperConfigDeprecated, C as ClientSignerConfig, R as ResourceServerSignerConfig, F as FacilitatorSignerConfig, S as SignerClass, G as GetAccountInfoParams, A as AccountInfoSuccess, a as GetBlockInfoParams, B as BlockInfoSuccess, b as GenerateSendBlockParams, c as GenerateWorkParams, P as ProcessBlockParams, d as ProcessBlockSuccess, W as WorkGenerator, e as BeforeWorkGenerationHook, f as AfterWorkGenerationHook } from './types-D7EwDFVM.mjs';
export { E as ExactNanoPayload, g as GetAccountParams, h as Headers, N as NanoRpcCallJsonResponse, i as NanoRpcCallParams, j as NanoRpcCallWorkGenerateInternalResponse, k as NanoRpcError, l as ProcessBlockResponse, U as Url, m as WorkGenerateInternalParams, n as WorkGenerationHookContext } from './types-D7EwDFVM.mjs';
import { WorkDifficultyString, PrivateKeyString, AccountString, RawAmountString } from 'nano-sdk/types';
import { StateBlock } from 'nano-sdk/blocks';
import { AssetAmount, Price } from '@x402/core/types';
import 'zod';

/**
 * CAIP-2 network identifier for Nano Mainnet.
 */
declare const NANO_MAINNET_CAIP2 = "nano:mainnet";
/**
 * CAIP-2 network identifier for Nano Betanet.
 */
declare const NANO_BETANET_CAIP2 = "nano:betanet";
/**
 * CAIP-2 network identifier for Nano Testnet.
 */
declare const NANO_TESTNET_CAIP2 = "nano:testnet";
/**
 * CAIP-2 network identifier for all Nano networks.
 */
declare const NANO_WILDCARD_CAIP2 = "nano:*";
/**
 * Proof-of-Work difficulty threshold required for valid send blocks on Nano Mainnet.
 * This values ensures send blocks meet the minimum difficulty requirements on mainnet.
 */
declare const SEND_BLOCK_WORK_THRESHOLD_MAINNET: WorkDifficultyString;
/**
 * Proof-of-Work difficulty threshold required for valid send blocks on Nano Betanet.
 * This values ensures send blocks meet the minimum difficulty requirements on betanet.
 */
declare const SEND_BLOCK_WORK_THRESHOLD_BETANET: WorkDifficultyString;
/**
 * Supported Nano CAIP-2 networks for this mechanism.
 */
declare const SUPPORTED_NANO_NETWORKS: readonly ["nano:mainnet", "nano:betanet", "nano:testnet", "nano:*"];
/**
 * Error codes used throughout the ExactNanoScheme implementation.
 */
declare const ERROR_SIGNER = "error_signer";
declare const ERROR_CONFIG = "error_config";
declare const ERROR_BLOCK_GENERATION = "error_block_generation";
declare const ERROR_NANO_WORK_GENERATION = "error_nano_work_generation";
declare const ERROR_NANO_RPC = "error_nano_rpc";
declare const ERROR_PRICE = "error_price";
declare const ERROR_RAW_AMOUNT = "error_raw_amount";
declare const ERROR_UNSUPPORTED_X402_VERSION: string;
declare const ERROR_UNSUPPORTED_NETWORK: string;
declare const ERROR_NETWORK_MISMATCH: string;
declare const ERROR_UNSUPPORTED_SCHEME: string;
declare const ERROR_INVALID_ASSET: string;
declare const ERROR_INVALID_BLOCK: string;
declare const ERROR_PAYTO_LINK_MISMATCH: string;
declare const ERROR_NO_ACCOUNT_FRONTIER: string;
declare const ERROR_PREVIOUS_NOT_FRONTIER: string;
declare const ERROR_FRONTIER_NOT_CONFIRMED: string;
declare const ERROR_NOT_ENOUGH_BALANCE: string;
declare const ERROR_AMOUNT_MISMATCH: string;
declare const ERROR_BLOCK_AMOUNT_MISMATCH: string;
declare const ERROR_INVALID_WORK: string;
declare const ERROR_TIMEOUT_EXPIRED: string;
declare const ERROR_ACCOUNT_NOT_FOUND: string;
declare const ERROR_BLOCK_ALREADY_CONFIRMED: string;
declare const ERROR_BLOCK_AWAITING_CONFIRMATION: string;
declare const ERROR_BLOCK_NOT_BROADCAST: string;
declare const ERROR_WORK_UNAVAILABLE: string;
declare const ERROR_FACILITATOR: string;
declare const ERROR_TEXT_RPCURL_NOT_FOUND = "error_config - 'rpcUrl' not specified";
declare const DEPRECATION_NOTICE = "DEPRECATION";
declare const CURRENCY_CODE_XNO = "XNO";
/**
 * Current Nano address prefix.
 */
declare const NANO_PREFIX: string;
/**
 * Legacy Nano address prefix.
 */
declare const XRB_PREFIX: string;
/**
 * Used by Client to signal that it wants work generated for its send block.
 */
declare const CLIENT_NO_WORK: string;
/**
 * Default number of seconds before a transaction attempt is considered timed out.
 */
declare const DEFAULT_MAX_TIMEOUT_SECONDS = 60;
/**
 * One second in milliseconds.
 */
declare const ONE_SECOND = 1000;

/**
 * Create an AssetAmount object for nano unit amounts. Used to populate the 'price' field in a Payment Requirement
 *
 * @param amount - Amount in nano units
 * @param extra - Extra object (optional)
 * @returns AssetAmount object
 */
declare function priceNanoUnits$1(amount: string | number, extra?: Record<string, unknown> | undefined): AssetAmount;
/**
 * Create an AssetAmount object for raw unit amounts. Used to populate the 'price' field in a Payment Requirement
 *
 * @param amount - Amount in raw units
 * @param extra - Extra object (optional)
 * @returns AssetAmount object
 */
declare function priceRawUnits$1(amount: RawAmountString | Price, extra?: Record<string, unknown> | undefined): AssetAmount;
/**
 * Derive a Nano account (nano_...) from its private key
 *
 * @param privateKey - Private key to derive Nano account from
 * @returns Nano account (nano_...)
 */
declare function deriveAccountFromPrivateKey(privateKey: PrivateKeyString): AccountString;
/**
 * Converts the deprecated Helper config shape into the newer Signer equivalent
 *
 * @param helperConfig - Helper config shape
 * @returns Signer config shape
 */
declare function fromHelperConfig(helperConfig: HelperConfigDeprecated): ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;

/**
 * Instantiate a Client Nano Signer
 *
 * @param config - Configuration for the signer
 * @returns Client Nano Signer
 */
declare function createClientNanoSigner(config: ClientSignerConfig): Signer;
/**
 * Instantiate a Resource Server Nano Signer
 *
 * @param config - Configuration for the signer
 * @returns Resource Server Nano Signer
 */
declare function createResourceServerNanoSigner(config: ResourceServerSignerConfig): Signer;
/**
 * Instantiate a Facilitator Nano Signer
 *
 * @param config - Configuration for the signer
 * @returns Facilitator Nano Signer
 */
declare function createFacilitatorNanoSigner(config: FacilitatorSignerConfig): Signer;
/**
 * Signer class.
 *
 * Provides utility methods for block creation, accessing Nano account information,
 * and Nano RPC communication required for x402 protocol operations.
 */
declare class Signer implements SignerClass {
    /**
     * Configuration for the signer instance.
     */
    account: AccountString | undefined;
    private config;
    private beforeWorkGenerationHooks;
    private afterWorkGenerationHooks;
    /**
     * Creates a new Signer instance.
     *
     * @param params - Constructor parameters
     * @param params.config - Configuration object for the Signer
     * @param params.signerType - Type of Signer (Client or Facilitator)
     */
    constructor({ config, signerType, }: {
        config: ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;
        signerType: string;
    });
    /**
     * Retrieves account information from the Nano node.
     *
     * @param params - The configuration object
     * @param params.account - The account address to query
     * @returns Promise resolving to account info (frontier, balance, representative, etc.)
     * @throws Error if RPC URL is invalid or request fails
     */
    getAccountInfo({ account }: GetAccountInfoParams): Promise<AccountInfoSuccess>;
    /**
     * Retrieves block information from the Nano node.
     *
     * @param params - The configuration object
     * @param params.hash - Hash of the block to retrive information for
     * @returns Promise resolving to block info
     * @throws Error if RPC URL is invalid or request fails
     */
    getBlockInfo({ hash }: GetBlockInfoParams): Promise<BlockInfoSuccess>;
    /**
     * Generates a signed Nano send block for a payment transaction.
     *
     * @param params - Parameters including amount and destination address (payTo)
     * @returns Promise resolving to the generated send block
     * @throws Error if configuration is invalid, account is unopened, or balance is insufficient
     */
    generateSendBlock(params: GenerateSendBlockParams): Promise<StateBlock>;
    /**
     * Generates work for a signed Nano send block.
     *
     * @param params - Parameters object
     * @param params.block - The block to generate work for
     * @param params.network - The Nano network being used
     * @returns Promise resolving to the generated work
     * @throws Error if something goes wrong during work generation
     */
    generateWork({ block, network }: GenerateWorkParams): Promise<string>;
    /**
     * Submits a block to the Nano network for processing.
     *
     * @param params - The configuration object
     * @param params.block - The block to process
     * @returns Promise resolving to the processing result containing transaction hash
     * @throws Error if RPC call fails
     */
    processBlock({ block }: ProcessBlockParams): Promise<ProcessBlockSuccess>;
    /**
     * Sets a custom work generator.
     *
     * @param workGenerator - Work generator function
     * @throws Error if the work generation function is not valid
     */
    setCustomWorkGenerator(workGenerator: WorkGenerator): void;
    /**
     * Sets a hook that will be called before work generation takes place.
     *
     * @param hook - Hook function that will be called
     * @returns The current Signer class instance
     * @throws Error if the hook function itself throws an Error
     */
    onBeforeWorkGeneration(hook: BeforeWorkGenerationHook): SignerClass;
    /**
     * Sets a hook that will be called after work generation takes place.
     *
     * @param hook - Hook function that will be called
     * @returns The current Signer class instance
     * @throws Error if the hook function itself throws an Error
     */
    onAfterWorkGeneration(hook: AfterWorkGenerationHook): SignerClass;
    /**
     * Returns the current configuration values (without account private key for security purposes).
     *
     * @returns Current configuration values (without account private key)
     */
    getConfig(): ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;
}
declare const priceRawUnits: typeof priceRawUnits$1;
declare const priceNanoUnits: typeof priceNanoUnits$1;

export { AccountInfoSuccess, AfterWorkGenerationHook, BeforeWorkGenerationHook, BlockInfoSuccess, CLIENT_NO_WORK, CURRENCY_CODE_XNO, ClientSignerConfig, DEFAULT_MAX_TIMEOUT_SECONDS, DEPRECATION_NOTICE, ERROR_ACCOUNT_NOT_FOUND, ERROR_AMOUNT_MISMATCH, ERROR_BLOCK_ALREADY_CONFIRMED, ERROR_BLOCK_AMOUNT_MISMATCH, ERROR_BLOCK_AWAITING_CONFIRMATION, ERROR_BLOCK_GENERATION, ERROR_BLOCK_NOT_BROADCAST, ERROR_CONFIG, ERROR_FACILITATOR, ERROR_FRONTIER_NOT_CONFIRMED, ERROR_INVALID_ASSET, ERROR_INVALID_BLOCK, ERROR_INVALID_WORK, ERROR_NANO_RPC, ERROR_NANO_WORK_GENERATION, ERROR_NETWORK_MISMATCH, ERROR_NOT_ENOUGH_BALANCE, ERROR_NO_ACCOUNT_FRONTIER, ERROR_PAYTO_LINK_MISMATCH, ERROR_PREVIOUS_NOT_FRONTIER, ERROR_PRICE, ERROR_RAW_AMOUNT, ERROR_SIGNER, ERROR_TEXT_RPCURL_NOT_FOUND, ERROR_TIMEOUT_EXPIRED, ERROR_UNSUPPORTED_NETWORK, ERROR_UNSUPPORTED_SCHEME, ERROR_UNSUPPORTED_X402_VERSION, ERROR_WORK_UNAVAILABLE, FacilitatorSignerConfig, GenerateSendBlockParams, GenerateWorkParams, GetAccountInfoParams, GetBlockInfoParams, HelperConfigDeprecated, NANO_BETANET_CAIP2, NANO_MAINNET_CAIP2, NANO_PREFIX, NANO_TESTNET_CAIP2, NANO_WILDCARD_CAIP2, ONE_SECOND, ProcessBlockParams, ProcessBlockSuccess, ResourceServerSignerConfig, SEND_BLOCK_WORK_THRESHOLD_BETANET, SEND_BLOCK_WORK_THRESHOLD_MAINNET, SUPPORTED_NANO_NETWORKS, SignerClass, WorkGenerator, XRB_PREFIX, createClientNanoSigner, createFacilitatorNanoSigner, createResourceServerNanoSigner, deriveAccountFromPrivateKey, fromHelperConfig, priceNanoUnits, priceRawUnits };
