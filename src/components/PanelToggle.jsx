// Standard "sidebar" icon: a window with a panel strip on the left or right.
// The strip is filled while the panel is open.
export default function PanelToggle({ open, onToggle, side = 'left', label = 'panel' }) {
  const x = side === 'left' ? 3 : 15
  const divider = side === 'left' ? 9 : 15
  const text = `${open ? 'Hide' : 'Show'} ${label}`
  return (
    <button className="icon-btn" onClick={onToggle} aria-expanded={open} aria-label={text} title={text}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <rect x={x} y="4" width="6" height="16" className={open ? 'fill on' : 'fill'} />
        <path d={`M${divider} 4v16`} />
      </svg>
    </button>
  )
}
