import { useCart } from '../cart.jsx'

export default function AddButton({ id }) {
  const { ids, toggle } = useCart()
  const on = ids.includes(id)
  return (
    <button className={on ? 'btn on' : 'btn'} onClick={() => toggle(id)} aria-pressed={on}>
      {on ? '✓ Selected' : 'Select'}
    </button>
  )
}
