# Especificación Técnica: Motor de Cálculo de Nómina

Este documento describe la especificación técnica para la función central de cálculo de nómina peruana.

## Definición de Función

### `calculatePayroll(employee, period, rules)`

Calcula la remuneración neta, descuentos y aportes de un empleado para un periodo específico, aplicando las reglas del régimen laboral correspondiente.

### JSDoc

```typescript
/**
 * Calcula la nómina mensual de un empleado bajo normativa peruana vigente.
 *
 * @param {Employee} employee - Objeto con datos del empleado (régimen, sueldo base, asignación familiar).
 * @param {Period} period - Objeto definiendo el mes y año de cálculo (incluye valor UIT del periodo).
 * @param {TaxRules} rules - Reglas fiscales aplicables (tasas AFP, topes ESSALUD).
 * @returns {PayrollResult} Objeto detallado con ingresos, descuentos (AFP/ONP, 5ta), y neto a pagar.
 * @throws {ValidationError} Si el empleado no tiene régimen laboral asignado o DNI inválido.
 * @throws {ComplianceError} Si el sueldo es menor al RMV (Remuneración Mínima Vital) sin justificación (ej. part-time).
 *
 * @example
 * const result = calculatePayroll(
 *   { id: "E001", regimen: "GENERAL", baseSalary: 5000, hasFamily: true },
 *   { month: 7, year: 2026, uit: 5500 },
 *   { onpRate: 0.13, afpRate: 0.10 } // Tasas simplificadas para ejemplo
 * );
 * console.log(result.netPay); // Resultado del cálculo
 */
export function calculatePayroll(employee: Employee, period: Period, rules: TaxRules): PayrollResult {
  // Implementación...
}
```

## Diagrama de Flujo (Mermaid)

```mermaid
graph TD
    A[Inicio: calculatePayroll] --> B{Validar Datos Empleado}
    B -- Error --> C[Lanzar ValidationError]
    B -- OK --> D{Determinar Régimen}
    
    D -->|General| E[Calc. Beneficios 100%]
    D -->|MYPE Pequeña| F[Calc. Beneficios 50%]
    D -->|MYPE Micro| G[Calc. Beneficios Reducidos]
    
    E & F & G --> H[Calcular Ingresos Brutos]
    H --> I{Tiene Asignación Familiar?}
    I -- Sí --> J[Sumar 10% RMV]
    I -- No --> K[Continuar]
    
    J & K --> L[Calcular Base Imponible]
    
    L --> M{Sistema Pensiones}
    M -->|ONP| N[Descontar 13%]
    M -->|AFP| O[Consultar API SBS (Comisión + Seguro)]
    
    N & O --> P[Calcular Renta 5ta Categoría]
    P --> Q[Calcular Neto a Pagar]
    Q --> R[Retornar PayrollResult]
```

## Edge Cases Cubiertos

1.  **Cambio de Régimen a mitad de mes:**
    *   *Manejo:* El sistema debe prorratear los días trabajados en cada régimen si hubo un cambio contractual.
2.  **Incapacidad Temporal (Subsidios):**
    *   *Manejo:* Los primeros 20 días paga el empleador, el resto ESSALUD. El cálculo debe diferenciar estos montos para el PLAME.
3.  **Vacaciones Truncas en Liquidación:**
    *   *Manejo:* Si el empleado cesa, calcular vacaciones no gozadas hasta el día exacto del cese (precisión de 30vos).
4.  **Sueldo menor al Mínimo (Part-time):**
    *   *Manejo:* Permitir sueldo < RMV solo si `hours_worked < 4` diarios. Si es jornada completa y sueldo < RMV, lanzar `ComplianceError`.
5.  **Gratificación en Julio/Diciembre:**
    *   *Manejo:* Si `period.month` es 7 o 12, inyectar lógica adicional para bonificación extraordinaria (9% sobre Grati).
