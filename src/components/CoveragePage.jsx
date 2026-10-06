import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import datasets from '../data/datasets.json'
import coverage from '../data/coverage.json'
import { colorOf } from '../colors.js'
import { useCart } from '../cart.jsx'
import CoverageMap from './CoverageMap.jsx'
import Timeline from './Timeline.jsx'
import LatitudeChart from './LatitudeChart.jsx'
import PanelToggle from './PanelToggle.jsx'
import { startsOpen } from '../viewport.js'

const DEFAULT = ['oco2-lite', 'tropomi-ch4', 'tccon']

export default function CoveragePage() {
  const { ids } = useCart()
  const [params] = useSearchParams()
  const [on, setOn] = useState(params.get('layers') === 'all' ? datasets.map(d => d.id) : ids.length ? ids : DEFAULT)
  const [panel, setPanel] = useState(startsOpen)
  const toggle = id => setOn(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id]))
  const shown = datasets.filter(d => on.includes(d.id))

  return (
    <div className={panel ? 'layout' : 'layout closed'}>
      <aside className="side" aria-label="Dataset layers">
        <section className="layer">
          <h2>Layers</h2>
          <div className="layer-body">
            <div className="actions">
              <button className="link" onClick={() => setOn(datasets.map(d => d.id))}>All</button>
              <button className="link" onClick={() => setOn([])}>None</button>
              <button className="link" onClick={() => setOn(ids)}>My selection</button>
            </div>
          </div>
        </section>
        {['Satellite', 'Model', 'Inventory', 'Ground-based', 'In situ'].map(t => (
          <section className="layer" key={t}>
            <h2>{t}</h2>
            <div className="layer-body">
              {datasets.filter(d => d.type === t).map(d => (
                <label key={d.id} className="opt">
                  <input type="checkbox" checked={on.includes(d.id)} onChange={() => toggle(d.id)} />
                  <i className="swatch" style={{ background: colorOf(d.id) }} />{d.shortName}
                </label>
              ))}
            </div>
          </section>
        ))}
      </aside>
      <section>
        <div className="pagebar"><PanelToggle open={panel} onToggle={() => setPanel(p => !p)} label="layers" /></div>
        <h1>Coverage explorer</h1>
        <p className="lead">Toggle layers to overlay datasets and spot gaps and overlaps in space and time.</p>
        <div className="sbs">
          <div>
            <h2>Where</h2>
            <CoverageMap items={shown} label="Spatial coverage of selected datasets" />
            {shown.length > 0 && <LatitudeChart items={shown} />}
            <p className="note">Shaded bands show latitude coverage and dots show station locations. Where layers overlap, use the latitude chart below to tell them apart. Ocean-only, land-only and sparse sampling are described on each dataset's page.</p>
          </div>
          <div>
            <h2>When</h2>
            {shown.length ? <Timeline items={shown} /> : <p>Turn on a layer to see its timeline.</p>}
        <ul className="notes">
          {shown.map(d => (
            <li key={d.id}><i className="swatch" style={{ background: colorOf(d.id) }} /><Link to={`/dataset/${d.id}`}>{d.shortName}</Link>: {coverage[d.id]?.note}</li>
          ))}
        </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
