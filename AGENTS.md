# ARKELYTHEX Admin — GGA Review Rules

> **Última actualización**: 2026-06-29
> Repositorio de herramientas administrativas internas para el ecosistema ARKELYTHEX.
> Estas reglas son aplicadas por Gentleman Guardian Angel (gga) en cada commit y PR.

## ⛔ NON-NEGOTIABLES (MUST NOT)

These rules are absolute. Any violation causes the review to FAIL.

- **MUST NOT** introduce secrets, real credentials, production tokens, or API keys.
- **MUST NOT** hardcode SUNAT credentials, RUC authentication tokens, or OSE/API passwords.
- **MUST NOT** use `any` type; use precise types, `unknown`, or justified generics.
- **MUST NOT** use floats or raw numbers for money; uso del `Money` value object con `Intl.NumberFormat`.
- **MUST NOT** expose internal endpoints, employee PII (DNI, salary, bank accounts), or payroll data beyond required scoping.
- **MUST NOT** bypass organization/company scoping in queries, API routes, or reports.
- **MUST NOT** change payroll calculation invariants (CTS, gratificaciones, 5ta categoría, ONP/AFP) without tests and doc updates.
- **MUST NOT** perform broad rewrites without explicit migration plan.

## ✅ REQUIRED PRACTICES (MUST)

- **MUST** validate all API inputs with schemas at service boundaries (TypeBox or Zod).
- **MUST** preserve end-to-end type safety (Elysia Eden Treaty ↔ TanStack Router).
- **MUST** use branded IDs or domain value objects for identifiers and money-sensitive data.
- **MUST** keep payroll/compliance domain logic **deterministic** and covered by tests.
- **MUST** add or update tests for changed behavior — especially payroll calculations.
- **MUST** update docs when public behavior, setup, contracts, or regulatory rules change.
- **MUST** use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `ci:`.
- **MUST** keep commits atomic — one logical change per commit.
- **MUST** prefer small, verifiable, reversible changes.

## 🏗️ Architecture Rules

- Use **Feature-First** structure (`src/modules/`) for domain logic.
- Keep payroll/compliance domain logic **framework-free** in pure functions.
- **Adapters go in server/ or shared/**, not in domain modules.
- **Prefer** pure calculation functions for payroll, CTS, gratificaciones — isolate from HTTP.
- **Dependency injection** for variable external data: UIT value, tax rates, AFP commissions.

## 🔒 Security Rules

- **MUST NOT** have hardcoded secrets or credentials.
- **MUST NOT** have silent error handling (empty catch blocks, swallowed rejections).
- **MUST NOT** have production `console.log`.
- **MUST NOT** expose PII in logs, API responses beyond what's needed, or client bundles.
- **MUST NOT** miss tenant/company scoping in queries.
- **MUST NOT** use money calculations using floats.
- **MUST NOT** use raw SQL without inline justification comment.
- **MUST NOT** miss tests for new business logic.

## 🧪 Testing Rules

- **MUST** write tests for new business logic — especially payroll calculations and tax rules.
- **MUST** verify compliance invariants (CTS, gratificación, ONP/AFP descuentos) in tests.
- **MUST** use the Builder pattern for test fixtures (EmployeeBuilder, PayrollPeriodBuilder).
- **MUST** prefer Vitest for unit tests.
- **Tests MUST** be deterministic — no timezone-dependent assertions, no shared mutable state.
- **MUST** test edge cases: régimen changes mid-month, part-time below RMV, vacaciones truncas.

## 📐 Style & Conventions

- **MUST** use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `ci:`.
- **MUST** keep commits atomic — one logical change per commit.
- **MUST NOT** add `Co-Authored-By` or AI attribution to commits.
- **Prefer** Biome over ESLint for linting and formatting.
- **Prefer** small focused files over large monolithic ones.
- **Prefer** functional/immutable patterns over mutable state for calculations.

## 🏛️ Payroll / Compliance Peru Rules

When reviewing code that touches Peruvian payroll or regulatory flows:

- **MUST** preserve RMV (Remuneración Mínima Vital) calculations.
- **MUST** preserve asignación familiar (10% RMV) logic.
- **MUST** preserve CTS (8.33% base + 1/6 gratificación) formula.
- **MUST** preserve gratificaciones (julio/diciembre) with bonificación extraordinaria (9% ESSALUD).
- **MUST** preserve Renta 5ta Categoría annual projection logic.
- **MUST** preserve ONP (13%) and AFP (variable comisión + seguro SBS) calculations.
- **MUST** preserve SUNAFIL compliance: PLAME, T-REGISTRO, planilla electrónica.
- **MUST** preserve vacaciones truncas (30vos) and liquidación calculation.
- **Must** use company/tenant scoping for all multi-entity queries.

## 📦 Dependency Rules

- **MUST NOT** introduce unnecessary dependencies.
- **Prefer** existing patterns and libraries over new ones.
- **MUST** keep the lockfile in sync (`bun.lock` matches `package.json`).
- **MUST** use `bun install --frozen-lockfile` in CI.

## 🚫 REJECT (Fail Review)

The review MUST FAIL if any of these are detected:

1. Hardcoded secrets or credentials.
2. `any` type without explicit justification.
3. Silent error handling (empty `catch` blocks, `.catch(() => {})`).
4. Production `console.log` (warn first offense, fail second).
5. Missing tenant/company scoping in API/query/report.
6. Money calculations using floats or raw numbers.
7. Raw SQL without inline justification comment.
8. Missing tests for new business logic (especially payroll).
9. Public contract changes without tests and docs.
10. Payroll/compliance calculation changes without compliance-focused tests.
11. `Co-Authored-By` or AI attribution in commit messages.
12. Use of `any` keyword.
13. Floating point money calculations.
14. PII exposure (DNI, salary, bank accounts) in logs or API responses.

## Review Format

When reviewing, produce this output format:

```
## Review Summary

### ✅ Passed Rules
- {rule}: {brief evidence}

### ❌ Failed Rules
- {rule}: {violation description} — {file:line}

### ⚠️ Warnings
- {rule}: {concern} — {file:line}

### Verdict
PASS | FAIL | PASS WITH WARNINGS
```

Be objective. Quote the specific code that violates rules. For PASS WITH WARNINGS, the warnings must be non-blocking concerns.
