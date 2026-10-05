import { createContext, useContext, useEffect, useState } from 'react'

const CartCtx = createContext(null)
const KEY = 'carbon-atlas-cart'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [ids, setIds] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* storage blocked */ }
  }, [ids])
  const toggle = id => setIds(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id]))
  const clear = () => setIds([])
  return <CartCtx.Provider value={{ ids, toggle, clear }}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
