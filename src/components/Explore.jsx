import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import datasets from '../data/datasets.json'
import { GASES, TYPES, typeClass } from '../gases.js'
import { REGIONS, covers, parseBbox } from '../geo.js'
import AddButton from './AddButton.jsx'
import CoverageMap from './CoverageMap.jsx'
import PanelToggle from './PanelToggle.jsx'
import { startsOpen } from '../viewport.js'
import SearchBox from './SearchBox.jsx'
import guide from '../data/guide.json'
import Carousel from './Carousel.jsx'
import SelectionDrawer from './SelectionDrawer.jsx'

const FEATURED = ['oco2-lite', 'tropomi-ch4', 'carbontracker', 'odiac', 'tccon', 'micasa', 'edgar', 'socat', 'gedi-l4b', 'cams-ghg'].map(id => datasets.find(d => d.id === id))
const EDGES = [['West', 0, -180, 180], ['South', 1, -90, 90], ['East', 2, -180, 180], ['North', 3, -90, 90]]

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const [panel, setPanel] = useState(startsOpen)
  const gas = params.get('gas') || ''
  const type = params.get('type') || ''
  const q = params.get('q') || ''
  const area = params.get('area') || ''
  const custom = params.get('bbox') || '-180,-90,180,90'

  const set = patch => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k))
    setParams(next, { replace: true })
  }

  const bbox = area === 'custom' ? parseBbox(custom) : REGIONS.find(r => r.key === area)?.bbox || null
  const byGas = useMemo(() => datasets.filter(d => d.gases.includes(gas) && (!bbox || covers(d.id, bbox))), [gas, bbox])
  const results = useMemo(() => byGas.filter(d => {
    if (type && d.type !== type) return false
    const hay = [d.name, d.shortName, d.summary, d.provider, ...d.variables].join(' ').toLowerCase()
    return hay.includes(q.toLowerCase())
  }), [byGas, type, q])

  const gasInfo = GASES.find(g => g.key === gas)
  const areaLabel = area === 'custom' ? 'Custom area' : REGIONS.find(r => r.key === area)?.label
  const setEdge = (i, v) => {
    const parts = custom.split(',')
    parts[i] = v
    set({ bbox: parts.join(',') })
  }

  return (
    <div className={panel ? 'layout' : 'layout closed'}>
      <aside className="side" aria-label="Filters">
        <div className="side-head">
          <strong>Filters</strong>
          <button className="btn small" disabled={!gas} onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
        <section className="layer">
          <h2><span className="n">1</span> Gas</h2>
          <div className="layer-body">
            {GASES.map(g => (
              <button key={g.key} className={gas === g.key ? 'opt on' : 'opt'} aria-pressed={gas === g.key}
                onClick={() => set({ gas: gas === g.key ? '' : g.key, type: '' })}>
                <span className="sym">{g.symbol}</span>
                <span>{g.name}</span>
                <span className="ct">{datasets.filter(d => d.gases.includes(g.key)).length}</span>
              </button>
            ))}
          </div>
        </section>

        {gas && (
          <section className="layer">
            <h2><span className="n">2</span> Data type</h2>
            <div className="layer-body">
              <button className={!type ? 'opt on' : 'opt'} aria-pressed={!type} onClick={() => set({ type: '' })}>
                <span>All types</span><span className="ct">{byGas.length}</span>
              </button>
              {TYPES.filter(t => byGas.some(d => d.type === t.key)).map(t => (
                <button key={t.key} className={type === t.key ? 'opt on' : 'opt'} aria-pressed={type === t.key}
                  onClick={() => set({ type: type === t.key ? '' : t.key })}>
                  <span><span className={`dot ${typeClass(t.key)}`}>{t.key}</span><small>{t.blurb}</small></span>
                  <span className="ct">{byGas.filter(d => d.type === t.key).length}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {gas && (
          <section className="layer">
            <h2><span className="n">3</span> Area of interest</h2>
            <div className="layer-body pad">
              <select value={area} onChange={e => set({ area: e.target.value, bbox: '' })} aria-label="Area of interest">
                <option value="">Anywhere (global)</option>
                {REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                <option value="custom">Custom bounds…</option>
              </select>
              {area === 'custom' && (
                <div className="bbox">
                  {EDGES.map(([label, i, min, max]) => (
                    <label key={label}>{label}
                      <input type="number" min={min} max={max} value={custom.split(',')[i]} onChange={e => setEdge(i, e.target.value)} />
                    </label>
                  ))}
                </div>
              )}
              {area === 'custom' && !bbox && <p className="hint">West must be less than east, and south less than north.</p>}
              <CoverageMap items={results} aoi={bbox || undefined} label="Datasets matching your filters" />
              <p className="hint">Dashed box is your area. Matching is based on approximate dataset footprints.</p>
            </div>
          </section>
        )}
      </aside>

      <section>
        <div className="pagebar"><PanelToggle open={panel} onToggle={() => setPanel(p => !p)} label="filters" />
          <SelectionDrawer />
        </div>
        {!gas ? (
          <div className="start">
            <h2>Start with a gas</h2>
            <p>Which greenhouse gas are you working on? Pick one and we will narrow the atlas to datasets that measure or estimate it.</p>
            <ol className="howto">
              <li><span className="num">1</span><b>Choose a gas, type and area</b><small>Filters appear step by step in the panel.</small></li>
              <li><span className="num">2</span><b>Compare side by side</b><small>Resolution, coverage maps, timelines, latency and access.</small></li>
              <li><span className="num">3</span><b>Go straight to the data</b><small>Select datasets, then export links, metadata and citations.</small></li>
            </ol>
            <div className="gaschips">
              {GASES.map(g => (
                <button key={g.key} className="gaschip" onClick={() => set({ gas: g.key })}>
                  <span className="sym">{g.symbol}</span>
                  <span>{g.name}<small>{datasets.filter(d => d.gases.includes(g.key)).length} datasets</small></span>
                </button>
              ))}
            </div>
            <h3 className="subhead">A look at what is in the atlas</h3>
            <Carousel items={FEATURED} />
            <h3 className="subhead">Or start from what you want to do</h3>
            <div className="goals">
              {guide.map(g => <Link key={g.goal} to="/guide" className="goal">{g.goal}</Link>)}
            </div>
          </div>
        ) : (
          <>
            <div className="toolbar">
              <div className="crumbs">
                <b>{gasInfo.symbol}</b>{type && <> › <b>{type}</b></>}{bbox && <> › <b>{areaLabel}</b></>} · {results.length} dataset{results.length === 1 ? '' : 's'}
              </div>
              <SearchBox value={q} onChange={v => set({ q: v })} placeholder="Search name, variable, provider" />
            </div>
            <p className="hint">Select datasets to compare or export them from the Selection tab.</p>
            <div className="grid">
              {results.map(d => (
                <article key={d.id} className="card">
                  <span className={`tag ${typeClass(d.type)}`}>{d.type}</span>
                  <h3><Link to={`/dataset/${d.id}`}>{d.shortName}</Link></h3>
                  <CoverageMap items={[d]} aoi={bbox || undefined} label={`Coverage of ${d.shortName}`} />
                  <p>{d.summary}</p>
                  <dl>
                    <dt>Resolution</dt><dd>{d.spatial}</dd>
                    <dt>Record</dt><dd>{d.start} – {d.end}</dd>
                    <dt>Access</dt><dd>{d.access.split('. ')[0]}</dd>
                  </dl>
                  <AddButton id={d.id} />
                </article>
              ))}
              {!results.length && <p>No datasets match. Try “All types”, a different area, or clear the search.</p>}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
