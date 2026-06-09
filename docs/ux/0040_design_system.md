# WorkGraph Design System (UI + UX)

---

## 1. Design Philosophy

- Clean SaaS UI
- Minimal cognitive load
- Component-driven architecture
- Consistent spacing and hierarchy

---

## 2. UI Stack

- Tailwind CSS
- shadcn/ui components

---

## 3. Core Components

### Buttons

- primary
- secondary
- destructive

### Inputs

- text input
- password input
- email input

### Layout

- app shell
- sidebar (future)
- top navigation

### Feedback

- toast notifications
- inline errors
- loading skeletons

---

## 4. Layout Structure

### App Shell

- Top bar (org switcher + user menu)
- Main content area
- Optional sidebar (future)

---

## 5. Spacing System

Use consistent spacing scale:

- 4px
- 8px
- 16px
- 24px
- 32px

---

## 6. UX Rules

- One primary action per screen
- Keep forms minimal
- Prefer pages over modals for complex flows
- Always show system state (loading/error/empty)
