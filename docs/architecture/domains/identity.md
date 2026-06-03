# Identity Domain

## Purpose

The Identity Domain is responsible for authentication, authorization, user management, organization management, and tenant isolation.

Identity is the entry point to the WorkGraph platform and owns all concepts related to users and access control.

---

## Responsibilities

* User registration
* User authentication
* User profile management
* Organization management
* Membership management
* Role management
* Tenant isolation

---

## Out of Scope

The Identity Domain does NOT manage:

* Projects
* Tasks
* Documents
* AI Features
* Notifications

---

## Business Rules

### Multi-Tenancy

WorkGraph is a multi-tenant SaaS platform.

Each organization represents a tenant.

A user may belong to multiple organizations.

Example:

John Doe

* Acme GmbH (OWNER)
* FutureAI GmbH (MEMBER)

Users are global.

Memberships connect users to organizations.

---

### Authentication

Authentication is email and password based for MVP.

OAuth providers will be added later.

---

### Authorization

Access is organization-scoped.

Users may only access resources belonging to organizations where they have membership.

---

## Entities

### User

Represents a person using WorkGraph.

Attributes:

* id
* email
* display_name
* password_hash
* is_active
* created_at
* updated_at

---

### Organization

Represents a tenant.

Attributes:

* id
* name
* slug
* created_at
* updated_at

---

### Membership

Represents a user's participation in an organization.

Attributes:

* id
* user_id
* organization_id
* role
* joined_at

---

## Roles

### OWNER

Organization owner.

Capabilities:

* Full access
* Manage members
* Delete organization

---

### ADMIN

Organization administrator.

Capabilities:

* Manage members
* Manage projects
* Manage documents

---

### MEMBER

Regular user.

Capabilities:

* Participate in projects
* Create documents
* Update assigned tasks

---

## Use Cases

### Register User

Create a new user account.

---

### Login User

Authenticate a user and issue access tokens.

---

### Create Organization

Create a new tenant organization.

The creator automatically becomes OWNER.

---

### Get Organizations

Retrieve organizations for the current user.

---

## Domain Events

* UserRegistered
* UserLoggedIn
* OrganizationCreated
* MembershipCreated

---

## Future Features

* OAuth2
* OpenID Connect
* SSO
* SCIM
* Audit Logging
* Fine-Grained Permissions
