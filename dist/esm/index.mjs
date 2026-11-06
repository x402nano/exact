import {
  ExactNanoScheme
} from "./chunk-I4PM46R4.mjs";
import {
  ExactNanoScheme as ExactNanoScheme2
} from "./chunk-2KBYIKPP.mjs";
import {
  ExactNanoScheme as ExactNanoScheme3
} from "./chunk-IDR6XYTU.mjs";
import {
  CLIENT_NO_WORK,
  CLIENT_SIGNER_CONFIG,
  CURRENCY_CODE_XNO,
  DEFAULT_MAX_TIMEOUT_SECONDS,
  DEPRECATION_NOTICE,
  ERROR_ACCOUNT_NOT_FOUND,
  ERROR_AMOUNT_MISMATCH,
  ERROR_BLOCK_ALREADY_CONFIRMED,
  ERROR_BLOCK_AWAITING_CONFIRMATION,
  ERROR_BLOCK_GENERATION,
  ERROR_BLOCK_NOT_BROADCAST,
  ERROR_CONFIG,
  ERROR_FACILITATOR,
  ERROR_FRONTIER_NOT_CONFIRMED,
  ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK,
  ERROR_INVALID_WORK,
  ERROR_NANO_RPC,
  ERROR_NANO_WORK_GENERATION,
  ERROR_NETWORK_MISMATCH,
  ERROR_NOT_ENOUGH_BALANCE,
  ERROR_NO_ACCOUNT_FRONTIER,
  ERROR_PAYTO_LINK_MISMATCH,
  ERROR_PREVIOUS_NOT_FRONTIER,
  ERROR_PRICE,
  ERROR_RAW_AMOUNT,
  ERROR_SIGNER,
  ERROR_TEXT_RPCURL_NOT_FOUND,
  ERROR_TIMEOUT_EXPIRED,
  ERROR_UNSUPPORTED_NETWORK,
  ERROR_UNSUPPORTED_SCHEME,
  ERROR_UNSUPPORTED_X402_VERSION,
  ERROR_WORK_UNAVAILABLE,
  FACILITATOR_SIGNER_CONFIG,
  NANO_BETANET_CAIP2,
  NANO_MAINNET_CAIP2,
  NANO_PREFIX,
  NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2,
  ONE_SECOND,
  RESOURCE_SERVER_SIGNER_CONFIG,
  SEND_BLOCK_WORK_THRESHOLD_BETANET,
  SEND_BLOCK_WORK_THRESHOLD_MAINNET,
  SUPPORTED_NANO_NETWORKS,
  XRB_PREFIX,
  deriveAccountFromPrivateKey,
  ensureNanoPrefix,
  fromHelperConfig,
  priceNanoUnits,
  priceRawUnits,
  validateCustomWorkGenerator,
  validateNanoAccountPrivateKey,
  validateNanoRpcUrl,
  validateNanoWorkGenerationUrl
} from "./chunk-PAVQFMWI.mjs";
import {
  __publicField
} from "./chunk-NSSMTXJJ.mjs";

