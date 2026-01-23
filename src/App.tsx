import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PayrollCalculator } from '@/modules/payroll/components/PayrollCalculator'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
        <header className="max-w-5xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Admin System <span className="text-blue-500">Peru 2026</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Motor de Nómina & Cumplimiento Normativo (Bun + Elysia)
          </p>
        </header>

        <main>
          <PayrollCalculator />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
