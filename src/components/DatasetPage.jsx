import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import datasets from '../data/datasets.json'
import coverage from '../data/coverage.json'
import { typeClass } from '../gases.js'
import AddButton from './AddButton.jsx'
import CoverageMap from './CoverageMap.jsx'
import PanelToggle from './PanelToggle.jsx'
import Timeline from './Timeline.jsx'

const List = ({ items }) => <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>

function Accordion({ id, title, open, onToggle, children }) {
  return (
    <section className="acc">
      <button className="acc-head" aria-expanded={open} aria-controls={`acc-${id}`} onClick={() => onToggle(id)}>
        <span>{title}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={open ? 'chev open' : 'chev'}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className="acc-body" id={`acc-${id}`} hidden={!open}>{children}</div>
    </section>
  )
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const t = Object.assign(document.createElement('textarea'), { value: text })
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove()
    }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button className="icon-btn copy" onClick={copy} aria-label="Copy citation" title={done ? 'Copied' : 'Copy citation'}>
      {done
        ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
        : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>}
    </button>
  )
}

const SECTIONS = ['when', 'variables', 'strengths', 'limitations', 'best', 'use']

export default function DatasetPage() {
  const { id } = useParams()
  const [panel, setPanel] = useState(true)
  const [open, setOpen] = useState(() => new Set(SECTIONS))
  const d = datasets.find(x => x.id === id)
  if (!d) return <p>Dataset not found. <Link to="/explore">Back to explore</Link></p>

  const toggle = key => setOpen(o => { const n = new Set(o); n.has(key) ? n.delete(key) : n.add(key); return n })
  const facts = [
    ['Provider', d.provider], ['Version', d.version], ['Gases', d.gases.join(', ')],
    ['Spatial resolution', d.spatial], ['Temporal resolution', d.temporal], ['Coverage', d.coverage],
    ['Record', `${d.start} – ${d.end}`], ['Latency', d.latency], ['Format', d.format.join(', ')],
    ['Access', d.access],
    ...(d.doi ? [['DOI', <a href={`https://doi.org/${d.doi}`} target="_blank" rel="noreferrer">{d.doi}</a>]] : [])
  ]
  const acc = (key, title, body) => <Accordion id={key} title={title} open={open.has(key)} onToggle={toggle}>{body}</Accordion>

  return (
    <div className={panel ? 'layout right' : 'layout right closed'}>
      <article className="dataset-article">
        <div className="pagebar"><Link to="/explore">← Explore</Link><PanelToggle open={panel} onToggle={() => setPanel(p => !p)} side="right" label="details" /></div>
        <span className={`tag ${typeClass(d.type)}`}>{d.type}</span>
        <h1 className="dtitle">{d.name}</h1>
        <p className="lead">{d.summary}</p>
        <div className="m-actions">
          <AddButton id={d.id} />
          <a className="btn primary" href={d.downloadUrl} target="_blank" rel="noreferrer">Go to data ↗</a>
          <a className="btn" href={d.docsUrl} target="_blank" rel="noreferrer">Documentation ↗</a>
        </div>

        <div className="dsplit">
          <div className="acc-tools">
            <button className="link" onClick={() => setOpen(new Set(SECTIONS))}>Expand all</button>
            <button className="link" onClick={() => setOpen(new Set())}>Collapse all</button>
          </div>
          <div className="dstatic">
            <section className="dcard"><h2>Where</h2><CoverageMap items={[d]} label={`Spatial coverage of ${d.shortName}`} /><p className="note">{coverage[d.id]?.note}</p></section>
          </div>
          <div className="dscroll">
            {acc('when', 'When', <>
              <Timeline items={[d]} />
              <dl className="mini">
                <div><dt>Record</dt><dd>{d.start} – {d.end}</dd></div>
                <div><dt>Temporal resolution</dt><dd>{d.temporal}</dd></div>
                <div><dt>Latency</dt><dd>{d.latency}</dd></div>
                <div><dt>Format</dt><dd>{d.format.join(', ')}</dd></div>
              </dl>
            </>)}
            {acc('variables', 'Variables', <List items={d.variables} />)}
            {acc('strengths', 'Strengths', <List items={d.strengths} />)}
            {acc('limitations', 'Limitations', <List items={d.limitations} />)}
            {acc('best', 'Best for', <p>{d.bestFor}</p>)}
            {acc('use', 'Use with other datasets', <p>{d.useWith}</p>)}

            <section className="cite-block">
              <div className="cite-head"><h2>Citation</h2><CopyButton text={d.citation} /></div>
              <p className="cite">{d.citation}</p>
            </section>
            <p className="note">Spot something missing or out of date? <Link to={`/contribute?dataset=${d.id}`}>Tell us</Link>.</p>
          </div>
        </div>
      </article>

      <aside className="side" aria-label="Dataset details">
        <section className="layer desk-actions">
          <h2>Actions</h2>
          <div className="layer-actions">
            <AddButton id={d.id} />
            <a className="btn primary" href={d.downloadUrl} target="_blank" rel="noreferrer">Go to data ↗</a>
            <a className="btn" href={d.docsUrl} target="_blank" rel="noreferrer">Documentation ↗</a>
          </div>
        </section>
        <section className="layer">
          <h2>At a glance</h2>
          <dl className="facts-list">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>
      </aside>
    </div>
  )
}
