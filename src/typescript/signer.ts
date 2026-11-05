import * as z from "zod";
import { createSendBlock, StateBlock } from "nano-sdk/blocks";
import { verifyWork, deriveAccountFromPrivateKey } from "nano-sdk/crypto";
import { AccountString, WorkDifficultyString } from "nano-sdk/types";
import {
  // Types
  GenerateSendBlockParams,
  WorkGenerationHookContext,
  NanoRpcCallParams,
  WorkGenerateInternalParams,
  NanoRpcCallJsonResponse,
  NanoRpcCallWorkGenerateInternalResponse,
  GetAccountInfoParams,
  ProcessBlockParams,
  ProcessBlockSuccess,
  GenerateWorkParams,
  GetAccountParams,
  ClientSignerConfig,
  ResourceServerSignerConfig,
  FacilitatorSignerConfig,
  AccountInfoSuccess,
  BlockInfoSuccess,
  SignerClass,
  WorkGenerator,
  BeforeWorkGenerationHook,
  AfterWorkGenerationHook,
  GetBlockInfoParams,
} from "./types";
import {
  CLIENT_SIGNER_CONFIG,
  FACILITATOR_SIGNER_CONFIG,
  RESOURCE_SERVER_SIGNER_CONFIG,
} from "./schemas";
import {
  ensureNanoPrefix,
  priceNanoUnits as nanoUnits_,
  priceRawUnits as rawUnits_,
  validateNanoRpcUrl,
  validateNanoAccountPrivateKey,
  validateNanoWorkGenerationUrl,
  validateCustomWorkGenerator,
} from "./utils";
import {
  ERROR_SIGNER,
  ERROR_CONFIG,
  ERROR_BLOCK_GENERATION,
  ERROR_NANO_WORK_GENERATION,
  ERROR_NANO_RPC,
  ERROR_TEXT_RPCURL_NOT_FOUND,
  ONE_SECOND,
} from "./constants";

/**
 * One minute in milliseconds.
 */
const ONE_MINUTE: number = 60 * ONE_SECOND;

const SIGNER_TYPE_CLIENT = "SIGNER_TYPE_CLIENT";
const SIGNER_TYPE_RESOURCE_SERVER = "SIGNER_TYPE_RESOURCE_SERVER";
const SIGNER_TYPE_FACILITATOR = "SIGNER_TYPE_FACILITATOR";

/**
 * Makes an RPC call to a Nano node.
 *
 * @param params - The configuration object
 * @param params.url - The Nano RPC endpoint URL
 * @param params.headers - Header to send with the RPC call e.g. auth headers
 * @param params.action - The Nano RPC action to perform
 * @param params.params - The Nano RPC request parameters to accompany the action
 * @param [params.timeout=60000] - Request timeout in milliseconds
 * @param [params.isGeneratingWork=false] - Is this Nano RPC call for work generation?
 * @returns Promise resolving to the JSON response
 * @throws Error if the request fails or returns an error
 */
