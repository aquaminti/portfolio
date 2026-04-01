import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/Toast'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { toasts, success, error } = useToast()

  const [form,    setForm]    = useState({ username: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.username.trim()) e.username = 'Введите логин'
    if (!form.password)        e.password = 'Введите пароль'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      success('Добро пожаловать!')
      setTimeout(() => navigate('/admin'), 800)
    } catch (err) {
      error(err.response?.data?.message || 'Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="auth-page auth-page--center">
        <div className="auth-blob" />
        <div className="auth-card">
          <Link to="/" className="auth-logo mono">shahan.dev</Link>
          <p className="auth-card-label tag-accent">ВХОД В ПАНЕЛЬ</p>
          <h2 className="auth-card-title">Войдите в систему</h2>
          <hr className="auth-divider" />
          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="tag-accent">ЛОГИН</label>
              <input
                value={form.username}
                onChange={set('username')}
                placeholder="Введите логин"
                autoComplete="username"
                autoFocus
              />
              {errors.username && <p className="auth-err">{errors.username}</p>}
            </div>
            <div className="auth-field">
              <label className="tag-accent">ПАРОЛЬ</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
              {errors.password && <p className="auth-err">{errors.password}</p>}
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <><span className="spinner" /> Входим...</> : 'Войти в аккаунт →'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
