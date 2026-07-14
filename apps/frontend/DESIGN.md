# WorkGraph Frontend Design System

This document describes the layout and visual conventions used across the WorkGraph frontend. The goal is consistent alignment, spacing, and hierarchy on every page.

## Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Theme tokens:** `src/app/globals.css`
- **Layout primitives:** `src/shared/layout/page-layout.tsx`
- **UI components:** `src/shared/ui/`

## Page frame

All authenticated content shares the same horizontal frame as the header:

```
container mx-auto px-4
```

This is exported as `pageShellClass` and used by:

- `src/shared/ui/header.tsx` — sticky top bar
- `PageShell` — outer wrapper for page routes
- Organization layout — wraps all `/organizations/[organizationId]/*` routes

**Do not** add ad-hoc `px-6`, `p-6`, or separate `container` wrappers on standard pages. Use the layout components below.

## Layout hierarchy

```
RootLayout (app/layout.tsx)
├── Header          → pageShellClass
└── main
    ├── /organizations          → PageShell + PageBody
    └── /organizations/[orgId]  → PageShell (org layout)
        ├── org pages           → PageHeader + PageBody
        └── /projects/[id]      → project layout (breadcrumb, h1, tabs)
            └── tab content     → SectionHeader + PageBody
```

### Special routes

| Route | Layout |
|-------|--------|
| `/` | `PageShell` centered (marketing-style hero) |
| `/login` | Full-height centered, no `PageShell` |
| `/organizations` | Own `PageShell` (outside org layout) |

## Layout components

Import from `@/shared/layout/page-layout`.

### `PageShell`

Outer page frame. Applies `container mx-auto px-4` and `py-6` by default.

```tsx
<PageShell>
  <PageBody>...</PageBody>
</PageShell>
```

Set `padded={false}` to skip vertical padding (rare).

### `PageHeader`

Top-level page title for org-level and standalone routes. Renders an **h1** (`text-2xl font-semibold tracking-tight`).

```tsx
<PageHeader
  title="Projects"
  description="Manage your projects"
  actions={<Button>New Project</Button>}
/>
```

### `SectionHeader`

Sub-page title inside the project layout (tabs, detail views). Renders an **h2** (`text-xl font-semibold tracking-tight`).

```tsx
<SectionHeader
  title="Documents"
  description="Store project knowledge for AI planning"
  actions={<Button size="sm">Create Document</Button>}
/>
```

The project layout already provides the project **h1** and tab navigation. Tab content should use `SectionHeader`, not another `PageHeader`.

### `PageBody`

Vertical stack for page content.

| `spacing` | Class | Use when |
|-----------|-------|----------|
| `"default"` (default) | `space-y-6` | Most pages |
| `"tight"` | `space-y-4` | Dense lists (e.g. projects table) |

```tsx
<PageBody spacing="tight">
  <PageHeader ... />
  <Table>...</Table>
</PageBody>
```

### `PageLoading`

Consistent loading placeholder (`text-sm text-muted-foreground`).

```tsx
if (isLoading) return <PageLoading />;
```

## Spacing tokens

Defined in `globals.css` `@theme inline` — keep in sync with `page-layout.tsx`:

| Token | Value | Tailwind equivalent |
|-------|-------|---------------------|
| `--spacing-page-x` | `1rem` | `px-4` |
| `--spacing-page-y` | `1.5rem` | `py-6` |
| `--spacing-page-section` | `1.5rem` | `space-y-6` |
| `--spacing-page-section-tight` | `1rem` | `space-y-4` |

## Typography

| Level | Element | Classes | Where |
|-------|---------|---------|-------|
| Page title | `h1` | `text-2xl font-semibold tracking-tight` | `PageHeader`, project layout |
| Section title | `h2` | `text-xl font-semibold tracking-tight` | `SectionHeader` |
| Description | `p` | `text-sm text-muted-foreground` | Headers, card subtitles |
| Body | `p` | `text-sm` | General content |

## Project layout

`src/app/(protected)/organizations/[organizationId]/projects/[projectId]/layout.tsx` provides:

