import { WorkDifficultyString } from "nano-sdk/types";

/**
 * CAIP-2 network identifier for Nano Mainnet.
 */
export const NANO_MAINNET_CAIP2 = "nano:mainnet";

/**
 * CAIP-2 network identifier for Nano Betanet.
 */
export const NANO_BETANET_CAIP2 = "nano:betanet";

/**
 * CAIP-2 network identifier for Nano Testnet.
 */
export const NANO_TESTNET_CAIP2 = "nano:testnet";

/**
 * CAIP-2 network identifier for all Nano networks.
 */
export const NANO_WILDCARD_CAIP2 = "nano:*";

/**
 * Proof-of-Work difficulty threshold required for valid send blocks on Nano Mainnet.
 * This values ensures send blocks meet the minimum difficulty requirements on mainnet.
 */
export const SEND_BLOCK_WORK_THRESHOLD_MAINNET: WorkDifficultyString = "fffffff800000000";

/**
 * Proof-of-Work difficulty threshold required for valid send blocks on Nano Betanet.
 * This values ensures send blocks meet the minimum difficulty requirements on betanet.
 */
export const SEND_BLOCK_WORK_THRESHOLD_BETANET: WorkDifficultyString = "fffff00000000000";

/**
 * Supported Nano CAIP-2 networks for this mechanism.
 */
export const SUPPORTED_NANO_NETWORKS = [
  NANO_MAINNET_CAIP2,
  NANO_BETANET_CAIP2,
  NANO_TESTNET_CAIP2,
  NANO_WILDCARD_CAIP2,
] as const;

/**
 * Error codes used throughout the ExactNanoScheme implementation.
 */
export const ERROR_SIGNER = "error_signer";
export const ERROR_CONFIG = "error_config";
export const ERROR_BLOCK_GENERATION = "error_block_generation";
export const ERROR_NANO_WORK_GENERATION = "error_nano_work_generation";
export const ERROR_NANO_RPC = "error_nano_rpc";
export const ERROR_PRICE = "error_price";
export const ERROR_RAW_AMOUNT = "error_raw_amount";

// Facilitator-specific error codes
export const ERROR_UNSUPPORTED_X402_VERSION: string = "error_x402_version_not_supported";
export const ERROR_UNSUPPORTED_NETWORK: string = "error_unsupported_network";
export const ERROR_NETWORK_MISMATCH: string = "error_network_mismatch";
export const ERROR_UNSUPPORTED_SCHEME: string = "error_unsupported_scheme";
export const ERROR_INVALID_ASSET: string = "error_invalid_asset";
export const ERROR_INVALID_BLOCK: string = "error_invalid_block";
export const ERROR_PAYTO_LINK_MISMATCH: string = "error_payto_link_mismatch";
export const ERROR_NO_ACCOUNT_FRONTIER: string = "error_no_account_frontier";
export const ERROR_PREVIOUS_NOT_FRONTIER: string = "error_previous_not_frontier";
export const ERROR_NOT_ENOUGH_BALANCE: string = "error_not_enough_balance";
export const ERROR_AMOUNT_MISMATCH: string = "error_amount_mismatch";
export const ERROR_INVALID_WORK: string = "error_invalid_work";
export const ERROR_TIMEOUT_EXPIRED: string = "error_timeout_expired";
export const ERROR_ACCOUNT_NOT_FOUND: string = "error_account_not_found";
export const ERROR_BLOCK_ALREADY_CONFIRMED: string = "error_block_already_confirmed";
export const ERROR_BLOCK_AWAITING_CONFIRMATION: string = "error_block_awaiting_confirmation";
export const ERROR_BLOCK_NOT_BROADCAST: string = "error_block_not_broadcast";
export const ERROR_WORK_UNAVAILABLE: string = "error_work_unavailable";
export const ERROR_FACILITATOR: string = "error_facilitator";

export const ERROR_TEXT_RPCURL_NOT_FOUND = `${ERROR_CONFIG} - 'rpcUrl' not specified`;

export const DEPRECATION_NOTICE = "DEPRECATION";

export const CURRENCY_CODE_XNO = "XNO";

/**
 * Current Nano address prefix.
 */
export const NANO_PREFIX: string = "nano_";

/**
 * Legacy Nano address prefix.
 */
export const XRB_PREFIX: string = "xrb_";

/**
 * Used by Client to signal that it wants work generated for its send block.
 */
export const CLIENT_NO_WORK: string = "0000000000000000";

/**
 * Default number of seconds before a transaction attempt is considered timed out.
 */
export const DEFAULT_MAX_TIMEOUT_SECONDS = 60;

/**
 * One second in milliseconds.
 */
export const ONE_SECOND = 1000;
