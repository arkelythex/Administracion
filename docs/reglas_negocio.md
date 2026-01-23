# Reglas de Negocio Críticas (Perú 2026)

Este documento detalla las reglas de negocio, cumplimiento normativo y consideraciones fiscales para el sistema.

## 1. Motor de Reglas Peruano

### Validación de Entidades
- **RUC/DNI:** Validación estricta de algoritmos de dígito verificador y longitud (8 para DNI, 11 para RUC empezando en 10, 20).
- **TypeBox:** Implementación de esquemas de validación en la capa de entrada (API Gateway).

### Cumplimiento SUNAT 2026 (SIRE)
- **Conciliación Automática:** El sistema debe comparar:
    - `Propuesta RVIE/RCE (SUNAT)` vs `Registro Contable Interno`.
- **Alertas:** Notificar discrepancias antes de la declaración mensual.

## 2. Gestión de Nómina y Fiscalidad

 ### Regímenes Laborales
 El sistema debe soportar polimorfismo en el cálculo según el régimen:
 - **General:** Beneficios al 100%.
 - **MYPE (Micro):** Sin CTS, sin Gratificación, vacaciones 15 días.
 - **MYPE (Pequeña):** CTS y Grati al 50%, vacaciones 15 días.
 - **Agrario:** Tasas especiales de IR y aportes ESSALUD diferenciados.

 ### Tasas de Aportes 2026
 - **ONP:** 13% del sueldo imponible.
 - **AFP:** 10% obligatorio + comisión variable (1-2%) + seguro previsional (1.37%).
 - **ESSALUD:** 9% (empleador) + 3% (trabajador para algunos casos).
 - **RMV 2026:** S/ 1,130 mensuales.

 ### Rentas de Quinta Categoría
 - **Cálculo Proyectivo:** Retención mensual basada en la proyección de ingresos anuales vs. la UIT vigente (S/ 5,500 para 2026).
 - **Manejo de la UIT:** La UIT no debe ser una constante. Debe ser un valor consultado con vigencia temporal (`valid_from`, `valid_to`). Valor actual: S/ 5,500 (2026).

## 3. Seguridad y Privacidad
- **LPDP (Ley de Protección de Datos Personales):**
    - Encriptación de legajos digitales.
    - Auditoría de acceso a datos sensibles (sueldos, direcciones).
