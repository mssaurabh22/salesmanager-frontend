import type { ReactNode } from "react";

export function Panel({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {description ? <p className="muted">{description}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "warm" | "hot" | "cool";
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="empty-state">{message}</p>;
}

export function ErrorBanner({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="error-banner">
      <span>{message}</span>
      {retry ? (
        <button type="button" className="link-button" onClick={retry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
