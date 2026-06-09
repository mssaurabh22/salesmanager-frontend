export function MetricCard({
  label,
  value,
  accent = 'var(--primary)',
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="metric-card">
      <span className="metric-label" style={{ color: accent }}>
        {label}
      </span>
      <strong className="metric-value">{value}</strong>
    </div>
  )
}
