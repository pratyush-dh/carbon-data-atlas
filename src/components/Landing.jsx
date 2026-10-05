import { Link } from 'react-router-dom'
import datasets from '../data/datasets.json'
import HeroShowcase from './HeroShowcase.jsx'


const HEADLINE = [
  { t: 'Find' }, { t: 'the' }, { t: 'right' }, { t: 'carbon', hl: true }, { t: 'dataset,', hl: true }, { t: 'faster.' }
]

export default function Landing() {
  const types = new Set(datasets.map(d => d.type)).size
  return (
    <div className="landing">
      <section className="hero">
        <div>
          <p className="eyebrow">An open guide to carbon data</p>
          <h1 className="headline" aria-label="Find the right carbon dataset, faster.">
            {HEADLINE.map((w, i) => (
              <span key={i} className={w.hl ? 'w hl' : 'w'} style={{ animationDelay: `${0.15 + i * 0.12}s` }} aria-hidden="true">{w.t}</span>
            ))}
          </h1>
          <p className="def">
            <strong>Carbon Data Atlas</strong> is a plain-language catalog of satellite, model, inventory and ground-based datasets
            that measure or estimate the atmospheric greenhouse gases carbon dioxide (CO₂), methane (CH₄) and nitrous oxide (N₂O). For each dataset you get what it measures,
            where and when it has data, its strengths and limits, and how to get it, so you can decide whether to use one, another, or several together.
          </p>
          <div className="cta">
            <Link className="btn primary big" to="/explore">Start exploring →</Link>
            <Link className="btn big" to="/guide">Not sure? Use the guide</Link>
          </div>
          <ul className="stats">
            <li><b>{datasets.length}</b> datasets</li>
            <li><b>{types}</b> data types</li>
            <li><b>3</b> gases</li>
          </ul>
        </div>
        <HeroShowcase />
      </section>
    </div>
  )
}
