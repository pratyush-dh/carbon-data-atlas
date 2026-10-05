import { useMemo } from 'react'
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import landTopo from 'world-atlas/land-110m.json'
import coverage from '../data/coverage.json'
import { colorOf } from '../colors.js'

const W = 960
const H = 500
const projection = geoNaturalEarth1().fitSize([W, H], { type: 'Sphere' })
const path = geoPath(projection)
const land = feature(landTopo, landTopo.objects.land)
const LAND_D = path(land)
const GRID_D = path(geoGraticule10())
const SPHERE_D = path({ type: 'Sphere' })

// Draw a lon/lat box by projecting its densified edges, so curved projection edges stay correct.
function rectPath(w, s, e, n) {
  const pts = []
  for (let x = w; x <= e; x += 5) pts.push([x, s])
  for (let y = s; y <= n; y += 5) pts.push([e, y])
  for (let x = e; x >= w; x -= 5) pts.push([x, n])
  for (let y = n; y >= s; y -= 5) pts.push([w, y])
  return 'M' + pts.map(p => projection(p).join(',')).join('L') + 'Z'
}

export default function CoverageMap({ items, label, aoi }) {
  const layers = useMemo(() => items.flatMap(d => {
    const c = coverage[d.id]
    if (!c) return []
    return c.shapes.map((sh, i) => ({ key: `${d.id}-${i}`, color: colorOf(d.id), ...sh }))
  }), [items])

  const areas = layers.filter(l => l.shape !== 'sites')
  const sites = layers.filter(l => l.shape === 'sites')
  const many = areas.length > 1
  // With many layers, thin the fill and interleave dashed outlines so overlapping extents all stay visible.
  const DASH = 9
  const fillFor = nested => (many ? Math.max(0.04, 0.3 / areas.length) : nested ? 0.45 : 0.28)

  return (
    <svg className="map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label || 'Coverage map'}>
      <path d={SPHERE_D} className="map-sea" />
      <path d={GRID_D} className="map-grid" />
      <path d={LAND_D} className="map-land" />
      {areas.map((l, i) => {
        const [w, s, e, n] = l.shape === 'band' ? [-180, l.s, 180, l.n] : [l.w, l.s, l.e, l.n]
        const dash = many ? { strokeDasharray: `${DASH} ${DASH * (areas.length - 1)}`, strokeDashoffset: -i * DASH } : {}
        return <path key={l.key} d={rectPath(w, s, e, n)} fill={l.color} fillOpacity={fillFor(l.shape === 'rect')} stroke={l.color} strokeWidth={many ? 2.4 : 1.5} {...dash} />
      })}
      <path d={LAND_D} className="map-land-top" />
      {sites.map(l => (
        <g key={l.key} fill={l.color} stroke="var(--card)" strokeWidth="1">
          {l.sites.map((p, i) => { const [x, y] = projection(p); return <circle key={i} cx={x} cy={y} r="4.5" /> })}
        </g>
      ))}
      {aoi && <path d={rectPath(...aoi)} className="aoi" />}
    </svg>
  )
}
