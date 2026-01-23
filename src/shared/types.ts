import { Type } from '@sinclair/typebox'

// Re-export types for frontend usage
export const Employee = Type.Object({
  id: Type.String(),
  regimen: Type.Union([
    Type.Literal('GENERAL'),
    Type.Literal('MYPE_MICRO'),
    Type.Literal('MYPE_PEQUENA'),
    Type.Literal('AGRARIO')
  ]),
  baseSalary: Type.Number(),
  hasFamily: Type.Boolean(),
  hoursWorked: Type.Optional(Type.Number())
})

export const Period = Type.Object({
  month: Type.Number({ minimum: 1, maximum: 12 }),
  year: Type.Number(),
  uit: Type.Number()
})

export const TaxRules = Type.Object({
  onpRate: Type.Number(),
  afpRate: Type.Number(),
  essaludRate: Type.Number()
})

export const PayrollResult = Type.Object({
  grossIncome: Type.Number(),
  deductions: Type.Object({
    onp: Type.Number(),
    afp: Type.Number(),
    essalud: Type.Number(),
    quinta: Type.Number()
  }),
  benefits: Type.Object({
    familyAllowance: Type.Number(),
    gratification: Type.Number(),
    cts: Type.Number()
  }),
  netPay: Type.Number()
})

// Type helpers
export type Employee = typeof Employee.static
export type Period = typeof Period.static
export type TaxRules = typeof TaxRules.static
export type PayrollResult = typeof PayrollResult.static