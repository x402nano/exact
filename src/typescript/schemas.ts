import * as z from "zod";
import {
  AccountString,
  HashString,
  PrivateKeyString,
  RawAmountString,
  SubtypeString,
  Timestamp,
  WorkDifficultyString,
  WorkString,
} from "nano-sdk/types";
import { StateBlock } from "nano-sdk/blocks";

import { CURRENCY_CODE_XNO, ERROR_RAW_AMOUNT } from "./constants";
import { isRawUnits, convertNanoToRaw } from "./utils";

/**
 * Validates a string that contains only digits (non-negative integer).
 */
export const STRING_INT = z.string().regex(/^\d+$/);

/**
 * Validates a string that represents a decimal number.
 */
export const STRING_DECIMAL = z.string().regex(/^\d*\.\d+$/);

/**
 * Validates a URL string using Zod's built-in URL validation.
 */
export const URL = z.url();

/**
 * Validates HTTP headers
 */
export const HEADERS = z.record(z.string(), z.string()).default({});

/**
 * Schema for function passed to custom work generator.
 */
export const WORK_GENERATOR = z.function({
  input: [
    z.object({
      block: z.lazy(() => StateBlock()),
      network: z.templateLiteral([z.string(), z.literal(`:`), z.string()]).optional(),
    }),
  ],
  output: z.promise(z.lazy(() => WorkString())),
});

/**
 * Schema for successful account information response from Nano node.
 */
export const ACCOUNT_INFO_SUCCESS = z.object({
  frontier: HashString(),
  open_block: HashString(),
  representative_block: HashString(),
  representative: AccountString(),
  balance: RawAmountString(),
  modified_timestamp: Timestamp,
  block_count: STRING_INT,
  account_version: STRING_INT,
  confirmed_balance: RawAmountString(),
  confirmed_height: STRING_INT,
  confirmed_frontier: HashString(),
  confirmed_representative: AccountString(),
});

/**
 * Schema for successful block information response from Nano node.
 */
export const BLOCK_INFO_SUCCESS = z.object({
  block_account: AccountString(),
  amount: RawAmountString(),
  balance: RawAmountString(),
  height: STRING_INT,
  local_timestamp: STRING_INT,
  successor: HashString(),
  confirmed: z.union([z.literal("true"), z.literal("false")]),
  contents: StateBlock(),
  subtype: SubtypeString(),
});

const BASE_CONFIG = {
  workGenerator: WORK_GENERATOR.optional(),
};

const RPC_CONFIG = {
  rpcUrl: URL,
  rpcApiKey: z.string().optional(),
};

const WORK_GENERATION_CONFIG = {
  workGenerationUrl: URL.optional(),
  workGenerationApiKey: z.string().optional(),
};

/**
 * Configuration schema for the Client Signer class.
 */
export const CLIENT_SIGNER_CONFIG = z
  .object({
    accountPrivateKey: PrivateKeyString(),
    ...RPC_CONFIG,
    ...WORK_GENERATION_CONFIG,
    ...BASE_CONFIG,
  })
  .strict();

/**
 * Configuration schema for the Resource Signer class.
 */
export const RESOURCE_SERVER_SIGNER_CONFIG = z
  .object({ ...WORK_GENERATION_CONFIG, ...BASE_CONFIG })
  .strict();

/**
 * Configuration schema for the Facilitator Signer class.
 */
export const FACILITATOR_SIGNER_CONFIG = z
  .object({
    ...RPC_CONFIG,
    ...WORK_GENERATION_CONFIG,
    ...BASE_CONFIG,
  })
  .strict();

/**
 * Configuration schema for the deprecated x402 Nano Helper class.
 */
export const HELPER_CONFIG_DEPRECATED = z.object({
  NANO_RPC_URL: URL.optional(),
  NANO_WORK_GENERATION_URL: URL.optional(),
  NANO_ACCOUNT_PRIVATE_KEY: HashString().optional(),
});

/**
 * Schema for successful Nano block processing response.
 */
export const PROCESS_BLOCK_SUCCESS = z.object({
  hash: HashString(),
});

/**
 * Schema for Nano RPC error response.
 */
export const NANO_RPC_ERROR = z.object({
  error: z.string(),
});

/**
 * Schema for Nano RPC work generation response.
 */
export const NANO_RPC_CALL_WORK_GENERATE_INTERNAL_RESPONSE = z.object({
  work: WorkString(),
  difficulty: WorkDifficultyString(),
  multiplier: z.string(),
  hash: HashString(),
});

/**
 * Schema for Exact Nano payment payload.
 */
export const EXACT_NANO_PAYLOAD = z.object({
  block: StateBlock(),
});

/**
 * Schema for AssetAmount with asset code, amount, and optional extra metadata.
 */
export const ASSET_AMOUNT = z
  .object({
    asset: z.literal(CURRENCY_CODE_XNO),
    amount: RawAmountString(),
    extra: z.object().optional(),
  })
  .strict()
  .refine(
    data => {
      const rawAmount = isRawUnits(data.amount) ? data.amount : convertNanoToRaw(data.amount);
      return RawAmountString().safeParse(rawAmount).success;
    },
    {
      message: ERROR_RAW_AMOUNT,
      path: ["amount"], // Pinpoints the error to the amount field
    },
  )
  .transform(data => {
    return {
      ...data,
      amount: isRawUnits(data.amount) ? data.amount : convertNanoToRaw(data.amount),
    };
  });
