import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { activityApi } from '../api/activityApi'
import { AppLayout } from '../components/AppLayout'

export function ActivityCreatePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    leadId: '1',
    type: 'CALL',
    notes: '',
    gpsLat: '',
    gpsLong: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const activity = await activityApi.create(user!, {
        leadId: Number(form.leadId),
        type: form.type,
        notes: form.notes,
        gpsLat: form.gpsLat ? Number(form.gpsLat) : undefined,
        gpsLong: form.gpsLong ? Number(form.gpsLong) : undefined,
      })
      setMessage(`Activity #${activity.id} created successfully`)
      setForm({ ...form, notes: '', gpsLat: '', gpsLong: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create activity')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout
      title="Log Activity"
      subtitle="Use this flow for calls, meetings, WhatsApp updates, emails, and notes."
    >
      <form className="form-grid panel" onSubmit={onSubmit}>
        <label>
          Lead ID
          <input
            type="number"
            value={form.leadId}
            onChange={(e) => setForm({ ...form, leadId: e.target.value })}
            required
          />
        </label>
        <label>
          Activity Type
          <input
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          />
        </label>
        <label className="full-span">
          Notes
          <textarea
            rows={5}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            required
          />
        </label>
        <label>
          GPS Latitude
          <input
            value={form.gpsLat}
            onChange={(e) => setForm({ ...form, gpsLat: e.target.value })}
          />
        </label>
        <label>
          GPS Longitude
          <input
            value={form.gpsLong}
            onChange={(e) => setForm({ ...form, gpsLong: e.target.value })}
          />
        </label>
        {error ? <div className="error-banner full-span">{error}</div> : null}
        {message ? <div className="success-banner full-span">{message}</div> : null}
        <button className="primary-button full-span" disabled={saving} type="submit">
          {saving ? 'Saving...' : 'Save Activity'}
        </button>
      </form>
    </AppLayout>
  )
}
