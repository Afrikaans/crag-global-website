import React, { useEffect, useState } from 'react'

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, { credentials: 'include', ...options })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

const Admin = () => {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [login, setLogin] = useState({ email: '', password: '' })
  const [company, setCompany] = useState({ name: '', tagline: '', email: '', phone: '', addressLines: [], social: { instagram: '', facebook: '', linkedin: '' } })

  useEffect(() => {
    fetchJson('/api/me')
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchJson('/api/company').then(setCompany).catch(() => {})
  }, [authed])

  const onLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await fetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      })
      setAuthed(true)
      const data = await fetchJson('/api/company')
      setCompany(data)
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...company, addressLines: company.addressLines.filter(Boolean) }
      const saved = await fetchJson('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setCompany(saved)
      alert('Saved')
    } catch (err) {
      setError('Save failed')
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading…</div>

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#e8f0ff 0%, #f9f6ff 100%)' }}>
        <div style={{ maxWidth: 460, margin: '6rem auto', padding: '2rem', border: '1px solid #c9d6ff', borderRadius: 12, background: '#ffffff', boxShadow: '0 10px 30px rgba(26,79,255,0.08)' }}>
          <h2 style={{ marginBottom: '1rem', color: '#1a4fff' }}>Admin Login</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <form onSubmit={onLogin}>
          <label style={{ color: '#334' }}>Email</label>
          <input style={{ width: '100%', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff', outline: 'none' }} type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required />
          <label style={{ color: '#334' }}>Password</label>
          <input style={{ width: '100%', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff', outline: 'none' }} type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required />
          <button style={{ padding: '0.65rem 1.1rem', borderRadius: 8, background: 'linear-gradient(135deg,#1a4fff,#6a8bff)', color: '#fff', border: 0, boxShadow: '0 6px 14px rgba(26,79,255,0.25)' }}>Login</button>
        </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#e8f0ff 0%, #f9f6ff 100%)' }}>
      <div style={{ maxWidth: 900, margin: '2.5rem auto', padding: '1.5rem' }}>
        <div style={{ background: '#1a4fff', color: '#fff', padding: '1rem 1.25rem', borderRadius: 12, boxShadow: '0 8px 20px rgba(26,79,255,0.25)', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Company Settings</h2>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #c9d6ff', borderRadius: 12, padding: '1.25rem', boxShadow: '0 10px 30px rgba(26,79,255,0.08)' }}>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={onSave}>
        <label style={{ color: '#334' }}>Name</label>
        <input style={{ width: '100%', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.name || ''} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
        <label style={{ color: '#334' }}>Tagline</label>
        <input style={{ width: '100%', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.tagline || ''} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} />
        <label style={{ color: '#334' }}>Email</label>
        <input style={{ width: '100%', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.email || ''} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
        <label style={{ color: '#334' }}>Phone</label>
        <input style={{ width: '100%', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.phone || ''} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
        <label style={{ color: '#334' }}>Address Lines (one per line)</label>
        <textarea style={{ width: '100%', margin: '0.5rem 0 1rem', minHeight: 100, padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={(company.addressLines || []).join('\n')} onChange={(e) => setCompany({ ...company, addressLines: e.target.value.split('\n') })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ color: '#334' }}>Instagram</label>
            <input style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.social?.instagram || ''} onChange={(e) => setCompany({ ...company, social: { ...company.social, instagram: e.target.value } })} />
          </div>
          <div>
            <label style={{ color: '#334' }}>Facebook</label>
            <input style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.social?.facebook || ''} onChange={(e) => setCompany({ ...company, social: { ...company.social, facebook: e.target.value } })} />
          </div>
          <div>
            <label style={{ color: '#334' }}>LinkedIn</label>
            <input style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #c9d6ff' }} value={company.social?.linkedin || ''} onChange={(e) => setCompany({ ...company, social: { ...company.social, linkedin: e.target.value } })} />
          </div>
        </div>
        <button style={{ marginTop: '1rem', padding: '0.7rem 1.2rem', borderRadius: 10, background: 'linear-gradient(135deg,#1a4fff,#6a8bff)', color: '#fff', border: 0, boxShadow: '0 8px 18px rgba(26,79,255,0.25)' }}>Save</button>
      </form>
        </div>
      </div>
    </div>
  )
}

export default Admin


