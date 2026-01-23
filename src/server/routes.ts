import { Elysia } from 'elysia'
import { Type } from '@sinclair/typebox'

// Define types using TypeBox for end-to-end type safety
export const EmployeeSchema = Type.Object({
  id: Type.String(),
  regimen: Type.Union([
    Type.Literal('GENERAL'),
    Type.Literal('MYPE_MICRO'),
    Type.Literal('MYPE_PEQUENA'),
    Type.Literal('AGRARIO')
  ]),
  baseSalary: Type.Number(),
  hasFamily: Type.Boolean(),
  hoursWorked: Type.Optional(Type.Number()) // For part-time validation
})

export const PeriodSchema = Type.Object({
  month: Type.Number({ minimum: 1, maximum: 12 }),
  year: Type.Number(),
  uit: Type.Number() // Current UIT value
})

export const TaxRulesSchema = Type.Object({
  onpRate: Type.Number(),
  afpRate: Type.Number(),
  essaludRate: Type.Number()
})

export const PayrollResultSchema = Type.Object({
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

// Routes
export const routes = new Elysia({ prefix: '/api' })
  .post('/payroll/calculate', ({ body }) => {
    // TODO: Implement calculation logic
    return { message: 'Payroll calculation not yet implemented' }
  }, {
    body: Type.Object({
      employee: EmployeeSchema,
      period: PeriodSchema,
      rules: TaxRulesSchema
    }),
    response: PayrollResultSchema
  })