import { useState } from 'react'
import { leadApi } from '../api/leadApi'
import { useAuth } from '../auth/AuthContext'
import { AppLayout } from '../components/AppLayout'

export function ReassignPage() {
  const { user } = useAuth()
  const [leadIds, setLeadIds] = useState('1,2,3')
  const [assignedTo, setAssignedTo] = useState('2')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const ids = leadIds
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((v) => !Number.isNaN(v))
      const result = await leadApi.reassign(user!, ids, Number(assignedTo))
      setMessage(`${result.length} lead(s) reassigned successfully`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reassign leads')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout
      title="Reassign Leads"
      subtitle="Owner/admin workflow for lead reassignment after checking customer history."
    >
      <form className="form-grid panel" onSubmit={onSubmit}>
        <label>
          Lead IDs (comma separated)
          <input value={leadIds} onChange={(e) => setLeadIds(e.target.value)} />
        </label>
        <label>
          New Employee ID
          <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
        </label>
        {error ? <div className="error-banner full-span">{error}</div> : null}
        {message ? <div className="success-banner full-span">{message}</div> : null}
        <button className="primary-button full-span" disabled={saving} type="submit">
          {saving ? 'Reassigning...' : 'Reassign'}
        </button>
      </form>
    </AppLayout>
  )
}
