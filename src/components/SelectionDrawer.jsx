import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import datasets from '../data/datasets.json'
import { useCart } from '../cart.jsx'

const IDLE_MS = 6000

// Slide-in tray for the current selection. Closes on Esc, outside click,
// or a few seconds after the pointer leaves it.
export default function SelectionDrawer() {
  const { ids, toggle, clear } = useCart()
  const [open, setOpen] = useState(false)
  const panel = useRef(null)
  const button = useRef(null)
  const timer = useRef(null)

  const arm = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), IDLE_MS) }
  const disarm = () => clearTimeout(timer.current)

  useEffect(() => {
    if (!open) return
    arm()
    const onKey = e => e.key === 'Escape' && setOpen(false)
    const onDown = e => {
      if (!panel.current?.contains(e.target) && !button.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => { disarm(); document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown) }
  }, [open])

  useEffect(() => { if (!ids.length) setOpen(false) }, [ids.length])

  if (!ids.length) return null
  const picked = datasets.filter(d => ids.includes(d.id))

  return (
    <>
      <button ref={button} className="btn small sel-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        Selection <span className="badge">{ids.length}</span>
      </button>
      <aside ref={panel} className={open ? 'drawer open' : 'drawer'} aria-label="Your selection" aria-hidden={!open}
        onMouseEnter={disarm} onMouseLeave={arm}>
        <div className="drawer-head">
          <strong>Your selection</strong>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close selection">✕</button>
        </div>
        <ul className="drawer-list">
          {picked.map(d => (
            <li key={d.id}>
              <Link to={`/dataset/${d.id}`} onClick={() => setOpen(false)}>{d.shortName}</Link>
              <small>{d.type}</small>
              <button className="link" onClick={() => toggle(d.id)} aria-label={`Remove ${d.shortName}`}>remove</button>
            </li>
          ))}
        </ul>
        <div className="drawer-actions">
          {ids.length > 1 && <Link className="btn primary" to="/compare" onClick={() => setOpen(false)}>Compare</Link>}
          <Link className="btn" to="/cart" onClick={() => setOpen(false)}>Export</Link>
          <button className="btn" onClick={clear}>Clear selection</button>
        </div>
      </aside>
    </>
  )
}
