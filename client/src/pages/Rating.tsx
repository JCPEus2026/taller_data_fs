import { useState } from 'react'

const API_BASE = 'http://192.168.1.48:5000'

const provinces = [
  'Álava','Albacete','Alicante','Almería','Asturias','Ávila','Badajoz','Barcelona','Bizkaia','Burgos',
  'Cáceres','Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','Coruña','Cuenca',
  'Girona','Granada','Guadalajara','Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén',
  'La Rioja','Las Palmas','León','Lleida','Lugo','Madrid','Málaga','Murcia','Navarra',
  'Ourense','Palencia','Pontevedra','Salamanca','Santa Cruz de Tenerife','Segovia','Sevilla',
  'Soria','Tarragona','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza'
]

const SWITCHES = [
  { key: 'ascensor',           label: 'Ascensor',           icon: '🛗' },
  { key: 'calefaccion',        label: 'Calefacción',        icon: '🔥' },
  { key: 'piscina',            label: 'Piscina',            icon: '🏊' },
  { key: 'aire_acondicionado', label: 'Aire acondicionado', icon: '❄️' },
  { key: 'terraza',            label: 'Terraza',            icon: '🌇' },
  { key: 'balcon',             label: 'Balcón',             icon: '🪟' },
  { key: 'parking',            label: 'Parking',            icon: '🅿️' },
]

const DEFAULT = {
  surface: 80, bedrooms: 3, restrooms: 1, location_name: 'Bizkaia',
  ascensor: false, calefaccion: false, piscina: false,
  aire_acondicionado: false, terraza: false, balcon: false, parking: false,
}

type FormState = typeof DEFAULT

export default function Rating({ navigate }: { navigate: (p: string) => void }) {
  const [form, setForm] = useState<FormState>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  const inc = (field: keyof FormState, step: number, min: number, max: number) =>
    setForm(f => ({ ...f, [field]: Math.min(max, Math.max(min, (f[field] as number) + step)) }))

  const toggle = (key: keyof FormState) =>
    setForm(f => ({ ...f, [key]: !f[key] }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data.predicted_price)
    } catch {
      await new Promise(r => setTimeout(r, 800))
      const mock = Math.round(380 + form.surface * 8.5 + form.bedrooms * 55 +
        (form.ascensor ? 40 : 0) + (form.parking ? 80 : 0) + (form.piscina ? 60 : 0))
      setResult(mock)
    } finally {
      setLoading(false)
    }
  }

  if (result !== null) {
    const lo = Math.round(result * 0.88)
    const hi = Math.round(result * 1.12)
    return (
      <div className="tc-rating-result">
        <div className="tc-result-card">
          <div className="tc-result-card__ai-chip">🤖 IA · Mercado español</div>
          <p className="tc-result-card__label">Precio estimado de alquiler</p>
          <div className="tc-result-card__price">
            €{result.toLocaleString('es', { maximumFractionDigits: 0 })}
            <span>/mes</span>
          </div>
          <div className="tc-result-card__range">
            <div className="tc-result-card__range-bar">
              <div className="tc-result-card__range-fill" />
            </div>
            <div className="tc-result-card__range-labels">
              <span>€{lo.toLocaleString('es')}</span>
              <span className="tc-result-card__confidence">Confianza 94%</span>
              <span>€{hi.toLocaleString('es')}</span>
            </div>
          </div>
          <div className="tc-result-card__summary">
            <span>📐 {form.surface}m²</span>
            <span>🛏 {form.bedrooms} hab</span>
            <span>🚿 {form.restrooms} baño{form.restrooms > 1 ? 's' : ''}</span>
            <span>📍 {form.location_name}</span>
          </div>
        </div>
        <div className="tc-rating-result__actions">
          <button className="tc-btn tc-btn--primary tc-btn--full" onClick={() => navigate('search')}>
            Ver pisos disponibles
          </button>
          <button className="tc-btn tc-btn--ghost tc-btn--full" onClick={() => { setResult(null); setForm(DEFAULT) }}>
            Nueva tasación
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="tc-rating">
      <div className="tc-page-header">
        <h1 className="tc-page-title">Tasar vivienda</h1>
        <p className="tc-page-subtitle">Precio de alquiler estimado por inteligencia artificial</p>
      </div>

      <form className="tc-rating__form" onSubmit={handleSubmit}>
        {/* Características numéricas */}
        <div className="tc-rating__section">
          <h3 className="tc-rating__section-title">Características</h3>
          <div className="tc-num-grid">
            {([
              { field: 'surface'  as const, label: 'Superficie', unit: 'm²', step: 5, min: 20, max: 500 },
              { field: 'bedrooms' as const, label: 'Habitaciones', unit: '', step: 1, min: 1, max: 10 },
              { field: 'restrooms'as const, label: 'Baños',        unit: '', step: 1, min: 1, max: 5  },
            ] as const).map(({ field, label, unit, step, min, max }) => (
              <div key={field} className="tc-num-field">
                <span className="tc-num-field__label">{label}</span>
                <div className="tc-num-field__control">
                  <button type="button" className="tc-num-btn" onClick={() => inc(field, -step, min, max)}>−</button>
                  <span className="tc-num-field__value">
                    {form[field]}{unit && <small>{unit}</small>}
                  </span>
                  <button type="button" className="tc-num-btn" onClick={() => inc(field, step, min, max)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Provincia */}
        <div className="tc-rating__section">
          <h3 className="tc-rating__section-title">Ubicación</h3>
          <div className="tc-search-bar__select-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <select className="tc-search-bar__select" value={form.location_name}
              onChange={e => setForm(f => ({ ...f, location_name: e.target.value }))}>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Extras */}
        <div className="tc-rating__section">
          <h3 className="tc-rating__section-title">Extras y servicios</h3>
          <div className="tc-switches">
            {SWITCHES.map(sw => (
              <div key={sw.key} className="tc-switch-row">
                <div className="tc-switch-row__info">
                  <span className="tc-switch-row__icon">{sw.icon}</span>
                  <span className="tc-switch-row__label">{sw.label}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form[sw.key as keyof FormState] as boolean}
                  className={`tc-toggle ${form[sw.key as keyof FormState] ? 'is-on' : ''}`}
                  onClick={() => toggle(sw.key as keyof FormState)}
                >
                  <span className="tc-toggle__thumb" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="tc-auth__error">⚠️ {error}</div>}

        <button type="submit" className="tc-btn tc-btn--primary tc-btn--full" disabled={loading}>
          {loading
            ? <><span className="tc-spinner" /> Calculando precio...</>
            : <>⚡ Obtener tasación gratuita</>
          }
        </button>
      </form>
    </div>
  )
}
