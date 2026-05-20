import { useState } from 'react'

export default function SearchDetail({ navigate, property: p }) {
  const [activeImg, setActiveImg] = useState(0)

  if (!p) {
    return (
      <div className="tc-detail-empty">
        <p>No se ha seleccionado ninguna vivienda.</p>
        <button className="tc-btn tc-btn--primary" onClick={() => navigate('search')}>Volver a buscar</button>
      </div>
    )
  }

  const images = [
    p.image,
    `https://picsum.photos/seed/${p.id + 100}/400/280`,
    `https://picsum.photos/seed/${p.id + 200}/400/280`,
    `https://picsum.photos/seed/${p.id + 300}/400/280`,
  ]

  const features = [
    { label: 'Superficie', value: `${p.surface} m²`, icon: '📐' },
    { label: 'Habitaciones', value: p.bedrooms, icon: '🛏' },
    { label: 'Baños', value: p.bathrooms, icon: '🚿' },
    { label: 'Planta', value: `${p.floor}ª`, icon: '🏗️' },
    p.hasElevator && { label: 'Ascensor', value: 'Sí', icon: '🛗' },
    p.hasParking && { label: 'Parking', value: 'Incluido', icon: '🅿️' },
    p.hasBalcony && { label: 'Balcón', value: 'Sí', icon: '🪟' },
  ].filter(Boolean)

  return (
    <div className="tc-detail">
      {/* Back button */}
      <button className="tc-detail__back" onClick={() => navigate('search')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Volver
      </button>

      {/* Gallery */}
      <div className="tc-gallery">
        <div className="tc-gallery__main">
          <img src={images[activeImg]} alt={p.title} className="tc-gallery__main-img" />
          <div className="tc-gallery__overlay">
            <div className="tc-gallery__type">{p.type}</div>
          </div>
        </div>
        <div className="tc-gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`tc-gallery__thumb ${activeImg === i ? 'is-active' : ''}`}
              onClick={() => setActiveImg(i)}
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="tc-detail__content">
        <div className="tc-detail__header">
          <div>
            <h1 className="tc-detail__title">{p.title}</h1>
            <p className="tc-detail__location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {p.neighborhood}, {p.province}
            </p>
          </div>
          <div className="tc-detail__rating">
            <span>⭐</span>
            <strong>{p.rating}</strong>
          </div>
        </div>

        {/* Price card */}
        <div className="tc-detail__price-card">
          <div className="tc-detail__price-main">
            <span className="tc-detail__price-value">€{p.price.toLocaleString('es')}</span>
            <span className="tc-detail__price-period">/mes</span>
          </div>
          <div className="tc-detail__price-ai">
            <span className="tc-detail__price-ai-badge">🤖 IA</span>
            <span>Precio estimado por inteligencia artificial</span>
          </div>
          <button className="tc-btn tc-btn--primary tc-btn--full" onClick={() => navigate('contact')}>
            Contactar propietario
          </button>
          <button className="tc-btn tc-btn--ghost tc-btn--full" onClick={() => navigate('rating')}>
            Ver tasación detallada
          </button>
        </div>

        {/* Features */}
        <div className="tc-detail__section">
          <h2 className="tc-detail__section-title">Características</h2>
          <div className="tc-features-grid">
            {features.map((f, i) => (
              <div key={i} className="tc-feature-item">
                <span className="tc-feature-item__icon">{f.icon}</span>
                <div>
                  <p className="tc-feature-item__label">{f.label}</p>
                  <p className="tc-feature-item__value">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="tc-detail__section">
          <h2 className="tc-detail__section-title">Descripción</h2>
          <p className="tc-detail__desc">
            Magnífico {p.type.toLowerCase()} en pleno {p.neighborhood}, {p.province}. 
            Dispone de {p.surface}m² distribuidos en {p.bedrooms} habitaciones y {p.bathrooms} 
            {p.bathrooms > 1 ? ' baños' : ' baño'}. 
            {p.hasElevator ? ' Edificio con ascensor.' : ''}
            {p.hasParking ? ' Incluye plaza de parking.' : ''}
            {p.hasBalcony ? ' Cuenta con balcón exterior.' : ''}
            {' '}Excelente comunicación con el transporte público y todos los servicios a mano.
            Precio estimado por IA basado en datos actualizados del mercado.
          </p>
        </div>

        {/* Map placeholder */}
        <div className="tc-detail__section">
          <h2 className="tc-detail__section-title">Ubicación</h2>
          <div className="tc-map-placeholder">
            <div className="tc-map-placeholder__inner">
              <span>🗺️</span>
              <p>{p.neighborhood}, {p.province}</p>
              <small>Mapa disponible en la versión completa</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}