1. Breadcrumb (Projects → project name)
2. Project **h1**
3. Full-width separator
4. Tab bar (Overview, Documents, Roadmap, Tasks, Members, Settings)
5. Tab content (`children`)

Tab pages should only add `SectionHeader` + content — no extra horizontal padding or duplicate project title.

## Color and components

Colors, radius, and semantic tokens live in `globals.css` (`:root` / `.dark`). Use shadcn/ui components from `src/shared/ui/` and semantic classes:

- `bg-background`, `text-foreground`
- `text-muted-foreground`
- `border`, `bg-muted`
- `bg-card`, `text-card-foreground`

Prefer these over hard-coded colors like `bg-gray-50` or `hover:bg-gray-50`.

## Notifications

Temporary toast notifications use **Sonner** via `notify` from `@/shared/lib/notify`.

| Helper | Color | Auto-dismiss |
|--------|-------|--------------|
| `notify.success()` | Green | 4s |
| `notify.error()` | Red | 6s |
| `notify.warning()` | Amber | 5s |
| `notify.info()` | Blue | 4s |

All toasts include a close button and can be dismissed by the user.

**Mutations (React Query):** errors are shown automatically. Add `meta: { successMessage: "..." }` for success toasts. Use `meta: { silentError: true }` to suppress error toasts.

**Manual calls:** use `notify.error(getErrorMessage(error))` in `try/catch` blocks (e.g. non-React Query flows).

```tsx
import { notify } from "@/shared/lib/notify";
import { getErrorMessage } from "@/shared/lib/errors";

notify.success("Saved");
notify.error(getErrorMessage(error));
```

## Create and edit flows

Use **bottom sheets** (`Sheet` with `side="bottom"`) for create/edit forms — not dialogs or dedicated pages.

| Action | Component |
|--------|-----------|
| Create organization | `CreateOrganizationSheet` |
| Edit organization | `EditOrganizationSheet` |
| Create project | `CreateProjectSheet` |
| Edit project | `EditProjectSheet` |
| Create / edit task | `CreateTaskSheet` / `EditTaskSheet` |

Shared pattern:

```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="bottom" className="h-[60vh]">
    <SheetHeader>
      <SheetTitle>...</SheetTitle>
      <SheetDescription>...</SheetDescription>
    </SheetHeader>
    <div className="flex-1 overflow-y-auto px-4 space-y-4">
      {/* form fields with Label + Input */}
    </div>
    <SheetFooter>
      <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
      <Button size="sm">Save / Create</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

Parent pages hold `open` state and render a trigger button in `PageHeader` `actions`.

## Adding a new page

### Org-level page (`/organizations/[orgId]/something`)

```tsx
import { PageBody, PageHeader, PageLoading } from "@/shared/layout/page-layout";

export default function SomethingPage() {
  if (isLoading) return <PageLoading />;

  return (
    <PageBody>
      <PageHeader title="Something" description="Optional subtitle" />
      {/* content */}
    </PageBody>
  );
}
```

### Project tab page

Project layout handles the shell. In the page file:

```tsx
import { PageBody, SectionHeader } from "@/shared/layout/page-layout";

export default function SomethingTabPage() {
  return (
    <PageBody>
      <SectionHeader title="Something" />
      {/* content */}
    </PageBody>
  );
}
```

### Standalone route (outside org layout)

Wrap with `PageShell`:

```tsx
import { PageBody, PageHeader, PageShell } from "@/shared/layout/page-layout";

export default function StandalonePage() {
  return (
    <PageShell>
      <PageBody>
        <PageHeader title="Title" />
        {/* content */}
      </PageBody>
    </PageShell>
  );
}
```

## Checklist for new UI

- [ ] Content aligns with header (uses `PageShell` / org layout, not custom padding)
- [ ] Correct header level: `PageHeader` (h1) vs `SectionHeader` (h2)
- [ ] Content wrapped in `PageBody` with appropriate spacing
- [ ] Loading states use `PageLoading`
- [ ] Semantic color tokens, not raw gray/blue utilities
- [ ] Actions placed in header `actions` prop, not floating separately
