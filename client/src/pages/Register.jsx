import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/Toast'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const { toasts, success, error } = useToast()

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.username.trim())          e.username = 'Введите логин'
    else if (form.username.length < 3)  e.username = 'Минимум 3 символа'
    if (!form.email.trim())             e.email    = 'Введите email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Неверный формат email'
    if (!form.password)                 e.password = 'Введите пароль'
    else if (form.password.length < 6)  e.password = 'Минимум 6 символов'
    if (!form.confirm)                  e.confirm  = 'Повторите пароль'
    else if (form.confirm !== form.password) e.confirm = 'Пароли не совпадают'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await axios.post('/api/auth/register', {
        username: form.username,
        email:    form.email,
        password: form.password,
      })
      success('Аккаунт создан! Войдите в систему.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      error(err.response?.data?.message || 'Ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const steps = [
    ['01', 'Введите данные',     'Укажите логин и пароль'],
    ['02', 'Подтвердите пароль', 'Введите пароль повторно'],
    ['03', 'Готово!',            'Войдите в панель'],
  ]

  return (
    <>
      <ToastContainer toasts={toasts} />

      <div className="auth-page">
        <div className="auth-blob" />

        <div className="auth-left">
          <Link to="/" className="auth-logo mono">shahan.dev</Link>

          <div className="auth-welcome">
            <h1>
              <span className="auth-h-light">Создайте аккаунт</span><br />
              <span className="auth-h-bold">Всё готово за минуту.</span>
            </h1>
            <p className="auth-sub">
              Зарегистрируйтесь чтобы получить доступ к<br />
              административной панели портфолио.
            </p>
          </div>

          <div className="auth-steps">
            {steps.map(([num, title, desc], i) => (
              <div key={num} className="auth-step">
                <div className="step-left">
                  <span className="step-num mono">{num}</span>
                  {i < steps.length - 1 && <span className="step-line" />}
                </div>
                <div>
                  <p className="step-title">{title}</p>
                  <p className="step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-card">
          <p className="auth-card-label tag-accent">РЕГИСТРАЦИЯ</p>
          <h2 className="auth-card-title">Создайте аккаунт</h2>
          <hr className="auth-divider" />

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="tag-accent">ЛОГИН</label>
              <input
                value={form.username}
                onChange={set('username')}
                placeholder="Придумайте логин"
                autoComplete="username"
              />
              {errors.username && <p className="auth-err">{errors.username}</p>}
            </div>

            <div className="auth-field">
              <label className="tag-accent">EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="Ваш email адрес"
                autoComplete="email"
              />
              {errors.email && <p className="auth-err">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label className="tag-accent">ПАРОЛЬ</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Придумайте пароль"
                autoComplete="new-password"
              />
              {errors.password && <p className="auth-err">{errors.password}</p>}
            </div>

            <div className="auth-field">
              <label className="tag-accent">ПОДТВЕРЖДЕНИЕ ПАРОЛЯ</label>
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Повторите пароль"
                autoComplete="new-password"
              />
              {errors.confirm && <p className="auth-err">{errors.confirm}</p>}
            </div>

            <p className="auth-terms">
              Создавая аккаунт, вы соглашаетесь с условиями использования.
            </p>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <><span className="spinner" /> Создаём...</> : 'Создать аккаунт →'}
            </button>

            <p className="auth-switch">
              Уже есть аккаунт?{' '}
              <Link to="/login">Войти</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
