import coverage from './data/coverage.json'

// bbox is [west, south, east, north]
export const REGIONS = [
  { key: 'north-america', label: 'North America', bbox: [-170, 15, -50, 75] },
  { key: 'south-america', label: 'South America', bbox: [-82, -56, -34, 13] },
  { key: 'europe', label: 'Europe', bbox: [-25, 35, 45, 72] },
  { key: 'africa', label: 'Africa', bbox: [-18, -35, 52, 37] },
  { key: 'asia', label: 'Asia', bbox: [26, -10, 150, 70] },
  { key: 'oceania', label: 'Oceania', bbox: [110, -48, 180, 0] },
  { key: 'arctic', label: 'Arctic (above 66°N)', bbox: [-180, 66, 180, 90] },
  { key: 'antarctica', label: 'Antarctica (below 60°S)', bbox: [-180, -90, 180, -60] }
]

export function parseBbox(str) {
  const p = (str || '').split(',').map(Number)
  if (p.length !== 4 || p.some(Number.isNaN)) return null
  const [w, s, e, n] = p
  return w < e && s < n ? p : null
}

// Uses the approximate footprints in coverage.json, so results are a guide, not a guarantee.
export function covers(id, bbox) {
  const [w, s, e, n] = bbox
  return (coverage[id]?.shapes || []).some(sh => {
    if (sh.shape === 'band') return s <= sh.n && n >= sh.s
    if (sh.shape === 'rect') return w <= sh.e && e >= sh.w && s <= sh.n && n >= sh.s
    return sh.sites.some(([x, y]) => x >= w && x <= e && y >= s && y <= n)
  })
}
