import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import datasets from '../data/datasets.json'
import { typeClass } from '../gases.js'

const score = (d, q) => {
  const name = d.shortName.toLowerCase()
  if (name.startsWith(q)) return 4
  if (d.name.toLowerCase().includes(q)) return 3
  if (d.provider.toLowerCase().includes(q) || d.variables.some(v => v.toLowerCase().includes(q))) return 2
  if (d.summary.toLowerCase().includes(q) || d.gases.some(g => g.toLowerCase() === q)) return 1
  return 0
}

// Header search: matches across every dataset and jumps straight to its page.
export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const box = useRef(null)
  const nav = useNavigate()
  const { pathname } = useLocation()

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return datasets.map(d => [d, score(d, t)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([d]) => d)
  }, [q])

  useEffect(() => { setActive(0) }, [q])
  useEffect(() => { setOpen(false); setQ('') }, [pathname])
  useEffect(() => {
    const onDown = e => { if (!box.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const go = d => { nav(`/dataset/${d.id}`); setOpen(false); setQ('') }
  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && results[active]) go(results[active])
    else if (e.key === 'Escape') { setOpen(false); e.currentTarget.blur() }
  }

  return (
    <div className="gsearch" ref={box} role="search">
      <label className="searchbox">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input type="search" value={q} placeholder="Search all datasets" aria-label="Search all datasets"
          role="combobox" aria-expanded={open && q.trim() !== ''} aria-controls="gsearch-list" aria-autocomplete="list"
          onChange={e => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
      </label>
      {open && q.trim() && (
        <ul className="gresults" id="gsearch-list" role="listbox">
          {results.map((d, i) => (
            <li key={d.id} role="option" aria-selected={i === active} className={i === active ? 'on' : ''}
              onMouseEnter={() => setActive(i)} onMouseDown={e => { e.preventDefault(); go(d) }}>
              <span className={`tag ${typeClass(d.type)}`}>{d.type}</span>
              <b>{d.shortName}</b>
              <small>{d.gases.join(' · ')} · {d.provider}</small>
            </li>
          ))}
          {!results.length && <li className="none">No datasets match “{q}”.</li>}
        </ul>
      )}
    </div>
  )
}
