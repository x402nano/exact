// src/typescript/common.ts
function validate(zodSchema, toParse) {
  return zodSchema.safeParse(toParse).success;
}
var CURRENCY_CODE_XNO = "XNO";

export {
  validate,
  CURRENCY_CODE_XNO
};
//# sourceMappingURL=chunk-SF5W6BOT.mjs.map