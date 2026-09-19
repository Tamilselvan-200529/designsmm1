# Project Monorepo Structure

This document outlines the top-level directory structure and responsibilities for the Social Media Management SaaS monorepo.

## Directory Responsibilities

- `apps/`
  → Running applications (`web` frontend, `api` backend service, `worker` background process engine)

- `packages/`
  → Shared/reusable code libraries (`ui`, `types`, `validation`, `config`, `database`, `api-client`, `logger`)

- `integrations/`
  → External social platform integrations (Instagram, Facebook, LinkedIn, YouTube, X, WhatsApp, common)

- `infrastructure/`
  → Deployment and operational infrastructure configurations (Docker, local, staging, production, monitoring, logging, backups)

- `tests/`
  → Testing layers (unit, integration, api, e2e, contract, performance, security, fixtures)

- `docs/`
  → Project and technical documentation (requirements, product, architecture, frontend, backend, database, integrations, api, ai, security, testing, deployment, operations, runbooks, decisions)

- `scripts/`
  → Development, database, and deployment utilities

- `config/`
  → Environment-specific configuration structures
