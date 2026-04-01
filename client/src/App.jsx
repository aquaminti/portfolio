import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useState } from 'react'

import Navbar   from './components/Navbar'
import Footer   from './components/Footer'
import Hero     from './pages/Hero'
import About    from './pages/About'
import Skills   from './pages/Skills'
import Projects from './pages/Projects'
import Contact  from './pages/Contact'
import Login    from './pages/Login'
import Admin    from './pages/Admin'
import NotFound from './pages/NotFound'

function AdminRoute() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'))

  if (!authed) return <Navigate to="/login" replace />

  return (
    <Admin
      onLogout={() => {
        localStorage.removeItem('token')
        setAuthed(false)
        navigate('/')
      }}
    />
  )
}

function PublicLayout() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  const routes = (
    <Routes>
      <Route path="/"         element={<Hero />} />
      <Route path="/about"    element={<About />} />
      <Route path="/skills"   element={<Skills />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact"  element={<Contact />} />
      <Route path="/login"    element={<Login />} />
      <Route path="*"         element={<NotFound />} />
    </Routes>
  )

  if (isLogin) return <div key={pathname} className="page-transition">{routes}</div>

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div key={pathname} className="page-transition">{routes}</div>
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/*"       element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
