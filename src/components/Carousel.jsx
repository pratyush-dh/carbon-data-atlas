import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { typeClass } from '../gases.js'
import CoverageMap from './CoverageMap.jsx'

export default function Carousel({ items }) {
  const track = useRef(null)
  const paused = useRef(false)

  const step = dir => {
    const el = track.current
    if (!el) return
    const w = el.firstElementChild.getBoundingClientRect().width + 14
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
    else el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => { if (!paused.current) step(1) }, 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label="Example datasets"
      onMouseEnter={() => { paused.current = true }} onMouseLeave={() => { paused.current = false }}
      onFocus={() => { paused.current = true }} onBlur={() => { paused.current = false }}>
      <button className="car-btn prev" onClick={() => step(-1)} aria-label="Previous datasets">‹</button>
      <div className="track" ref={track}>
        {items.map(d => (
          <Link key={d.id} to={`/dataset/${d.id}`} className="slide">
            <span className={`tag ${typeClass(d.type)}`}>{d.type}</span>
            <h3>{d.shortName}</h3>
            <CoverageMap items={[d]} label={`Coverage of ${d.shortName}`} />
            <p>{d.summary}</p>
            <small>{d.gases.join(' · ')} · {d.start} – {d.end}</small>
          </Link>
        ))}
      </div>
      <button className="car-btn next" onClick={() => step(1)} aria-label="Next datasets">›</button>
    </div>
  )
}
