import { expect, test, describe } from "bun:test";
import { calculatePayroll } from "./calculator";
import { Employee, Period, TaxRules } from "@/shared/types";

describe("Payroll Engine - Perú 2026", () => {
  const period: Period = { month: 7, year: 2026, uit: 5350 };
  const rules: TaxRules = { onpRate: 0.13, afpRate: 0, essaludRate: 0.09 };

  test("Régimen General con Asignación Familiar", () => {
    const employee: Employee = {
      id: "1",
      regimen: "GENERAL",
      baseSalary: 2000,
      hasFamily: true
    };

    const result = calculatePayroll(employee, period, rules);

    // RMV 1025 * 0.10 = 102.50
    // Gross = 2000 + 102.50 = 2102.50
    expect(result.grossIncome).toBe(2102.50);
    expect(result.benefits.familyAllowance).toBe(102.50);
    
    // ONP = 2102.50 * 0.13 = 273.325 -> 273.33
    expect(result.deductions.onp).toBe(273.33);
  });

  test("Régimen MYPE Micro - Sin Gratificación ni CTS", () => {
    const employee: Employee = {
      id: "2",
      regimen: "MYPE_MICRO",
      baseSalary: 1500,
      hasFamily: false
    };

    const result = calculatePayroll(employee, period, rules);

    expect(result.benefits.gratification).toBe(0);
    expect(result.benefits.cts).toBe(0);
    // ESSALUD para micro es SIS (5% aprox o tasa fija, según config)
    expect(result.deductions.essalud).toBeCloseTo(1500 * 0.05, 1);
  });

  test("Renta de 5ta Categoría - Sueldo Alto", () => {
    const employee: Employee = {
      id: "3",
      regimen: "GENERAL",
      baseSalary: 10000,
      hasFamily: false
    };

    const result = calculatePayroll(employee, period, rules);
    
    // Con 10k de sueldo, debe haber retención de 5ta
    expect(result.deductions.quinta).toBeGreaterThan(0);
    expect(result.netPay).toBeLessThan(10000 * 0.87); // Neto < (Bruto - ONP)
  });
});
