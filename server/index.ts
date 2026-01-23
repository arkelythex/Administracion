import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { Employee, Period, TaxRules } from '../src/shared/types'
import { calculatePayroll } from '../src/modules/payroll/utils/calculator'

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Admin System API Peru 2026')
  .group('/api', app => app
    .get('/health', () => ({ status: 'ok', timestamp: new Date() }))
    
    // Motor de Cálculo Profesional
    .post('/payroll/calculate', ({ body }) => {
      const { employee, period, rules } = body
      return calculatePayroll(employee, period, rules)
    }, {
      body: t.Object({
        employee: Employee,
        period: Period,
        rules: TaxRules
      })
    })

    // Validación de Identidad (Mock de integración con RENIEC/SUNAT)
    .get('/validate/:type/:id', ({ params }) => {
      const { type, id } = params
      
      if (type === 'dni' && id.length !== 8) {
        return { valid: false, message: 'DNI debe tener 8 dígitos' }
      }
      
      if (type === 'ruc' && (id.length !== 11 || !['10', '20'].includes(id.substring(0, 2)))) {
        return { valid: false, message: 'RUC inválido o formato incorrecto' }
      }

      return { 
        valid: true, 
        data: { 
          name: type === 'dni' ? 'JUAN PEREZ GARCIA' : 'EMPRESA PERU SAC',
          status: 'ACTIVO'
        } 
      }
    })
  )
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
