# WorkGraph UI States

---

## 1. Authentication States

### Not authenticated

- Redirect to login page

### Loading auth state

- Show spinner or skeleton

### Auth error

- Inline error message on form

---

## 2. Organization States

### No organizations

- Show empty state
- CTA: "Create Organization"

### Loading organizations

- Skeleton list UI

### Organization selected

- Load dashboard context

---

## 3. Application States

### Loading dashboard

- Skeleton layout for dashboard

### Error state

- Toast or inline error message

### Success state

- Normal dashboard view

---

## 4. System States

### Unauthorized access

- Redirect to login

### Token expired

- Force logout → login

### API failure

- Retry + error toast

---

## 5. UX Rules for States

- Never show blank screens
- Every screen must define:
  - loading state
  - error state
  - empty state
