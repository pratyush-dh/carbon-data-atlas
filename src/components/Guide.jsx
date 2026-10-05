import { Link } from 'react-router-dom'
import datasets from '../data/datasets.json'
import guide from '../data/guide.json'
import { useCart } from '../cart.jsx'

export default function Guide() {
  const { ids: selected, toggle } = useCart()
  const addAll = ids => ids.filter(id => !selected.includes(id)).forEach(toggle)

  return (
    <>
      <h1>Which datasets should I use?</h1>
      <p className="lead">Pick the goal closest to yours. Each recipe lists datasets that work well together and why.</p>
      <div className="grid">
        {guide.map(g => (
          <article key={g.goal} className="card">
            <h2>{g.goal}</h2>
            <p>{g.how}</p>
            <ul>
              {g.ids.map(id => {
                const d = datasets.find(x => x.id === id)
                return d && <li key={id}><Link to={`/dataset/${id}`}>{d.shortName}</Link> <small>({d.type})</small></li>
              })}
            </ul>
            <button className="btn" onClick={() => addAll(g.ids)}>Select all {g.ids.length}</button>
          </article>
        ))}
      </div>
    </>
  )
}
