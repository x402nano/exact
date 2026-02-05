// ../typescript-common/dist/esm/index.mjs
import * as z from "zod";
var STRING_INT = z.string().regex(/^\d+$/);
var STRING_DECIMAL = z.string().regex(/^\d*\.\d+$/);
var URL = z.url();
var HEX_64 = z.string().length(64).regex(/^[0-9A-F]{64}$/i);
var NANO_WORK = z.string().regex(/^[0-9A-F]+$/i);
var NANO_ACCOUNT = z.string().regex(/^(nano_|xrb_)[13][1-9a-km-uw-z]{59}$/);
var ACCOUNT_INFO_SUCCESS = z.object({
  frontier: HEX_64,
  open_block: HEX_64,
  representative_block: HEX_64,
  representative: NANO_ACCOUNT,
  balance: STRING_INT,
  modified_timestamp: STRING_INT,
  block_count: STRING_INT,
  account_version: STRING_INT.optional(),
  confirmation_height: STRING_INT,
  confirmation_height_frontier: HEX_64
});
var HELPER_CONFIG = z.object({
  NANO_RPC_URL: URL.optional(),
  NANO_WORK_GENERATION_URL: URL.optional(),
  NANO_ACCOUNT_PRIVATE_KEY: HEX_64.optional()
});
var PROCESS_BLOCK_SUCCESS = z.object({
  hash: HEX_64
});
var NANO_RPC_ERROR = z.object({
  error: z.string()
});
var NANO_SEND_BLOCK = z.strictObject({
  type: z.literal("state"),
  account: NANO_ACCOUNT,
  previous: HEX_64,
  representative: NANO_ACCOUNT,
  balance: STRING_INT,
  link: HEX_64,
  link_as_account: NANO_ACCOUNT.optional(),
  work: z.string().regex(/^[0-9A-F]+$/i),
  signature: z.string().regex(/^[0-9A-F]{128}$/i)
});
var NANO_RPC_CALL_WORK_GENERATE_RESPONSE = z.object({
  work: NANO_WORK,
  difficulty: z.string(),
  multiplier: z.string(),
  hash: HEX_64
});
var EXACT_NANO_PAYLOAD = z.object({
  block: NANO_SEND_BLOCK
});
var ASSET_AMOUNT = z.object({
  asset: z.string(),
  amount: z.string(),
  extra: z.object().optional()
});
var WORK_GENERATOR = z.function({
  input: [z.string()],
  output: z.string()
});
var SEND_BLOCK_WORK_THRESHOLD = "fffffff800000000";
var NANO_ACCOUNT_PRIVATE_KEY_PROPERTY = "NANO_ACCOUNT_PRIVATE_KEY";

// src/typescript/common.ts
function validate(zodSchema, toParse) {
  return zodSchema.safeParse(toParse).success;
}
var CURRENCY_CODE_XNO = "XNO";

export {
  STRING_DECIMAL,
  NANO_SEND_BLOCK,
  ASSET_AMOUNT,
  SEND_BLOCK_WORK_THRESHOLD,
  NANO_ACCOUNT_PRIVATE_KEY_PROPERTY,
  validate,
  CURRENCY_CODE_XNO
};
//# sourceMappingURL=chunk-XPBYBE7I.mjs.map