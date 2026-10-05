import { Link } from 'react-router-dom'
import { INSPIRATION } from '../config.js'

// Footer band. The stacked variant is the centered layout used on the Explore page.
export default function HelpCallout({ stacked = false }) {
  if (!stacked) {
    return (
      <div className="callout">
        <strong>Help keep it accurate.</strong>
        <span>We compile this atlas from provider documentation and know it has gaps and goes stale. Missing or wrong something?</span>
        <Link className="btn primary small" to="/contribute">Suggest a fix or collaborate</Link>
      </div>
    )
  }
  return (
    <div className="callout stacked">
      <strong>Help keep it accurate</strong>
      <div className="row">
        <span>Missing or wrong something?</span>
        <Link className="btn primary small" to="/contribute">Suggest a fix or collaborate</Link>
      </div>
      <small>Inspired by the <a href={INSPIRATION.url} target="_blank" rel="noreferrer">{INSPIRATION.name}</a>.</small>
    </div>
  )
}
