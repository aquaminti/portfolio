import { useState } from 'react'
import { sendMessage } from '../services/api'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/Toast'
import './Contact.css'

const socials = [
  { label: 'GitHub',    url: 'https://github.com/aquaminti',  display: 'github.com/aquaminti',     color: 'blue' },
  { label: 'Telegram',  url: 'https://t.me/holygraII',         display: '@holygraII',               color: 'teal' },
  { label: 'Email',     url: 'mailto:aldanshakhan@gmail.com',  display: 'aldanshakhan@gmail.com',   color: 'pink' },
]

export default function Contact() {
  const { toasts, success, error } = useToast()
  const [form, setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Введите имя'
    if (!form.email.trim())   e.email   = 'Введите email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Неверный email'
    if (!form.message.trim()) e.message = 'Введите сообщение'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await sendMessage(form)
      success('Сообщение отправлено! Отвечу в течение 24 часов.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      error(err.message || 'Не удалось отправить сообщение')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <>
      <ToastContainer toasts={toasts} />
      <section className="contact section-wrap">
        <p className="section-label tag-accent">КОНТАКТЫ</p>
        <h2 className="section-title">Напишите сообщение</h2>

        <div className="contact-grid">
          <div className="contact-left">
            <p className="contact-sub">
              Пишите
            </p>
            <div className="social-list">
              {socials.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                  className={`social-link social-link--${s.color}`}>
                  <span className="social-dot" />
                  <span className="social-label">{s.label}</span>
                  <span className="social-url">{s.display}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-card">
            <h3 className="form-title">Написать сообщение</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label>Ваше имя</label>
                <input value={form.name} onChange={set('name')} placeholder="Ваше имя" />
                {errors.name && <p className="field-err">{errors.name}</p>}
              </div>
              <div className="field">
                <label>Email адрес</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
                {errors.email && <p className="field-err">{errors.email}</p>}
              </div>
              <div className="field">
                <label>Тема</label>
                <input value={form.subject} onChange={set('subject')} placeholder="Тема сообщения" />
              </div>
              <div className="field">
                <label>Сообщение</label>
                <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Сообщение" />
                {errors.message && <p className="field-err">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? <><span className="spinner" /> Отправляем...</> : 'Отправить сообщение →'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
