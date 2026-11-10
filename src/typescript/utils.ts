import { AssetAmount, Price } from "@x402/core/types";
import BigNumber from "bignumber.js";
import { nanoToRaw } from "nano-sdk/math";
import { deriveAccountFromPrivateKey as deriveAccountFromPrivateKey_ } from "nano-sdk/crypto";
import { RawAmountString, NanoAmountString, AccountString, PrivateKeyString } from "nano-sdk/types";
import {
  ClientSignerConfig,
  FacilitatorSignerConfig,
  ResourceServerSignerConfig,
  HelperConfigDeprecated,
  WorkGenerator,
} from "./types";
import { STRING_DECIMAL, URL, WORK_GENERATOR } from "./schemas";
import {
  XRB_PREFIX,
  NANO_PREFIX,
  CURRENCY_CODE_XNO,
  ERROR_PRICE,
  ERROR_CONFIG,
  ERROR_NANO_WORK_GENERATION,
  ERROR_TEXT_RPCURL_NOT_FOUND,
} from "./constants";

/**
 * Ensure that a Nano account has a "nano_" prefix, not the legacy "xrb_" prefix
 *
 * @param nanoAccount - The Nano account to check
 * @returns Nano account with a "nano_" prefix
 */
export function ensureNanoPrefix(nanoAccount: AccountString): AccountString {
  return nanoAccount.replace(XRB_PREFIX, NANO_PREFIX);
}

/**
 * Create an AssetAmount object for nano unit amounts. Used to populate the 'price' field in a Payment Requirement
 *
 * @param amount - Amount in nano units
 * @param extra - Extra object (optional)
 * @returns AssetAmount object
 */
export function priceNanoUnits(
  amount: string | number,
  extra: Record<string, unknown> | undefined = {},
): AssetAmount {
  let stringAmount: string = parseAmountToString(amount);

  if (stringAmount.startsWith(".")) {
    stringAmount = "0" + stringAmount;
  }

  return {
    asset: CURRENCY_CODE_XNO,
    amount: nanoToRaw({ nano: stringAmount }),
    extra,
  };
}

/**
 * Create an AssetAmount object for raw unit amounts. Used to populate the 'price' field in a Payment Requirement
 *
 * @param amount - Amount in raw units
 * @param extra - Extra object (optional)
 * @returns AssetAmount object
 */
export function priceRawUnits(
  amount: RawAmountString | Price,
  extra: Record<string, unknown> | undefined = {},
): AssetAmount {
  const stringAmount: string = parseAmountToString(amount);

  if (stringAmount.includes(".")) {
    throw new Error(
      `${ERROR_PRICE} - Nano unit amount passed to 'priceRawUnits'. Please provide raw units.`,
    );
  }

  return {
    asset: CURRENCY_CODE_XNO,
    amount: parseAmountToString(amount),
    extra,
  };
}

/**
 * Handles conversion of raw or nano unit amount to a string
 *
 * @param amount - Amount in raw units (e.g. 1000000000000000000000000000) or nano units (e.g. 0.001)
 * @returns string representation of amount
 *
 * @example
 * ```ts
 * const rawString = parseAmountToString(1000000000000000000000000000) // returns "1000000000000000000000000000"
 * const nanoString = parseAmountToString(0.001) // returns "0.001"
 * ```
 */
export function parseAmountToString(amount: string | number | unknown) {
  if (typeof amount === "string") {
    const amount_ = amount.trim();

    try {
      if (STRING_DECIMAL.safeParse(amount_).success) {
        return amount_;
      }
      return BigNumber(amount_).toFixed();
    } catch (error) {
      void error;
      return amount_;
    }
  }

  if (typeof amount === "number") {
    return BigNumber(amount).toFixed();
  }

  return String(amount);
}

/**
 * Determines if a Nano amount is represented as raw units
 *
 * @param amount - Nano amount
 * @returns True if raw units, false if not
 */
export function isRawUnits(amount: unknown): boolean {
  return RawAmountString().safeParse(amount).success;
}

/**
 * Determines if a Nano amount is represented as nano units
 *
 * @param amount - Nano amount
 * @returns True if nano units, false if not
 */
export function isNanoUnits(amount: unknown): boolean {
  return NanoAmountString().safeParse(amount).success;
}

/**
 * Converts a nano amount to its raw unit equivalent.
 *
 * @param amount - The amount in Nano (string representation)
 * @returns The equivalent amount in raw units as a string
 *
 * @example
 * ```ts
 * const raw = convertNanoToRaw("1.5") // Converts 1.5 Nano to raw
 * ```
 */
