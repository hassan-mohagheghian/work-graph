# WorkGraph Frontend Design System

Version: 2.0

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style)
- **Theme tokens:** `src/app/globals.css`
- **Layout primitives:** `src/shared/layout/page-layout.tsx`
- **UI components:** `src/shared/ui/`

## Page frame

All authenticated content shares the same horizontal frame as the header:

```
container mx-auto px-4
```

Exported as `pageShellClass`, used by:
- `src/shared/ui/header.tsx` — sticky top bar
- `PageShell` — outer wrapper for page routes
- Organization layout — wraps all `/organizations/[organizationId]/*` routes

**Do not** add ad-hoc `px-6`, `p-6`, or separate `container` wrappers.

## Layout hierarchy

```
RootLayout (app/layout.tsx)
├── Header          → pageShellClass
└── main
    ├── /organizations          → PageShell + PageBody
    └── /organizations/[orgId]  → PageShell (org layout with tabs)
        ├── org pages           → SectionHeader + PageBody
        └── /projects/[id]      → project layout (breadcrumb, h1, tabs)
            └── tab content     → SectionHeader + PageBody
```

## Header navigation

The header provides two dropdowns:

### Org dropdown
```
┌─────────────────────────────────┐
│ [All Orgs]  [Current Org ▼]    │ ← Two buttons in first row
├─────────────────────────────────┤
│ (submenu when Current Org clicked)
│ ← Back                          │
│ Overview, Projects, Members,    │
│ Settings                        │
├─────────────────────────────────┤
│ [🔍 Search organizations...]    │
├─────────────────────────────────┤
│ ○ Org 1 (active)                │
│ ○ Org 2                         │ ← Scrollable list (max 8 items)
│ ○ Org 3                         │
└─────────────────────────────────┘
```

### Projects dropdown
```
┌─────────────────────────────────┐
│ [All Projects] [Project ▼]     │
├─────────────────────────────────┤
│ (submenu when Project clicked)
│ ← Back                          │
│ Overview, Documents, Roadmap,   │
│ Tasks, Members, Settings        │
├─────────────────────────────────┤
│ [🔍 Search projects...]         │
├─────────────────────────────────┤
│ Project 1 (active)              │
│ Project 2                       │ ← Scrollable list
│ Project 3                       │
└─────────────────────────────────┘
```

## Layout components

Import from `@/shared/layout/page-layout`.

### `PageShell`

Outer page frame. Applies `container mx-auto px-4` and `py-6`.

```tsx
<PageShell>
  <PageBody>...</PageBody>
</PageShell>
```

### `PageHeader`

Top-level page title (h1). Used on org-level and standalone routes.

```tsx
<PageHeader
  title="Projects"
  description="Manage your projects"
  actions={<Button>New Project</Button>}
/>
```

### `SectionHeader`

Sub-page title (h2). Used inside project/org tab content.

```tsx
<SectionHeader
  title="Documents"
  description="Store project knowledge for AI planning"
  actions={<Button size="sm"><Plus className="size-4 mr-1" />Create Document</Button>}
/>
```

### `PageBody`

Vertical stack for page content.

| `spacing` | Class | Use when |
|-----------|-------|----------|
| `"default"` | `space-y-6` | Most pages |
| `"tight"` | `space-y-4` | Dense lists (projects table) |

### `PageLoading`

Consistent loading placeholder.

```tsx
if (isLoading) return <PageLoading />;
```

## Button conventions

### Primary actions (Create/Add/Invite)

In `SectionHeader` actions:
```tsx
<Button size="sm" onClick={() => setCreateOpen(true)}>
  <Plus className="size-4 mr-1" />
  Create Task
</Button>
```

In empty state cards:
```tsx
<Button onClick={() => setCreateOpen(true)}>
  <Plus className="size-4 mr-1" />
  Create Task
</Button>
```

### Secondary actions (Edit)

```tsx
<Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
  <Pencil className="size-3.5 mr-1" />
  Edit
</Button>
```

