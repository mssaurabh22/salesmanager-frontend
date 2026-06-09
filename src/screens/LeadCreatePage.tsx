import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { leadApi } from '../api/leadApi'
import { AppLayout } from '../components/AppLayout'

export function LeadCreatePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    customerName: '',
    businessName: '',
    contactNumber: '',
    email: '',
    expectedValue: '',
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
      const lead = await leadApi.create(user!, {
        customerName: form.customerName,
        businessName: form.businessName || undefined,
        contactNumber: form.contactNumber,
        email: form.email || undefined,
        expectedValue: form.expectedValue ? Number(form.expectedValue) : undefined,
      })
      setMessage(`Lead #${lead.id} created successfully`)
      setForm({
        customerName: '',
        businessName: '',
        contactNumber: '',
        email: '',
        expectedValue: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create lead')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout
      title="Create Lead"
      subtitle="Quick lead entry designed for both calling and field visit capture."
    >
      <form className="form-grid panel" onSubmit={onSubmit}>
        <label>
          Customer Name
          <input
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            required
          />
        </label>
        <label>
          Business Name
          <input
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
        </label>
        <label>
          Contact Number
          <input
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Expected Value
          <input
            type="number"
            value={form.expectedValue}
            onChange={(e) => setForm({ ...form, expectedValue: e.target.value })}
          />
        </label>
        {error ? <div className="error-banner">{error}</div> : null}
        {message ? <div className="success-banner">{message}</div> : null}
        <button className="primary-button" disabled={saving} type="submit">
          {saving ? 'Saving...' : 'Save Lead'}
        </button>
      </form>
    </AppLayout>
  )
}
