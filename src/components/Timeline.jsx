import coverage from '../data/coverage.json'
import { colorOf } from '../colors.js'

const X0 = 1970
const X1 = 2027
const NOW = 2026.75
const LABEL_W = 120
const W = 960
const ROW = 26
const TICKS = [1970, 1980, 1990, 2000, 2010, 2020]

export default function Timeline({ items }) {
  const rows = items.filter(d => coverage[d.id])
  const H = rows.length * ROW + 30
  const x = yr => LABEL_W + ((Math.min(Math.max(yr, X0), X1) - X0) / (X1 - X0)) * (W - LABEL_W - 10)

  return (
    <svg className="timeline" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Temporal coverage timeline">
      {TICKS.map(t => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1="18" y2={H} className="map-grid" />
          <text x={x(t)} y="12" textAnchor="middle" className="axis">{t}</text>
        </g>
      ))}
      <line x1={x(NOW)} x2={x(NOW)} y1="18" y2={H} className="now" />
      {rows.map((d, i) => {
        const c = coverage[d.id]
        const y = 24 + i * ROW
        const clipped = c.start < X0
        const end = c.end ?? NOW
        return (
          <g key={d.id}>
            <text x={LABEL_W - 8} y={y + 14} textAnchor="end" className="rowlabel">{d.shortName}</text>
            <rect x={x(c.start)} y={y + 3} width={Math.max(3, x(end) - x(c.start))} height="16" rx="3" fill={colorOf(d.id)} />
            {clipped && <text x={x(X0) + 4} y={y + 15} className="clip">◀ {Math.floor(c.start)}</text>}
          </g>
        )
      })}
    </svg>
  )
}