### Rules
- Primary actions: default variant, `size="sm"` in header, no size in empty state
- Secondary actions: `variant="outline"`, `size="sm"`
- Icons: `size-4` with `mr-1` spacing
- All tabs use `SectionHeader` with consistent action buttons

## Typography

| Level | Element | Classes | Where |
|-------|---------|---------|-------|
| Page title | h1 | `text-2xl font-semibold tracking-tight` | `PageHeader` |
| Section title | h2 | `text-xl font-semibold tracking-tight` | `SectionHeader` |
| Description | p | `text-sm text-muted-foreground` | Headers, cards |
| Body | p | `text-sm` | General content |

## Project layout

`src/app/(protected)/organizations/[organizationId]/projects/[projectId]/layout.tsx`:

1. Breadcrumb (Projects → project name)
2. Project h1
3. Separator
4. Tab bar (Overview, Documents, Roadmap, Tasks, Members, Settings)
5. Tab content (`children`)

## Org layout

`src/app/(protected)/organizations/[organizationId]/layout.tsx`:

1. Breadcrumb (Organizations → org name)
2. Org h1
3. Separator
4. Tab bar (Overview, Projects, Members, Settings)
5. Tab content (`children`)

## Notifications

Toast notifications use **Sonner** via `@/shared/lib/notify`. Position: bottom-right.

| Helper | Auto-dismiss |
|--------|--------------|
| `notify.success()` | 4s |
| `notify.error()` | 6s |
| `notify.warning()` | 5s |
| `notify.info()` | 4s |

**React Query mutations:** errors auto-shown. Add `meta: { successMessage: "..." }` for success.

## Create and edit flows

Use **bottom sheets** (`Sheet` with `side="bottom"`) for all create/edit forms.

| Action | Component |
|--------|-----------|
| Create organization | `CreateOrganizationSheet` |
| Edit organization | `EditOrganizationSheet` |
| Invite member (org) | `InviteMemberSheet` |
| Create project | `CreateProjectSheet` |
| Edit project | `EditProjectSheet` |
| Add member (project) | `AddProjectMemberSheet` |
| Create / edit task | `CreateTaskSheet` / `EditTaskSheet` |

## Empty states

All list pages show a card with description and create button when empty:

```tsx
{items.length === 0 && (
  <Card>
    <CardContent className="p-8 text-center">
      <p className="text-muted-foreground mb-4">
        No items yet. Create one to get started.
      </p>
      <Button onClick={() => setCreateOpen(true)}>
        <Plus className="size-4 mr-1" />
        Create Item
      </Button>
    </CardContent>
  </Card>
)}
```

## Adding a new page

### Org-level page

```tsx
import { PageBody, SectionHeader, PageLoading } from "@/shared/layout/page-layout";

export default function SomethingPage() {
  if (isLoading) return <PageLoading />;
  return (
    <PageBody>
      <SectionHeader
        title="Something"
        actions={<Button size="sm"><Plus className="size-4 mr-1" />Add</Button>}
      />
      {/* content */}
    </PageBody>
  );
}
```

### Project tab page

```tsx
import { PageBody, SectionHeader } from "@/shared/layout/page-layout";

export default function SomethingTabPage() {
  return (
    <PageBody>
      <SectionHeader title="Something" actions={...} />
      {/* content */}
    </PageBody>
  );
}
```

## Checklist for new UI

- [ ] Uses `PageShell` / org layout (not custom padding)
- [ ] Correct header: `PageHeader` (h1) vs `SectionHeader` (h2)
- [ ] Content in `PageBody` with appropriate spacing
- [ ] Loading states use `PageLoading`
- [ ] Semantic color tokens (not raw gray/blue)
- [ ] Actions in `SectionHeader` `actions` prop
- [ ] Create/edit uses bottom sheet drawers
- [ ] Empty states have card with create button
- [ ] Buttons follow primary/secondary conventions
