# Arquitectura de Referencia (Elite Level)

## Stack Tecnológico Principal
- **Runtime:** Bun
- **Framework:** ElysiaJS (Backend) + React (Frontend)
- **Validación:** TypeBox (End-to-End Type Safety)
- **Estado/Routing:** TanStack Router + TanStack Query
- **UI:** Tailwind CSS + shadcn/ui

## Estructura de Proyecto: Feature-First Clean Architecture

En lugar de organizar por carpetas técnicas (`controllers/`, `services/`), organizamos por dominios de negocio.

```text
src/
├── modules/
│   ├── payroll/             # Lógica de Planillas (CTS, Gratificación, 5ta)
│   ├── compliance/          # Reglas SUNAT, SUNAFIL y SIRE
│   ├── recruitment/         # IA Screening & WhatsApp Integration
│   └── employees/           # Gestión de Legajos y Contratos
├── shared/
│   ├── components/          # UI Atómica (Shadcn/UI + Tailwind)
│   ├── hooks/               # TanStack Query custom hooks
│   └── utils/               # Validadores de DNI/RUC y cálculos legales
└── server/
    ├── index.ts             # Entry point (Bun + Elysia)
    └── routes.ts            # Definición de tipos para Eden (Type-Safety)
```

## Patrones de Diseño

### Backend (ElysiaJS)
1.  **RPC-like API:** Uso de Eden Treaty para inferencia de tipos automática en el cliente.
2.  **Inyección de Dependencias:** Para servicios de cálculo que dependen de variables temporales (UIT, Tasas).

### Frontend (TanStack)
1.  **Server State First:** Uso de `staleTime: 0` para datos críticos financieros.
2.  **URL State:** Uso de TanStack Router para mantener filtros y estados de vista en la URL.