export function convertNanoToRaw(amount: NanoAmountString): RawAmountString {
  // if price is in nano units then convert to raw units
  return nanoToRaw({ nano: amount });
}

/**
 * Validates a Nano RPC URL.
 *
 * @param rpcUrl - Nano RPC Url
 * @param bypassNullCheck - Whether to skip null/undefined check
 * @returns True if Nano RPC URL is validated
 * @throws Error if URL is invalid or empty (unless bypassNullCheck is true)
 */
export function validateNanoRpcUrl(rpcUrl: string, bypassNullCheck: boolean = false) {
  if (!bypassNullCheck) {
    if (!rpcUrl) {
      throw new Error(`${ERROR_CONFIG} - Configuration missing: 'rpcUrl'`);
    }

    if (!URL.safeParse(rpcUrl).success) {
      throw new Error(ERROR_TEXT_RPCURL_NOT_FOUND);
    }
  }

  return true;
}

/**
 * Validates a Nano work generation URL. Checks URL format only, does not generate any work.
 *
 * @param workGenerationUrl - Work generation URL
 * @param bypassNullCheck - Whether to skip null/undefined check
 * @returns True if Nano work generation URL is validated
 * @throws Error if URL is invalid or empty (unless bypassNullCheck is true)
 */
export function validateNanoWorkGenerationUrl(
  workGenerationUrl: string | undefined,
  bypassNullCheck: boolean = false,
) {
  if (!bypassNullCheck) {
    if (!URL.safeParse(workGenerationUrl).success) {
      throw new Error(`${ERROR_CONFIG} - 'workGenerationUrl' is not a valid URL`);
    }
  }

  return true;
}

/**
 * Validates a Nano account private key. Checks format only, not if account exists on Nano network
 *
 * @param accountPrivateKey - Nano account private key
 * @param bypassNullCheck - Whether to skip null/undefined check
 * @returns True if private key is validated
 * @throws Error if private key is invalid or empty (unless bypassNullCheck is true)
 */
export function validateNanoAccountPrivateKey(
  accountPrivateKey: PrivateKeyString,
  bypassNullCheck: boolean = false,
) {
  if (!bypassNullCheck) {
    if (!accountPrivateKey) {
      throw new Error(`${ERROR_CONFIG} - accountPrivateKey is not set`);
    }

    if (!PrivateKeyString().safeParse(accountPrivateKey).success) {
      throw new Error(
        `${ERROR_CONFIG} - accountPrivateKey is not of a valid format (should be 64 hexadecimal characters)`,
      );
    }
  }

  return true;
}

/**
 * Validates the custom work generation function.
 *
 * @param workGenerator - Work generation function
 * @returns True if custom work generation function is validated
 * @throws Error if the work generation function is invalid
 */
export function validateCustomWorkGenerator(workGenerator: WorkGenerator) {
  if (!WORK_GENERATOR.safeParse(workGenerator).success) {
    throw new Error(
      `${ERROR_NANO_WORK_GENERATION} - Custom work generation function is not valid.`,
    );
  }

  return true;
}

/**
 * Derive a Nano account (nano_...) from its private key
 *
 * @param privateKey - Private key to derive Nano account from
 * @returns Nano account (nano_...)
 */
export function deriveAccountFromPrivateKey(privateKey: PrivateKeyString): AccountString {
  return deriveAccountFromPrivateKey_({ privateKey });
}

/**
 * Converts the deprecated Helper config shape into the newer Signer equivalent
 *
 * @param helperConfig - Helper config shape
 * @returns Signer config shape
 */
export function fromHelperConfig(
  helperConfig: HelperConfigDeprecated,
): ClientSignerConfig | ResourceServerSignerConfig | FacilitatorSignerConfig {
  let config: Record<string, string> = {};

  if (helperConfig.NANO_ACCOUNT_PRIVATE_KEY) {
    config.accountPrivateKey = helperConfig.NANO_ACCOUNT_PRIVATE_KEY;
  }

  if (helperConfig.NANO_RPC_URL) {
    config.rpcUrl = helperConfig.NANO_RPC_URL;
  }

  if (helperConfig.NANO_WORK_GENERATION_URL) {
    config.workGenerationUrl = helperConfig.NANO_WORK_GENERATION_URL;
  }

  return config;
}
