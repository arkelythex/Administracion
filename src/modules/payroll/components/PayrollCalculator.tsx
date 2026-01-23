import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/eden'
import { Calculator, Banknote, Users, Building2, ShieldCheck, ArrowRight } from 'lucide-react'
import { Employee, Period, TaxRules } from '@/shared/types'

export function PayrollCalculator() {
  // Estado local para los inputs (String para permitir vacíos al editar)
  const [baseSalary, setBaseSalary] = useState<string>("2500")
  const [regimen, setRegimen] = useState<Employee['regimen']>('GENERAL')
  const [hasFamily, setHasFamily] = useState(false)

  // Configuración de reglas (esto vendría de una config global o API)
  const period: Period = { month: 7, year: 2026, uit: 5350 }
  const rules: TaxRules = { onpRate: 0.13, afpRate: 0, essaludRate: 0.09 }

  // Parsing seguro para la lógica de negocio
  const numericSalary = Number(baseSalary) || 0

  const { data, isLoading } = useQuery({
    queryKey: ['payroll-professional', baseSalary, regimen, hasFamily],
    queryFn: async () => {
      const response = await client.api.payroll.calculate.post({
        employee: {
          id: 'TEMP-001',
          regimen,
          baseSalary: numericSalary,
          hasFamily
        },
        period,
        rules
      })
      if (response.error) throw response.error
      return response.data
    },
    enabled: numericSalary > 0
  })

  return (
    <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
      
      {/* FORMULARIO DE ENTRADA (4 columnas) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Configuración de Nómina</h2>
              <p className="text-xs text-slate-500">Parámetros legales Perú 2026</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Remuneración Básica</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">S/</span>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-10 pr-4 text-white text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Régimen Laboral</label>
              <div className="grid grid-cols-2 gap-3">
                {(['GENERAL', 'MYPE_PEQUENA', 'MYPE_MICRO', 'AGRARIO'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegimen(r)}
                    className={`py-3 px-2 rounded-xl border text-[10px] font-bold transition-all ${
                      regimen === r 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setHasFamily(!hasFamily)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                hasFamily ? 'bg-blue-500/5 border-blue-500/30' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${hasFamily ? 'text-blue-400' : 'text-slate-600'}`} />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Asignación Familiar</p>
                  <p className="text-[10px] text-slate-500">RMV x 10% (S/ 102.50)</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${hasFamily ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                {hasFamily && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* RESULTADOS / DESGLOSE (7 columnas) */}
      <div className="lg:col-span-7">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Desglose de Conceptos
            </h3>
            <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full uppercase">
              JULIO 2026
            </span>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-500">Procesando planilla...</div>
            ) : data ? (
              <div className="space-y-6">
                {/* Ingresos */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Ingresos (Bruto)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sueldo Básico</span>
                      <span className="text-white">S/ {numericSalary.toFixed(2)}</span>
                    </div>
                    {data.benefits.familyAllowance > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Asignación Familiar</span>
                        <span className="text-blue-400">+ S/ {data.benefits.familyAllowance.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800">
                      <span>Total Remuneración</span>
                      <span>S/ {data.grossIncome.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Descuentos */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Retenciones y Descuentos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sistema de Pensiones (ONP/AFP)</span>
                      <span className="text-red-400">- S/ {(data.deductions.onp + data.deductions.afp).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Impuesto a la Renta (5ta Cat.)</span>
                      <span className="text-red-400">- S/ {data.deductions.quinta.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Provisiones del Empleador */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Provisiones Sociales (Costo Empresa)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Gratificación</p>
                      <p className="text-sm font-bold text-white">S/ {data.benefits.gratification.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">CTS</p>
                      <p className="text-sm font-bold text-white">S/ {data.benefits.cts.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="p-8 bg-blue-600">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Neto a Cobrar</p>
                <p className="text-4xl font-black text-white">S/ {data?.netPay.toFixed(2)}</p>
              </div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all">
                Generar Boleta
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}