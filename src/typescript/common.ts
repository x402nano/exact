import type { ZodTypeAny } from 'zod'

export function validate(zodSchema: ZodTypeAny, toParse: any): boolean {
  return zodSchema.safeParse(toParse).success
}

export const CURRENCY_CODE_XNO = 'XNO'