async function nanoRpcCall({
  url,
  headers,
  action,
  params,
  timeout = ONE_MINUTE,
  isGeneratingWork = false,
}: NanoRpcCallParams): Promise<NanoRpcCallJsonResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const CONTENT_TYPE_APPLICATION_JSON = { "Content-Type": "application/json" };

    const res = await fetch(url, {
      method: "POST",
      headers: { ...headers, ...CONTENT_TYPE_APPLICATION_JSON },
      signal: controller.signal,
      body: JSON.stringify({ action, ...params }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const json = (await res.json()) as NanoRpcCallJsonResponse;

    if (
      json.error &&
      action !==
        "block_info" /* block_info is allowed to return an error if a block doesn't exist */
    ) {
      throw new Error(json.error);
    }

    return json;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    throw new Error(
      `${isGeneratingWork ? ERROR_NANO_WORK_GENERATION : ERROR_NANO_RPC} - ${errorMessage}`,
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Generates Proof-of-Work nonce (work) for a given block.
 *
 * @param params - The configuration object
 * @param params.config - Signer configuration containing RPC URLs
 * @param params.block - Block to generate work for
 * @param params.network - Network to generate work for
 * @param params.workGenerator - Work generation function
 * @returns Promise resolving to the generated work
 * @throws Error if work generation fails or generated work is invalid
 */
async function workGenerateInternal({
  config,
  block,
  network,
  workGenerator,
}: WorkGenerateInternalParams): Promise<string> {
  let workGenerateResponse;

  if (workGenerator) {
    try {
      let work: WorkDifficultyString;
      work = await workGenerator({ block, network });
      return work;
    } catch (error) {
      throw new Error(
        `${ERROR_NANO_WORK_GENERATION} - Error during custom work generation` +
          (error instanceof Error ? `. Cause: ${error.message}` : ``),
      );
    }
  } else {
    try {
      workGenerateResponse = (await nanoRpcCall({
        url: config.workGenerationUrl!,
        headers: config.workGenerationApiKey
          ? { Authorization: `Bearer ${config.workGenerationApiKey}` }
          : undefined,
        action: "work_generate",
        params: {
          hash: block.previous,
          block,
          json_block: true,
        },
        timeout: 5 * ONE_MINUTE,
        isGeneratingWork: true,
      })) as NanoRpcCallWorkGenerateInternalResponse;

      let isWorkValid: boolean = verifyWork({
        hash: block.previous,
        work: workGenerateResponse.work,
        threshold: workGenerateResponse.difficulty,
      });

      if (isWorkValid) {
        return workGenerateResponse.work;
      }
    } catch (error) {
      throw new Error(
        `${ERROR_NANO_WORK_GENERATION} - Error during work generation` +
          (error instanceof Error ? `. Cause: ${error.message}` : ``),
      );
    }
  }

  throw new Error(`${ERROR_NANO_WORK_GENERATION} - Generated work is not valid`);
}

/**
 * Derives the account address from the configured private key.
 *
 * @param params - The configuration object
 * @param params.accountPrivateKey - Private key for Nano account
 * @returns The derived Nano account address
 */
function getAccount({ accountPrivateKey }: GetAccountParams) {
  if (!accountPrivateKey) {
    throw new Error(`${ERROR_CONFIG} - Private key not supplied in config`);
  }

  return deriveAccountFromPrivateKey({ privateKey: accountPrivateKey });
}

// ---------------------------------------------------

/**
 * Instantiate a Client Nano Signer
 *
 * @param config - Configuration for the signer
 * @returns Client Nano Signer
 */
export function createClientNanoSigner(config: ClientSignerConfig) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_CLIENT,
  });
}

/**
 * Instantiate a Resource Server Nano Signer
 *
 * @param config - Configuration for the signer
 * @returns Resource Server Nano Signer
 */
export function createResourceServerNanoSigner(config: ResourceServerSignerConfig) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_RESOURCE_SERVER,
  });
}

/**
 * Instantiate a Facilitator Nano Signer
 *
 * @param config - Configuration for the signer
 * @returns Facilitator Nano Signer
 */
export function createFacilitatorNanoSigner(config: FacilitatorSignerConfig) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_FACILITATOR,
  });
}

/**
 * Signer class.
 *
 * Provides utility methods for block creation, accessing Nano account information,
 * and Nano RPC communication required for x402 protocol operations.
 */
class Signer implements SignerClass {
  /**
   * Configuration for the signer instance.
   */
  public account: AccountString | undefined = undefined;
  private config: ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig = {};

  private beforeWorkGenerationHooks: BeforeWorkGenerationHook[] = [];
  private afterWorkGenerationHooks: AfterWorkGenerationHook[] = [];
  // private workGenerator: WorkGenerator | undefined;

