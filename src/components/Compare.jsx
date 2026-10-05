import { Link } from 'react-router-dom'
import datasets from '../data/datasets.json'
import { useCart } from '../cart.jsx'

const ROWS = [
  ['type', 'Type'], ['gases', 'Gases'], ['spatial', 'Spatial resolution'], ['temporal', 'Temporal resolution'],
  ['coverage', 'Coverage'], ['start', 'Start'], ['end', 'End'], ['latency', 'Latency'], ['format', 'Format'],
  ['access', 'Access'], ['bestFor', 'Best for'], ['limitations', 'Limitations']
]
const show = v => (Array.isArray(v) ? v.join(', ') : v)

export default function Compare() {
  const { ids, toggle } = useCart()
  const picked = datasets.filter(d => ids.includes(d.id))
  if (picked.length < 2) {
    return <><h1>Compare</h1><p>Select at least two datasets in the <Link to="/explore">catalog</Link> to compare them.</p></>
  }
  return (
    <>
      <h1>Compare</h1>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th></th>{picked.map(d => (
              <th key={d.id}><Link to={`/dataset/${d.id}`}>{d.shortName}</Link><br /><button className="link" onClick={() => toggle(d.id)}>remove</button></th>
            ))}</tr>
          </thead>
          <tbody>
            {ROWS.map(([k, label]) => (
              <tr key={k}><th scope="row">{label}</th>{picked.map(d => <td key={d.id}>{show(d[k])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
