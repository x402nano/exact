import * as z from 'zod';
import { Network } from '@x402/core/types';
import { AccountString, RawAmountString, HashString, WorkString, PrivateKeyString } from 'nano-sdk/types';
import { StateBlock } from 'nano-sdk/blocks';

/**
 * Validates a URL string using Zod's built-in URL validation.
 */
declare const URL: z.ZodURL;
/**
 * Validates HTTP headers
 */
declare const HEADERS: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
/**
 * Schema for successful account information response from Nano node.
 */
declare const ACCOUNT_INFO_SUCCESS: z.ZodObject<{
    frontier: z.ZodString;
    open_block: z.ZodString;
    representative_block: z.ZodString;
    representative: z.ZodString;
    balance: z.ZodString;
    modified_timestamp: () => z.ZodBigInt;
    block_count: z.ZodString;
    account_version: z.ZodString;
    confirmed_balance: z.ZodString;
    confirmed_height: z.ZodString;
    confirmed_frontier: z.ZodString;
    confirmed_representative: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for successful block information response from Nano node.
 */
declare const BLOCK_INFO_SUCCESS: z.ZodObject<{
    block_account: z.ZodString;
    amount: z.ZodString;
    balance: z.ZodString;
    height: z.ZodString;
    local_timestamp: z.ZodString;
    successor: z.ZodString;
    confirmed: z.ZodUnion<readonly [z.ZodLiteral<"true">, z.ZodLiteral<"false">]>;
    contents: z.ZodObject<{
        type: z.ZodLiteral<"state">;
        account: z.ZodString;
        previous: z.ZodString;
        representative: z.ZodString;
        balance: z.ZodString;
        link: z.ZodUnion<[z.ZodString, z.ZodString]>;
        link_as_account: z.ZodString;
        signature: z.ZodString;
        work: z.ZodString;
    }, z.core.$strip>;
    subtype: z.ZodUnion<readonly [z.ZodLiteral<"change">, z.ZodLiteral<"epoch">, z.ZodLiteral<"receive">, z.ZodLiteral<"send">]>;
}, z.core.$strip>;
/**
 * Configuration schema for the Client Signer class.
 */
declare const CLIENT_SIGNER_CONFIG: z.ZodObject<{
    workGenerator: z.ZodOptional<z.ZodFunction<z.ZodTuple<readonly [z.ZodObject<{
        block: z.ZodLazy<z.ZodObject<{
            type: z.ZodLiteral<"state">;
            account: z.ZodString;
            previous: z.ZodString;
            representative: z.ZodString;
            balance: z.ZodString;
            link: z.ZodUnion<[z.ZodString, z.ZodString]>;
            link_as_account: z.ZodString;
            signature: z.ZodString;
            work: z.ZodString;
        }, z.core.$strip>>;
        network: z.ZodOptional<z.ZodTemplateLiteral<`${string}:${string}`>>;
    }, z.core.$strip>], null>, z.ZodPromise<z.ZodLazy<z.ZodString>>>>;
    workGenerationUrl: z.ZodOptional<z.ZodURL>;
    workGenerationApiKey: z.ZodOptional<z.ZodString>;
    rpcUrl: z.ZodURL;
    rpcApiKey: z.ZodOptional<z.ZodString>;
    accountPrivateKey: z.ZodString;
}, z.core.$strict>;
/**
 * Configuration schema for the Resource Signer class.
 */
declare const RESOURCE_SERVER_SIGNER_CONFIG: z.ZodObject<{
    workGenerator: z.ZodOptional<z.ZodFunction<z.ZodTuple<readonly [z.ZodObject<{
        block: z.ZodLazy<z.ZodObject<{
            type: z.ZodLiteral<"state">;
            account: z.ZodString;
            previous: z.ZodString;
            representative: z.ZodString;
            balance: z.ZodString;
            link: z.ZodUnion<[z.ZodString, z.ZodString]>;
            link_as_account: z.ZodString;
            signature: z.ZodString;
            work: z.ZodString;
        }, z.core.$strip>>;
        network: z.ZodOptional<z.ZodTemplateLiteral<`${string}:${string}`>>;
    }, z.core.$strip>], null>, z.ZodPromise<z.ZodLazy<z.ZodString>>>>;
    workGenerationUrl: z.ZodOptional<z.ZodURL>;
    workGenerationApiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/**
 * Configuration schema for the Facilitator Signer class.
 */
declare const FACILITATOR_SIGNER_CONFIG: z.ZodObject<{
    workGenerator: z.ZodOptional<z.ZodFunction<z.ZodTuple<readonly [z.ZodObject<{
        block: z.ZodLazy<z.ZodObject<{
            type: z.ZodLiteral<"state">;
            account: z.ZodString;
            previous: z.ZodString;
            representative: z.ZodString;
            balance: z.ZodString;
            link: z.ZodUnion<[z.ZodString, z.ZodString]>;
            link_as_account: z.ZodString;
            signature: z.ZodString;
            work: z.ZodString;
        }, z.core.$strip>>;
        network: z.ZodOptional<z.ZodTemplateLiteral<`${string}:${string}`>>;
    }, z.core.$strip>], null>, z.ZodPromise<z.ZodLazy<z.ZodString>>>>;
    workGenerationUrl: z.ZodOptional<z.ZodURL>;
    workGenerationApiKey: z.ZodOptional<z.ZodString>;
    rpcUrl: z.ZodURL;
    rpcApiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/**
 * Configuration schema for the deprecated x402 Nano Helper class.
 */
declare const HELPER_CONFIG_DEPRECATED: z.ZodObject<{
    NANO_RPC_URL: z.ZodOptional<z.ZodURL>;
    NANO_WORK_GENERATION_URL: z.ZodOptional<z.ZodURL>;
    NANO_ACCOUNT_PRIVATE_KEY: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for successful Nano block processing response.
 */
declare const PROCESS_BLOCK_SUCCESS: z.ZodObject<{
    hash: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for Nano RPC error response.
 */
declare const NANO_RPC_ERROR: z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for Nano RPC work generation response.
 */
declare const NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE: z.ZodObject<{
    work: z.ZodString;
    difficulty: z.ZodString;
    multiplier: z.ZodString;
    hash: z.ZodString;
}, z.core.$strip>;

/**
 * Type representing a valid URL format.
 */
type Url = z.infer<typeof URL>;
/**
 * Type representing HTTP headers.
 */
type Headers = z.infer<typeof HEADERS>;
/**
 * Type representing the payload format used in the Nano x402 exact scheme
 */
type ExactNanoPayload = {
    block: StateBlock;
};
/**
 * Type representing successful account information response from Nano node.
 */
type AccountInfoSuccess = z.infer<typeof ACCOUNT_INFO_SUCCESS>;
/**
 * Type representing successful block information response from Nano node.
 */
type BlockInfoSuccess = z.infer<typeof BLOCK_INFO_SUCCESS>;
/**
 * Type representing successful block processing response.
 */
type ProcessBlockSuccess = z.infer<typeof PROCESS_BLOCK_SUCCESS>;
/**
 * Type representing Nano RPC error response.
 */
type NanoRpcError = z.infer<typeof NANO_RPC_ERROR>;
/**
 * Type representing a block process response.
 */
type ProcessBlockResponse = {
    hash: HashString;
} | {
    error: string;
};
/**
 * Type representing Nano RPC work generation response.
 */
type NanoRpcCallWorkGenerateInternalResponse = z.infer<typeof NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE>;
/**
 * Parameters for making a Nano RPC call.
 */
type NanoRpcCallParams = {
    url: Url;
    headers?: Headers;
    action: string;
    params: object;
    timeout?: number;
    isGeneratingWork?: boolean;
};
/**
 * Parameters for generating a Nano send block.
 */
type GenerateSendBlockParams = {
    payTo: AccountString;
    amount: RawAmountString;
    network: Network;
    skipWorkGeneration?: boolean;
};
/**
 * Parameters for work generation.
 */
type WorkGenerateInternalParams = {
    config: ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;
    block: StateBlock;
    network: Network;
    workGenerator?: WorkGenerator;
};
/**
 * Parameters for getting Nano account information.
 */
type GetAccountInfoParams = {
    account: AccountString;
};
/**
 * Parameters for getting Nano block information.
 */
type GetBlockInfoParams = {
    hash: HashString;
};
/**
 * Parameters for generating work for a Nano block.
 */
type GenerateWorkParams = {
    block: StateBlock;
    network: Network;
};
/**
 * Parameters for processing a Nano block.
 */
type ProcessBlockParams = {
    block: StateBlock;
};
/**
 * Parameters for getting Nano account details.
 */
type GetAccountParams = {
    accountPrivateKey: PrivateKeyString;
};
/**
 * Type representing function passed to custom work generator.
 */
type WorkGenerator = (params: {
    block: StateBlock;
    network?: Network;
}) => Promise<WorkString>;
/**
 * Type representing "before work generation" hook.
 */
type BeforeWorkGenerationHook = (context: WorkGenerationHookContext) => Promise<void>;
/**
 * Type representing "after work generation" hook.
 */
type AfterWorkGenerationHook = (context: WorkGenerationHookContext) => Promise<void>;
/**
 * Type representing function passed to "work generation" hooks.
 */
type WorkGenerationHookContext = {
    hash: HashString;
    work?: WorkString;
};
/**
 * Response type for Nano RPC JSON calls.
 */
type NanoRpcCallJsonResponse = Record<string, unknown> & {
    error?: string;
};
/**
 * Type representing Signer used by x402 clients to create and process Nano blocks and get Nano account information
 */
type SignerClass = {
    /**
     * Hold the account identifier (nano_...) for the account private key passed in Signer config
     */
    account: AccountString | undefined;
    /**
     * Generates a signed Nano send block for a payment transaction.
     *
     * @param params - Parameters
     * @param params.payTo - Destination Nano account that the send amount is being sent to
     * @param params.amount - Amount of nano being sent in the send block
     * @returns Promise resolving to the generated send block
     * @throws Error if configuration is invalid, account is unopened, or balance is insufficient
     */
    generateSendBlock(params: GenerateSendBlockParams): Promise<StateBlock>;
    /**
     * Generates a signed Nano send block for a payment transaction.
     *
     * @param params - Parameters
     * @param params.payTo - Destination Nano account that the send amount is being sent to
     * @param params.amount - Amount of nano being sent in the send block
     * @returns Promise resolving to the generated send block
     * @throws Error if configuration is invalid, account is unopened, or balance is insufficient
     */
    generateWork(params: GenerateWorkParams): Promise<string>;
    /**
     * Submits a block to the Nano network for processing.
     *
     * @param params - Parameters
     * @param params.block - The block to process
     * @returns Promise resolving to the processing result containing transaction hash
     * @throws Error if RPC call fails
     */
    processBlock(params: ProcessBlockParams): Promise<ProcessBlockSuccess>;
    /**
     * Retrieves account information from the Nano node.
     *
     * @param params - Parameters
     * @param params.account - The Nano account to get information for
     * @returns Promise resolving to account info (frontier, balance, representative, etc.)
     * @throws Error if RPC URL is invalid or request fails
     */
    getAccountInfo(params: {
        account: AccountString;
    }): Promise<AccountInfoSuccess>;
    /**
     * Retrieves account information from the Nano node.
     *
     * @param params - Parameters
     * @param params.hash - The Nano block to get information for
     * @returns Promise resolving to block info
     * @throws Error if RPC URL is invalid or request fails
     */
    getBlockInfo(params: {
        hash: HashString;
    }): Promise<BlockInfoSuccess>;
    /**
     * Sets a custom work generator.
     *
     * @param workGenerator - Work generation function
     * @throws Error if the work generator function is not valid
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
     * Returns the current configuration values.
     *
     * @returns Current configuration values
     */
    getConfig(): ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;
};
/**
 * Configuration type for thedeprecated Nano Helper class.
 */
type HelperConfigDeprecated = z.infer<typeof HELPER_CONFIG_DEPRECATED>;
/**
 * Configuration type for the Client Signer class.
 */
type ClientSignerConfig = z.infer<typeof CLIENT_SIGNER_CONFIG>;
/**
 * Configuration type for the Resource Server Signer class.
 */
type ResourceServerSignerConfig = z.infer<typeof RESOURCE_SERVER_SIGNER_CONFIG>;
/**
 * Configuration type for the Facilitator Signer class.
 */
type FacilitatorSignerConfig = z.infer<typeof FACILITATOR_SIGNER_CONFIG>;

export type { AccountInfoSuccess as A, BlockInfoSuccess as B, ClientSignerConfig as C, ExactNanoPayload as E, FacilitatorSignerConfig as F, GetAccountInfoParams as G, HelperConfigDeprecated as H, NanoRpcCallJsonResponse as N, ProcessBlockParams as P, ResourceServerSignerConfig as R, SignerClass as S, Url as U, WorkGenerator as W, GetBlockInfoParams as a, GenerateSendBlockParams as b, GenerateWorkParams as c, ProcessBlockSuccess as d, BeforeWorkGenerationHook as e, AfterWorkGenerationHook as f, GetAccountParams as g, Headers as h, NanoRpcCallParams as i, NanoRpcCallWorkGenerateInternalResponse as j, NanoRpcError as k, ProcessBlockResponse as l, WorkGenerateInternalParams as m, WorkGenerationHookContext as n };