  /**
   * Creates a new Signer instance.
   *
   * @param params - Constructor parameters
   * @param params.config - Configuration object for the Signer
   * @param params.signerType - Type of Signer (Client or Facilitator)
   */
  constructor({
    config,
    signerType,
  }: {
    config: ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig;
    signerType: string;
  }) {
    if (
      signerType !== SIGNER_TYPE_CLIENT &&
      signerType !== SIGNER_TYPE_RESOURCE_SERVER &&
      signerType !== SIGNER_TYPE_FACILITATOR
    ) {
      throw new Error(
        `${ERROR_SIGNER} - Use 'createClientNanoSigner', 'createResourceServerNanoSigner', or 'createFacilitatorNanoSigner' to create Nano signer`,
      );
    }

    if (signerType === SIGNER_TYPE_CLIENT) {
      let clientSignerConfigParsed;
      clientSignerConfigParsed = CLIENT_SIGNER_CONFIG.safeParse(config);

      if (!clientSignerConfigParsed.success) {
        throw new Error(`${ERROR_CONFIG} - Invalid config passed to Signer`);
      }

      this.config = clientSignerConfigParsed.data;

      if ("accountPrivateKey" in this.config) {
        this.account = getAccount({ accountPrivateKey: this.config.accountPrivateKey });
      }
      return;
    }

    if (signerType === SIGNER_TYPE_RESOURCE_SERVER) {
      let resourceServerSignerConfigParsed;
      resourceServerSignerConfigParsed = RESOURCE_SERVER_SIGNER_CONFIG.safeParse(config);

      if (!resourceServerSignerConfigParsed.success) {
        throw new Error(`${ERROR_CONFIG} - Invalid config passed to Signer`);
      }

      this.config = resourceServerSignerConfigParsed.data;

      return;
    }

    if (signerType === SIGNER_TYPE_FACILITATOR) {
      let facilitatorSignerConfigParsed;
      facilitatorSignerConfigParsed = FACILITATOR_SIGNER_CONFIG.safeParse(config);

      if (!facilitatorSignerConfigParsed.success) {
        throw new Error(`${ERROR_CONFIG} - Invalid config passed to Signer`);
      }

      this.config = facilitatorSignerConfigParsed.data;

      return;
    }
  }

  /**
   * Retrieves account information from the Nano node.
   *
   * @param params - The configuration object
   * @param params.account - The account address to query
   * @returns Promise resolving to account info (frontier, balance, representative, etc.)
   * @throws Error if RPC URL is invalid or request fails
   */
  async getAccountInfo({ account }: GetAccountInfoParams): Promise<AccountInfoSuccess> {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);

