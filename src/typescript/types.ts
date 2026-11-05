import * as z from "zod";
import { Network } from "@x402/core/types";
import * as schemas from "./schemas";
import {
  AccountString,
  HashString,
  PrivateKeyString,
  RawAmountString,
  WorkString,
} from "nano-sdk/types";
import { StateBlock } from "nano-sdk/blocks";

/**
 * Type representing a valid URL format.
 */
export type Url = z.infer<typeof schemas.URL>;

/**
 * Type representing HTTP headers.
 */
export type Headers = z.infer<typeof schemas.HEADERS>;

/**
 * Type representing the payload format used in the Nano x402 exact scheme
 */
export type ExactNanoPayload = {
  block: StateBlock;
};

/**
 * Type representing successful account information response from Nano node.
 */
export type AccountInfoSuccess = z.infer<typeof schemas.ACCOUNT_INFO_SUCCESS>;

/**
 * Type representing successful block information response from Nano node.
 */
export type BlockInfoSuccess = z.infer<typeof schemas.BLOCK_INFO_SUCCESS>;

/**
 * Type representing successful block processing response.
 */
export type ProcessBlockSuccess = z.infer<typeof schemas.PROCESS_BLOCK_SUCCESS>;

/**
 * Type representing Nano RPC error response.
 */
export type NanoRpcError = z.infer<typeof schemas.NANO_RPC_ERROR>;

/**
 * Type representing a block process response.
 */
export type ProcessBlockResponse = { hash: HashString } | { error: string };

/**
 * Type representing Nano RPC work generation response.
 */
export type NanoRpcCallWorkGenerateInternalResponse = z.infer<
  typeof schemas.NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE
>;

/**
 * Parameters for making a Nano RPC call.
 */
export type NanoRpcCallParams = {
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
export type GenerateSendBlockParams = {
  payTo: AccountString;
  amount: RawAmountString;
  network: Network;
  skipWorkGeneration?: boolean;
};

/**
 * Parameters for work generation.
 */
export type WorkGenerateInternalParams = {
  config: ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;
  block: StateBlock;
  network: Network;
  workGenerator?: WorkGenerator;
};

/**
 * Parameters for getting Nano account information.
 */
export type GetAccountInfoParams = {
  account: AccountString;
};

/**
 * Parameters for getting Nano block information.
 */
export type GetBlockInfoParams = {
  hash: HashString;
};

/**
 * Parameters for generating work for a Nano block.
 */
export type GenerateWorkParams = {
  block: StateBlock;
  network: Network;
};

/**
 * Parameters for processing a Nano block.
 */
export type ProcessBlockParams = {
  block: StateBlock;
};

/**
 * Parameters for getting Nano account details.
 */
export type GetAccountParams = {
  accountPrivateKey: PrivateKeyString;
};

/**
 * Type representing function passed to custom work generator.
 */
export type WorkGenerator = (params: {
  block: StateBlock;
  network?: Network;
}) => Promise<WorkString>;

/**
 * Type representing "before work generation" hook.
 */
export type BeforeWorkGenerationHook = (context: WorkGenerationHookContext) => Promise<void>;

/**
 * Type representing "after work generation" hook.
 */
export type AfterWorkGenerationHook = (context: WorkGenerationHookContext) => Promise<void>;

/**
 * Type representing function passed to "work generation" hooks.
 */
export type WorkGenerationHookContext = { hash: HashString; work?: WorkString };

/**
 * Response type for Nano RPC JSON calls.
 */
export type NanoRpcCallJsonResponse = Record<string, unknown> & {
  error?: string;
};

// ---------------------------------------------------

/**
 * Type representing Signer used by x402 clients to create and process Nano blocks and get Nano account information
 */
export type SignerClass = {
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
  getAccountInfo(params: { account: AccountString }): Promise<AccountInfoSuccess>;
  /**
   * Retrieves account information from the Nano node.
   *
   * @param params - Parameters
   * @param params.hash - The Nano block to get information for
   * @returns Promise resolving to block info
   * @throws Error if RPC URL is invalid or request fails
   */
  getBlockInfo(params: { hash: HashString }): Promise<BlockInfoSuccess>;
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

// ---------------------------------------------------

/**
 * Configuration type for thedeprecated Nano Helper class.
 */
export type HelperConfigDeprecated = z.infer<typeof schemas.HELPER_CONFIG_DEPRECATED>;

// ---------------------------------------------------

/**
 * Configuration type for the Client Signer class.
 */
export type ClientSignerConfig = z.infer<typeof schemas.CLIENT_SIGNER_CONFIG>;

/**
 * Configuration type for the Resource Server Signer class.
 */
export type ResourceServerSignerConfig = z.infer<typeof schemas.RESOURCE_SERVER_SIGNER_CONFIG>;

/**
 * Configuration type for the Facilitator Signer class.
 */
export type FacilitatorSignerConfig = z.infer<typeof schemas.FACILITATOR_SIGNER_CONFIG>;
