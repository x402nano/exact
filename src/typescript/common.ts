import { ZodObject } from 'zod'

export function validate(zodSchema: ZodObject, toParse: any): boolean {
  return zodSchema.safeParse(toParse).success
}

export const CURRENCY_CODE_XNO = 'XNO'
