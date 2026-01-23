import { Employee, Period, TaxRules, PayrollResult } from '@/shared/types'

/**
 * Motor de Cálculo de Nómina Peruana (Elite Level)
 * Implementa lógica polimórfica para regímenes General y MYPE.
 */
export function calculatePayroll(
  employee: Employee,
  period: Period,
  rules: TaxRules
): PayrollResult {
  // 1. Constantes y Validaciones
  const RMV = 1025;
  const familyAllowance = employee.hasFamily ? (RMV * 0.10) : 0;
  
  // 2. Ingreso Bruto
  const grossIncome = employee.baseSalary + familyAllowance;

  // 3. Beneficios según Régimen (Proyectados/Provisiones)
  let gratification = 0;
  let cts = 0;

  switch (employee.regimen) {
    case 'GENERAL':
      gratification = (grossIncome / 6); // Provisión mensual (1/6)
      cts = (grossIncome * 1.1666) / 12; // Provisión mensual con 1/6 de grati
      break;
    case 'MYPE_PEQUENA':
      gratification = (grossIncome / 12); // 50% de una remuneración
      cts = (grossIncome / 12) * 0.5;    // 50% de CTS
      break;
    case 'MYPE_MICRO':
      gratification = 0; // Micro no tiene grati
      cts = 0;           // Micro no tiene CTS
      break;
    default:
      break;
  }

  // 4. Descuentos de Ley (Pensión)
  // Nota: Simplificamos a un solo sistema por ahora (ONP o AFP)
  const pensionRate = rules.afpRate > 0 ? rules.afpRate : rules.onpRate;
  const pensionDeduction = Math.round(grossIncome * pensionRate * 100) / 100;

  // 5. ESSALUD (Aporte del empleador, pero lo calculamos para el desglose)
  // En Microempresa es SIS, en el resto es 9%
  const essaludRate = employee.regimen === 'MYPE_MICRO' ? 0.05 : rules.essaludRate;
  const essaludAporte = Math.round(grossIncome * essaludRate * 100) / 100;

  // 6. Renta de Quinta (Simulación simplificada de retención mensual)
  const annualIncome = (grossIncome * 12) + (gratification * 2);
  const deductionsUIT = period.uit * 7;
  const taxableIncome = Math.max(0, annualIncome - deductionsUIT);
  
  // Escala simplificada de IR (8% para el primer tramo)
  const annualTax = taxableIncome * 0.08; 
  const monthlyQuinta = Math.round((annualTax / 12) * 100) / 100;

  // 7. Neto a Pagar
  const netPay = Math.round((grossIncome - pensionDeduction - monthlyQuinta) * 100) / 100;

  return {
    grossIncome,
    deductions: {
      onp: rules.afpRate > 0 ? 0 : pensionDeduction,
      afp: rules.afpRate > 0 ? pensionDeduction : 0,
      essalud: essaludAporte,
      quinta: monthlyQuinta
    },
    benefits: {
      familyAllowance,
      gratification,
      cts
    },
    netPay
  };
}
