import { Link } from 'react-router-dom'
import datasets from '../data/datasets.json'
import { useCart } from '../cart.jsx'
import { download, toCitations, toCsv, toJson, toLinks, toPython } from '../exporters.js'

export default function Cart() {
  const { ids, toggle, clear } = useCart()
  const picked = datasets.filter(d => ids.includes(d.id))
  if (!picked.length) return <><h1>Your selection</h1><p>Nothing selected yet. <Link to="/explore">Browse the catalog</Link>.</p></>

  return (
    <>
      <h1>Your selection</h1>
      <ul className="sel">
        {picked.map(d => (
          <li key={d.id}>
            <div><Link to={`/dataset/${d.id}`}>{d.name}</Link><small>{d.access}</small></div>
            <a href={d.downloadUrl} target="_blank" rel="noreferrer">Go to data ↗</a>
            <button className="link" onClick={() => toggle(d.id)}>remove</button>
          </li>
        ))}
      </ul>
      <h2>Export</h2>
      <div className="actions">
        <button className="btn" onClick={() => download('carbon-datasets.csv', toCsv(picked), 'text/csv')}>Metadata (CSV)</button>
        <button className="btn" onClick={() => download('carbon-datasets.json', toJson(picked), 'application/json')}>Metadata (JSON)</button>
        <button className="btn" onClick={() => download('download-links.txt', toLinks(picked))}>Download links (TXT)</button>
        <button className="btn" onClick={() => download('open_portals.py', toPython(picked))}>Starter script (Python)</button>
        <button className="btn" onClick={() => download('citations.txt', toCitations(picked))}>Citations (TXT)</button>
        <button className="link" onClick={clear}>Clear all</button>
      </div>
      <p className="note">Data files are hosted by each provider and most need a free account, so exports give you the links and requirements rather than the data itself.</p>
    </>
  )
}
