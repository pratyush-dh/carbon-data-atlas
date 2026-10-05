import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import datasets from '../data/datasets.json'
import coverage from '../data/coverage.json'
import { colorOf } from '../colors.js'
import CoverageMap from './CoverageMap.jsx'

const ORDER = ['tropomi-ch4', 'oco2-lite', 'tccon', 'cams-ghg', 'odiac', 'vulcan', 'obspack', 'socat', 'gedi-l4b', 'carbontracker']
const SHOW = ORDER.map(id => datasets.find(d => d.id === id))

const CURL_MS = 2200
const RADIUS = 40 // radius of the paper bend, px
const ANGLE = (32 * Math.PI) / 180
const D = [-Math.cos(ANGLE), -Math.sin(ANGLE)] // the fold travels from the bottom-right corner toward the top-left
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Sutherland-Hodgman clip of a polygon against the half-plane where f(p) >= 0.
function clip(poly, f) {
  const out = []
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length]
    const fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) {
      const k = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k])
    }
  })
  return out
}
const pts = poly => poly.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

function Page({ d }) {
  return (
    <>
      <CoverageMap items={[d]} label={`Coverage of ${d.shortName}`} />
      <p className="cap"><i style={{ background: colorOf(d.id) }} /><Link to={`/dataset/${d.id}`}>{d.shortName}</Link> <span>{d.type}</span></p>
      <p className="note">{coverage[d.id]?.note}</p>
    </>
  )
}

// A page turn. The corner lifts, the paper bends around a cylinder and folds back over the page,
// showing its blank reverse side, then slides off while the next dataset is revealed beneath.
//
// Geometry: x = distance from the bottom-right corner along D. The fold sits at x = s.
// A peeled point at distance u behind the fold lies on the bend while u < pi*R (x' = s - R*sin(u/R)),
// then on the flat flap (x' = s + u - pi*R) lying over the remaining page.
export default function HeroShowcase() {
  const [cur, setCur] = useState(0)
  const [leaf, setLeaf] = useState(null)
  const [hold, setHold] = useState(false)
  const leafEl = useRef(null)
  const book = useRef(null)
  const el = useRef({})
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = n => {
    if (n === cur) return
    setLeaf(reduced ? null : cur)
    setCur(n)
  }

  useEffect(() => {
    if (hold || reduced) return
    const t = setInterval(() => setCur(c => { setLeaf(c); return (c + 1) % SHOW.length }), 4860)
    return () => clearInterval(t)
  }, [hold, reduced])

  useLayoutEffect(() => {
    if (leaf === null || !book.current) return
    const { width: W, height: H } = book.current.getBoundingClientRect()
    const rect = [[0, 0], [W, 0], [W, H], [0, H]]
    const proj = p => (p[0] - W) * D[0] + (p[1] - H) * D[1]
    const sMax = W * Math.cos(ANGLE) + H * Math.sin(ANGLE)
    const e = el.current
    const at = k => [W + k * D[0], H + k * D[1]]
    const grad = (g, a, b) => { g.setAttribute('x1', a[0]); g.setAttribute('y1', a[1]); g.setAttribute('x2', b[0]); g.setAttribute('y2', b[1]) }
    const poly = (node, polygon) => node.setAttribute('points', polygon.length > 2 ? pts(polygon) : '')

    const draw = s => {
      const theta = Math.min(s / RADIUS, Math.PI)
      const bandStart = s - RADIUS * Math.sin(Math.min(theta, Math.PI / 2)) // far edge of the bend
      const flapEnd = s > Math.PI * RADIUS ? 2 * s - Math.PI * RADIUS : s       // free edge of the folded-back paper

      const remaining = clip(rect, p => proj(p) - s)
      const revealed = clip(rect, p => bandStart - proj(p))
      const band = clip(clip(rect, p => proj(p) - bandStart), p => s - proj(p))
      const flap = flapEnd > s ? clip(clip(rect, p => proj(p) - s), p => flapEnd - proj(p)) : []
      const beyond = clip(rect, p => proj(p) - flapEnd)

      leafEl.current.style.clipPath = remaining.length > 2 ? `polygon(${remaining.map(p => `${p[0]}px ${p[1]}px`).join(',')})` : 'inset(100%)'
      poly(e.cast, revealed); poly(e.rem, beyond); poly(e.band, band); poly(e.flap, flap)
      grad(e.gCast, at(bandStart), at(bandStart - 90))
      grad(e.gRem, at(flapEnd), at(flapEnd + 80))
      grad(e.gBand, at(bandStart), at(s))
      grad(e.gFlap, at(s), at(Math.max(flapEnd, s + 1)))
    }

    draw(0)
    let raf
    const t0 = performance.now()
    const tick = now => {
      const t = Math.min((now - t0) / CURL_MS, 1)
      draw(ease(t) * (sMax + RADIUS))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setLeaf(null)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [leaf, cur])

  const ref = name => node => { el.current[name] = node }

  return (
    <div className="hero-art" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="book" ref={book}>
        <div className="page under"><Page d={SHOW[cur]} /></div>
        {leaf !== null && <div className="page leaf" ref={leafEl} aria-hidden="true"><Page d={SHOW[leaf]} /></div>}
        <svg className="curl" aria-hidden="true" style={{ display: leaf === null ? 'none' : 'block' }}>
          <defs>
            <linearGradient id="gCast" gradientUnits="userSpaceOnUse" ref={ref('gCast')}><stop offset="0" stopColor="#000" stopOpacity=".6" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
            <linearGradient id="gRem" gradientUnits="userSpaceOnUse" ref={ref('gRem')}><stop offset="0" stopColor="#000" stopOpacity=".45" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
            <linearGradient id="gBand" gradientUnits="userSpaceOnUse" ref={ref('gBand')}>
              <stop offset="0" stopColor="#0f1612" /><stop offset=".22" stopColor="#35463d" /><stop offset=".5" stopColor="#7d9488" /><stop offset=".78" stopColor="#4a5f54" /><stop offset="1" stopColor="#2c3b34" />
            </linearGradient>
            <linearGradient id="gFlap" gradientUnits="userSpaceOnUse" ref={ref('gFlap')}>
              <stop offset="0" stopColor="#2c3b34" /><stop offset=".08" stopColor="#3b4d44" /><stop offset=".5" stopColor="#2a3831" /><stop offset="1" stopColor="#34453c" />
            </linearGradient>
          </defs>
          <polygon ref={ref('cast')} fill="url(#gCast)" />
          <polygon ref={ref('rem')} fill="url(#gRem)" />
          <polygon ref={ref('flap')} fill="url(#gFlap)" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
          <polygon ref={ref('band')} fill="url(#gBand)" />
        </svg>
      </div>
      <div className="dots" role="tablist" aria-label="Example datasets">
        {SHOW.map((s, n) => (
          <button key={s.id} className={n === cur ? 'on' : ''} onClick={() => go(n)} aria-label={`Show ${s.shortName}`} aria-selected={n === cur} role="tab" />
        ))}
      </div>
    </div>
  )
}