// src/typescript/signer.ts
import { createSendBlock } from "nano-sdk/blocks";
import { verifyWork, deriveAccountFromPrivateKey as deriveAccountFromPrivateKey2 } from "nano-sdk/crypto";
var ONE_MINUTE = 60 * ONE_SECOND;
var SIGNER_TYPE_CLIENT = "SIGNER_TYPE_CLIENT";
var SIGNER_TYPE_RESOURCE_SERVER = "SIGNER_TYPE_RESOURCE_SERVER";
var SIGNER_TYPE_FACILITATOR = "SIGNER_TYPE_FACILITATOR";
async function nanoRpcCall({
  url,
  headers,
  action,
  params,
  timeout = ONE_MINUTE,
  isGeneratingWork = false
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const CONTENT_TYPE_APPLICATION_JSON = { "Content-Type": "application/json" };
    const res = await fetch(url, {
      method: "POST",
      headers: { ...headers, ...CONTENT_TYPE_APPLICATION_JSON },
      signal: controller.signal,
      body: JSON.stringify({ action, ...params })
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const json = await res.json();
    if (json.error && action !== "block_info") {
      throw new Error(json.error);
    }
    return json;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${isGeneratingWork ? ERROR_NANO_WORK_GENERATION : ERROR_NANO_RPC} - ${errorMessage}`
    );
  } finally {
    clearTimeout(timer);
  }
}
async function workGenerateInternal({
  config,
  block,
  network,
  workGenerator
}) {
  let workGenerateResponse;
  if (workGenerator) {
    try {
      let work;
      work = await workGenerator({ block, network });
      return work;
    } catch (error) {
      throw new Error(
        `${ERROR_NANO_WORK_GENERATION} - Error during custom work generation` + (error instanceof Error ? `. Cause: ${error.message}` : ``)
      );
    }
  } else {
    try {
      workGenerateResponse = await nanoRpcCall({
        url: config.workGenerationUrl,
        headers: config.workGenerationApiKey ? { Authorization: `Bearer ${config.workGenerationApiKey}` } : void 0,
        action: "work_generate",
        params: {
          hash: block.previous,
          block,
          json_block: true
        },
        timeout: 5 * ONE_MINUTE,
        isGeneratingWork: true
      });
      let isWorkValid = verifyWork({
        hash: block.previous,
        work: workGenerateResponse.work,
        threshold: workGenerateResponse.difficulty
      });
      if (isWorkValid) {
        return workGenerateResponse.work;
      }
    } catch (error) {
      throw new Error(
        `${ERROR_NANO_WORK_GENERATION} - Error during work generation` + (error instanceof Error ? `. Cause: ${error.message}` : ``)
      );
    }
  }
  throw new Error(`${ERROR_NANO_WORK_GENERATION} - Generated work is not valid`);
}
function getAccount({ accountPrivateKey }) {
  if (!accountPrivateKey) {
    throw new Error(`${ERROR_CONFIG} - Private key not supplied in config`);
  }
  return deriveAccountFromPrivateKey2({ privateKey: accountPrivateKey });
}
function createClientNanoSigner(config) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_CLIENT
  });
}
function createResourceServerNanoSigner(config) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_RESOURCE_SERVER
  });
}
function createFacilitatorNanoSigner(config) {
  return new Signer({
    config,
    signerType: SIGNER_TYPE_FACILITATOR
  });
}
var Signer = class {
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
    signerType
  }) {
    /**
     * Configuration for the signer instance.
     */
    __publicField(this, "account");
    __publicField(this, "config", {});
    __publicField(this, "beforeWorkGenerationHooks", []);
    __publicField(this, "afterWorkGenerationHooks", []);
    if (signerType !== SIGNER_TYPE_CLIENT && signerType !== SIGNER_TYPE_RESOURCE_SERVER && signerType !== SIGNER_TYPE_FACILITATOR) {
      throw new Error(
        `${ERROR_SIGNER} - Use 'createClientNanoSigner', 'createResourceServerNanoSigner', or 'createFacilitatorNanoSigner' to create Nano signer`
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
  async getAccountInfo({ account }) {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);
      return await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config?.rpcApiKey ? { Authorization: `Bearer ${this.config.rpcApiKey}` } : void 0,
        action: "account_info",
        params: {
          account,
          include_confirmed: "true",
          representative: "true"
        }
      });
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
  async getBlockInfo({ hash }) {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);
      return await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config?.rpcApiKey ? { Authorization: `Bearer ${this.config?.rpcApiKey}` } : void 0,
        action: "block_info",
        params: {
          hash,
          json_block: "true"
        }
      });
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
  async generateSendBlock(params) {
    const clientSignerConfig = this.config;
    validateNanoAccountPrivateKey(clientSignerConfig.accountPrivateKey);
    validateNanoRpcUrl(clientSignerConfig.rpcUrl);
    if (!params.skipWorkGeneration && !clientSignerConfig.workGenerator) {
      validateNanoWorkGenerationUrl(clientSignerConfig.workGenerationUrl);
    }
    let sourceAccount;
    sourceAccount = getAccount({ accountPrivateKey: clientSignerConfig.accountPrivateKey });
    let sourceAccountInfo = await this.getAccountInfo({
      account: sourceAccount
    });
    let sourceAccountFrontierBlockInfo = await this.getBlockInfo({
      hash: sourceAccountInfo.frontier
    });
    if (!sourceAccountInfo.frontier) {
      throw new Error(
        `${ERROR_BLOCK_GENERATION} - Source account has no frontier (unopened account)`
      );
    }
    let block;
    block = createSendBlock({
      amount: params.amount,
      destination: params.payTo,
      frontierBlock: sourceAccountFrontierBlockInfo.contents,
      privateKey: clientSignerConfig.accountPrivateKey,
      representative: sourceAccountFrontierBlockInfo.contents.representative
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
  async generateWork({ block, network }) {
    const context = {
      hash: block.previous
    };
    for (const beforeWorkGenerationHook of this.beforeWorkGenerationHooks) {
      await beforeWorkGenerationHook(context);
    }
    let work = await workGenerateInternal({
      config: this.config,
      block,
      network,
      workGenerator: this.config.workGenerator
    });
    for (const afterWorkGenerationHook of this.afterWorkGenerationHooks) {
      await afterWorkGenerationHook(Object.assign(context, { work }));
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
  async processBlock({ block }) {
    if ("rpcUrl" in this.config) {
      validateNanoRpcUrl(this.config?.rpcUrl);
      return await nanoRpcCall({
        url: this.config.rpcUrl,
        headers: this.config.rpcApiKey ? { Authorization: `Bearer ${this.config.rpcApiKey}` } : void 0,
        action: "process",
        params: {
          json_block: "true",
          subtype: "send",
          block
        }
      });
    }
    return Promise.reject(ERROR_TEXT_RPCURL_NOT_FOUND);
  }
  /**
   * Sets a custom work generator.
   *
   * @param workGenerator - Work generator function
   * @throws Error if the work generation function is not valid
   */
  setCustomWorkGenerator(workGenerator) {
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
  onBeforeWorkGeneration(hook) {
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
  onAfterWorkGeneration(hook) {
    this.afterWorkGenerationHooks.push(hook);
    return this;
  }
  /**
   * Returns the current configuration values (without account private key for security purposes).
   *
   * @returns Current configuration values (without account private key)
   */
  getConfig() {
    let config_ = { ...this.config };
    if ("accountPrivateKey" in config_) {
      config_.accountPrivateKey = "";
    }
    return { ...config_, workGenerator: this.config.workGenerator };
  }
};
var priceRawUnits2 = priceRawUnits;
var priceNanoUnits2 = priceNanoUnits;
export {
  CLIENT_NO_WORK,
  CURRENCY_CODE_XNO,
  DEFAULT_MAX_TIMEOUT_SECONDS,
  DEPRECATION_NOTICE,
  ERROR_ACCOUNT_NOT_FOUND,
  ERROR_AMOUNT_MISMATCH,
  ERROR_BLOCK_ALREADY_CONFIRMED,
  ERROR_BLOCK_AWAITING_CONFIRMATION,
  ERROR_BLOCK_GENERATION,
  ERROR_BLOCK_NOT_BROADCAST,
  ERROR_CONFIG,
  ERROR_FACILITATOR,
  ERROR_FRONTIER_NOT_CONFIRMED,
  ERROR_INVALID_ASSET,
  ERROR_INVALID_BLOCK,
  ERROR_INVALID_WORK,
  ERROR_NANO_RPC,
  ERROR_NANO_WORK_GENERATION,
  ERROR_NETWORK_MISMATCH,
  ERROR_NOT_ENOUGH_BALANCE,
  ERROR_NO_ACCOUNT_FRONTIER,
  ERROR_PAYTO_LINK_MISMATCH,
  ERROR_PREVIOUS_NOT_FRONTIER,
  ERROR_PRICE,
  ERROR_RAW_AMOUNT,
  ERROR_SIGNER,
  ERROR_TEXT_RPCURL_NOT_FOUND,
  ERROR_TIMEOUT_EXPIRED,
  ERROR_UNSUPPORTED_NETWORK,
  ERROR_UNSUPPORTED_SCHEME,
  ERROR_UNSUPPORTED_X402_VERSION,
  ERROR_WORK_UNAVAILABLE,
  ExactNanoScheme as ExactNanoClientScheme,
  ExactNanoScheme3 as ExactNanoFacilitatorScheme,
  ExactNanoScheme,
  ExactNanoScheme2 as ExactNanoServerScheme,
  NANO_BETANET_CAIP2,
  NANO_MAINNET_CAIP2,
  NANO_PREFIX,
  NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2,
  ONE_SECOND,
  SEND_BLOCK_WORK_THRESHOLD_BETANET,
  SEND_BLOCK_WORK_THRESHOLD_MAINNET,
  SUPPORTED_NANO_NETWORKS,
  XRB_PREFIX,
  createClientNanoSigner,
  createFacilitatorNanoSigner,
  createResourceServerNanoSigner,
  deriveAccountFromPrivateKey,
  fromHelperConfig,
  priceNanoUnits2 as priceNanoUnits,
  priceRawUnits2 as priceRawUnits
};
//# sourceMappingURL=index.mjs.map