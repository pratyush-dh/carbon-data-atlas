import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import HelpCallout from './components/HelpCallout.jsx'
import Landing from './components/Landing.jsx'
import Explore from './components/Explore.jsx'
import DatasetPage from './components/DatasetPage.jsx'
import Compare from './components/Compare.jsx'
import Cart from './components/Cart.jsx'
import Guide from './components/Guide.jsx'
import CoveragePage from './components/CoveragePage.jsx'
import Contribute from './components/Contribute.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import GlobalSearch from './components/GlobalSearch.jsx'
import { useCart } from './cart.jsx'
import { INSPIRATION } from './config.js'

export default function App() {
  const { ids } = useCart()
  const onExplore = useLocation().pathname === '/explore'
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <Link to="/" className="brand" aria-label="Carbon Data Atlas">Carbon <span className="brand-data">Data</span> <span className="brand-atlas">Atlas</span></Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/coverage">Coverage</NavLink>
          <NavLink to="/guide">Guide</NavLink>
          {ids.length > 1 && <NavLink to="/compare">Compare</NavLink>}
          {ids.length > 0 && <NavLink to="/cart">Selection<span className="badge">{ids.length}</span></NavLink>}
          <GlobalSearch />
          <ThemeToggle />
        </nav>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/dataset/:id" element={<DatasetPage />} />
          <Route path="/coverage" element={<CoveragePage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="*" element={<p>Page not found. <Link to="/explore">Back to explore</Link></p>} />
        </Routes>
      </main>
      <footer>
        <HelpCallout stacked={onExplore} />
        <p className="fine">Verify versions, dates and URLs with the provider before relying on them.{!onExplore && <> Inspired by the <a href={INSPIRATION.url} target="_blank" rel="noreferrer">{INSPIRATION.name}</a>.</>}</p>
      </footer>
    </>
  )
}
