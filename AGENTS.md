# Repository Guidelines

This repository contains the RCPS MVP defined in the ICT2112 project specification. It is a monorepo with a NestJS API, a React UI, and a Postgres database managed by Prisma.

## Project Structure & Module Organization
- `apps/backend` contains the API and module logic.
- `apps/frontend` contains the customer/staff UI.
- `apps/backend/prisma/schema.prisma` defines the data model for all three modules.
- Module namespaces mirror the spec: `rental` (Module 1), `inventory` (Module 2), and `inout` (Module 3).

## Build, Test, and Development Commands
- `docker-compose up --build` starts Postgres, API, and UI.
- `npm run dev` in `apps/backend` runs the API with hot reload.
- `npm run dev` in `apps/frontend` runs the UI locally.
- `npx prisma migrate dev` in `apps/backend` applies schema changes.
- `npx prisma db seed` in `apps/backend` loads sample data.

## Coding Style & Naming Conventions
- Use 2-space indentation in TS/TSX and 2 spaces in JSON/YAML.
- Favor descriptive names: `CreateBookingDto`, `return-process.service.ts`, `booking_quote.test.ts`.
- Keep module folders aligned with domain boundaries (`rental`, `inventory`, `inout`).

## Testing Guidelines
- Backend tests live in `apps/backend/test` and use Jest conventions.
- Prefer test names that match flows, e.g., `booking-quote.e2e-spec.ts`.
- Add UI tests only for critical flows (booking creation, checkout, return).

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat: add return valuation endpoint`, `fix: handle late return fees`.
- PRs should include: summary, tests run, and screenshots for UI changes.

## Security & Configuration Tips
- Keep secrets in `.env`; only commit `.env.example`.
- Avoid real customer data in fixtures; use synthetic data.
