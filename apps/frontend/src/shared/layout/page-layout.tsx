import { cn } from "@/shared/lib/utils";

/**
 * WorkGraph page layout system
 *
 * All authenticated pages share the same horizontal frame as the header:
 *   container mx-auto px-4
 *
 * Hierarchy:
 *   PageShell     — outer frame (matches header width + padding)
 *   PageHeader    — top-level page title (h1) for org / standalone routes
 *   SectionHeader — tab / sub-page title (h2) inside project layout
 *   PageBody      — vertical stack for page content (space-y-6 default)
 */

/** Matches the header inner container. */
export const pageShellClass = "container mx-auto px-4";

export const pagePaddingYClass = "py-6";
export const pageStackClass = "space-y-6";
export const sectionStackClass = "space-y-4";

type PageShellProps = React.ComponentProps<"div"> & {
  padded?: boolean;
};

export function PageShell({
  children,
  className,
  padded = true,
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn(
        pageShellClass,
        padded && pagePaddingYClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

type SectionHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

type PageBodyProps = React.ComponentProps<"div"> & {
  spacing?: "default" | "tight";
};

export function PageBody({
  children,
  className,
  spacing = "default",
  ...props
}: PageBodyProps) {
  return (
    <div
      className={cn(
        spacing === "tight" ? sectionStackClass : pageStackClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return <p className="text-sm text-muted-foreground">{message}</p>;
}
