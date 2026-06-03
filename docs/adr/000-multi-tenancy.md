# ADR 000: Multi-Tenancy Strategy

## Status

Accepted

## Context

WorkGraph will be SaaS. Each organization is a tenant.

## Decision

Use shared database with shared schema for MVP.  
Use `organization_id` as tenant discriminator in all tables.

## Alternatives Considered

- Separate schema per tenant → more isolation, more complexity
- Separate database per tenant → very high cost

## Consequences

- Simple MVP implementation
- Easy onboarding
- Scaling will require future migration to per-schema/db approach
