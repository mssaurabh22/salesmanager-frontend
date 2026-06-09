export function StatusPill({
  label,
  tone,
}: {
  label: string
  tone: 'success' | 'danger' | 'warning' | 'neutral'
}) {
  return <span className={`status-pill ${tone}`}>{label}</span>
}
