import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'register'

export default function Login({ navigate }: { navigate: (p: string) => void }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  const switchMode = (m: Mode) => { setMode(m); setError(''); setForm({ name: '', email: '', password: '', confirm: '' }) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      if (mode === 'register') {
        if (form.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres')
        if (form.password !== form.confirm) throw new Error('Las contraseñas no coinciden')
        register({ name: form.name, email: form.email, password: form.password })
      } else {
        const users: any[] = JSON.parse(localStorage.getItem('tasacasa_users') || '[]')
        const found = users.find(u => u.email === form.email && u.password === form.password)
        if (!found) throw new Error('Email o contraseña incorrectos')
        login(found)
      }
      navigate('profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tc-auth">
      <div className="tc-auth__card">
        <div className="tc-auth__header">
          <div className="tc-auth__logo">⬡</div>
          <h1 className="tc-auth__title">TasaCasa</h1>
          <p className="tc-auth__subtitle">
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta gratuita'}
          </p>
        </div>

        <div className="tc-auth__tabs">
          <button className={`tc-auth__tab ${mode === 'login' ? 'is-active' : ''}`} onClick={() => switchMode('login')}>
            Iniciar sesión
          </button>
          <button className={`tc-auth__tab ${mode === 'register' ? 'is-active' : ''}`} onClick={() => switchMode('register')}>
            Registrarse
          </button>
        </div>

        <form className="tc-auth__form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="tc-field">
              <label className="tc-field__label">Nombre completo</label>
              <input type="text" className="tc-field__input" placeholder="María García" value={form.name}
                onChange={e => update('name', e.target.value)} required autoFocus />
            </div>
          )}

          <div className="tc-field">
            <label className="tc-field__label">Email</label>
            <input type="email" className="tc-field__input" placeholder="tu@email.com" value={form.email}
              onChange={e => update('email', e.target.value)} required />
          </div>

          <div className="tc-field">
            <label className="tc-field__label">Contraseña</label>
            <input type="password" className="tc-field__input"
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={form.password} onChange={e => update('password', e.target.value)} required />
          </div>

          {mode === 'register' && (
            <div className="tc-field">
              <label className="tc-field__label">Confirmar contraseña</label>
              <input type="password" className="tc-field__input" placeholder="Repite tu contraseña"
                value={form.confirm} onChange={e => update('confirm', e.target.value)} required />
            </div>
          )}

          {error && <div className="tc-auth__error">⚠️ {error}</div>}

          <button type="submit" className="tc-btn tc-btn--primary tc-btn--full" disabled={loading}>
            {loading
              ? <><span className="tc-spinner" /> {mode === 'login' ? 'Entrando...' : 'Creando cuenta...'}</>
              : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta gratuita'
            }
          </button>
        </form>

        <p className="tc-auth__footer">
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button className="tc-auth__link" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