      return (await nanoRpcCall({
        url: this.config!.rpcUrl,
        headers: this.config?.rpcApiKey
          ? { Authorization: `Bearer ${this.config.rpcApiKey}` }
          : undefined,
        action: "account_info",
        params: {
          account,
          include_confirmed: "true",
          representative: "true",
        },
      })) as AccountInfoSuccess;
    }

    return Promise.reject(ERROR_TEXT_RPCURL_NOT_FOUND);
  }

  /**
   * Retrieves block information from the Nano node.
   *
   * @param params - The configuration object
   * @param params.hash - Hash of the block to retrive information for
   * @returns Promise resolving to block info
   * @throws Error if RPC URL is invalid or request fails
   */
  async getBlockInfo({ hash }: GetBlockInfoParams): Promise<BlockInfoSuccess> {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);

      return (await nanoRpcCall({
        url: this.config!.rpcUrl,
        headers: this.config?.rpcApiKey
          ? { Authorization: `Bearer ${this.config?.rpcApiKey}` }
          : undefined,
        action: "block_info",
        params: {
          hash,
          json_block: "true",
        },
      })) as BlockInfoSuccess;
    }

    return Promise.reject(ERROR_TEXT_RPCURL_NOT_FOUND);
  }

  /**
   * Generates a signed Nano send block for a payment transaction.
   *
   * @param params - Parameters including amount and destination address (payTo)
   * @returns Promise resolving to the generated send block
   * @throws Error if configuration is invalid, account is unopened, or balance is insufficient
   */
  async generateSendBlock(params: GenerateSendBlockParams): Promise<StateBlock> {
    const clientSignerConfig = this.config as z.infer<typeof CLIENT_SIGNER_CONFIG>;

    validateNanoAccountPrivateKey(clientSignerConfig.accountPrivateKey);
    validateNanoRpcUrl(clientSignerConfig.rpcUrl);

    if (!params.skipWorkGeneration && !clientSignerConfig.workGenerator) {
      validateNanoWorkGenerationUrl(clientSignerConfig.workGenerationUrl);
    }

    let sourceAccount;
    sourceAccount = getAccount({ accountPrivateKey: clientSignerConfig.accountPrivateKey });
    let sourceAccountInfo = (await this.getAccountInfo({
      account: sourceAccount!,
    })) as AccountInfoSuccess;

    let sourceAccountFrontierBlockInfo = (await this.getBlockInfo({
      hash: sourceAccountInfo.frontier,
    })) as BlockInfoSuccess;

    if (!sourceAccountInfo.frontier) {
      throw new Error(
        `${ERROR_BLOCK_GENERATION} - Source account has no frontier (unopened account)`,
      );
    }

    let block: StateBlock;

    block = createSendBlock({
      amount: params.amount,
      destination: params.payTo,
      frontierBlock: sourceAccountFrontierBlockInfo.contents,
      privateKey: clientSignerConfig.accountPrivateKey,
      representative: sourceAccountFrontierBlockInfo.contents.representative,
    });

    if (!params.skipWorkGeneration) {
      block.work = await this.generateWork({ block, network: params.network });
    }

    block.account = ensureNanoPrefix(block.account);
    block.link_as_account = ensureNanoPrefix(block.link_as_account);

    return block;
  }

  /**
   * Generates work for a signed Nano send block.
   *
   * @param params - Parameters object
   * @param params.block - The block to generate work for
   * @param params.network - The Nano network being used
   * @returns Promise resolving to the generated work
   * @throws Error if something goes wrong during work generation
   */
  async generateWork({ block, network }: GenerateWorkParams): Promise<string> {
    const context: WorkGenerationHookContext = {
      hash: block.previous,
    };

    // Execute beforeWorkGenerationHooks hooks
    for (const beforeWorkGenerationHook of this.beforeWorkGenerationHooks) {
      await (beforeWorkGenerationHook as BeforeWorkGenerationHook)(context);
    }

    let work = await workGenerateInternal({
      config: this.config,
      block,
      network,
      workGenerator: this.config.workGenerator,
    });

    // Execute afterWorkGenerationHooks hooks
    for (const afterWorkGenerationHook of this.afterWorkGenerationHooks) {
      await (afterWorkGenerationHook as AfterWorkGenerationHook)(Object.assign(context, { work }));
    }

    return work;
  }

  /**
   * Submits a block to the Nano network for processing.
   *
   * @param params - The configuration object
   * @param params.block - The block to process
   * @returns Promise resolving to the processing result containing transaction hash
   * @throws Error if RPC call fails
   */
  async processBlock({ block }: ProcessBlockParams): Promise<ProcessBlockSuccess> {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);

      return (await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config.rpcApiKey
          ? { Authorization: `Bearer ${this.config.rpcApiKey}` }
          : undefined,
        action: "process",
        params: {
          json_block: "true",
          subtype: "send",
          block,
        },
      })) as ProcessBlockSuccess;
    }

    return Promise.reject(ERROR_TEXT_RPCURL_NOT_FOUND);
  }

  /**
   * Sets a custom work generator.
   *
   * @param workGenerator - Work generator function
   * @throws Error if the work generation function is not valid
   */
  setCustomWorkGenerator(workGenerator: WorkGenerator) {
    validateCustomWorkGenerator(workGenerator);

    this.config.workGenerator = workGenerator;
  }

  /**
   * Sets a hook that will be called before work generation takes place.
   *
   * @param hook - Hook function that will be called
   * @returns The current Signer class instance
   * @throws Error if the hook function itself throws an Error
   */
  onBeforeWorkGeneration(hook: BeforeWorkGenerationHook): SignerClass {
    this.beforeWorkGenerationHooks.push(hook);
    return this;
  }

  /**
   * Sets a hook that will be called after work generation takes place.
   *
   * @param hook - Hook function that will be called
   * @returns The current Signer class instance
   * @throws Error if the hook function itself throws an Error
   */
  onAfterWorkGeneration(hook: AfterWorkGenerationHook): SignerClass {
    this.afterWorkGenerationHooks.push(hook);
    return this;
  }

  /**
   * Returns the current configuration values (without account private key for security purposes).
   *
   * @returns Current configuration values (without account private key)
   */
  getConfig(): ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig {
    let config_ = { ...this.config } as
      | ClientSignerConfig
      | ResourceServerSignerConfig
      | FacilitatorSignerConfig;
    if ("accountPrivateKey" in config_!) {
      config_.accountPrivateKey = "";
    }
    return { ...config_, workGenerator: this.config.workGenerator };
  }
}

// Re-export some utility functions from the utils file
export const priceRawUnits = rawUnits_;
export const priceNanoUnits = nanoUnits_;
