import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

const links = [
  { to: '/',        label: 'Главная' },
  { to: '/about',   label: 'Обо мне' },
  { to: '/skills',  label: 'Навыки' },
  { to: '/projects',label: 'Проекты' },
  { to: '/contact', label: 'Контакты' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo mono">shahan.dev</Link>

        <ul className="nav-links hide-mobile">
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <button className="burger" onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
    
    )
}
