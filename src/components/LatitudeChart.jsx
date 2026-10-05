import coverage from '../data/coverage.json'
import { colorOf } from '../colors.js'

const W = 960
const LABEL_W = 120
const ROW = 22
const TICKS = [-90, -60, -30, 0, 30, 60, 90]

// One row per dataset showing the latitudes it covers, so overlapping map layers stay distinguishable.
export default function LatitudeChart({ items }) {
  const rows = items.filter(d => coverage[d.id])
  if (!rows.length) return null
  const H = rows.length * ROW + 30
  const x = lat => LABEL_W + ((lat + 90) / 180) * (W - LABEL_W - 14)
  const label = lat => (lat === 0 ? '0°' : `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`)

  return (
    <svg className="timeline" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Latitude coverage of the selected datasets">
      {TICKS.map(t => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1="18" y2={H} className={t === 0 ? 'now' : 'map-grid'} />
          <text x={x(t)} y="12" textAnchor="middle" className="axis">{label(t)}</text>
        </g>
      ))}
      {rows.map((d, i) => {
        const y = 24 + i * ROW
        const color = colorOf(d.id)
        return (
          <g key={d.id}>
            <text x={LABEL_W - 8} y={y + 13} textAnchor="end" className="rowlabel">{d.shortName}</text>
            {coverage[d.id].shapes.map((sh, k) => {
              if (sh.shape === 'sites') {
                const lats = sh.sites.map(p => p[1])
                return (
                  <g key={k}>
                    <line x1={x(Math.min(...lats))} x2={x(Math.max(...lats))} y1={y + 10} y2={y + 10} stroke={color} strokeOpacity=".4" strokeWidth="2" />
                    {lats.map((lat, j) => <circle key={j} cx={x(lat)} cy={y + 10} r="3.5" fill={color} fillOpacity=".85" />)}
                  </g>
                )
              }
              const nested = sh.shape === 'rect' && coverage[d.id].shapes.length > 1
              return <rect key={k} x={x(sh.s)} y={y + 3} width={Math.max(3, x(sh.n) - x(sh.s))} height="14" rx="3" fill={color} fillOpacity={nested ? 1 : 0.9} />
            })}
          </g>
        )
      })}
    </svg>
  )
}
