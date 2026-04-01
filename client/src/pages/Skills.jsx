import { useState, useEffect } from 'react'
import { getSkills } from '../services/api'
import './Skills.css'

const FALLBACK = [
  { _id: '1', name: 'HTML5',          category: 'Frontend',      level: 'Базовый' },
  { _id: '2', name: 'CSS3',           category: 'Frontend',      level: 'Базовый' },
  { _id: '3', name: 'JavaScript',     category: 'Frontend',      level: 'Начинающий' },
  { _id: '4', name: 'React',          category: 'Frontend',      level: 'Начинающий' },
  { _id: '5', name: 'MongoDB / Atlas',category: 'Инструменты',   level: 'Базовый' },
  { _id: '6', name: 'Postman',        category: 'Инструменты',   level: 'Базовый' },
  { _id: '7', name: 'Git',            category: 'Инструменты',   level: 'Базовый' },
  { _id: '8', name: 'VS Code',        category: 'Инструменты',   level: 'Базовый' },
  { _id: '9', name: 'Node.js',        category: 'Другое',        level: 'Начинающий' },
  { _id: '10', name: 'Java',          category: 'Другое',        level: 'Начинающий' },
  { _id: '11', name: 'Lua',           category: 'Другое',        level: 'Чуть-чуть' },
  { _id: '12', name: 'Обучаемость',   category: 'Soft Skills',   level: '' },
  { _id: '13', name: 'Любопытство',   category: 'Soft Skills',   level: '' },
  { _id: '14', name: 'Командная работа', category: 'Soft Skills', level: '' },
  { _id: '15', name: 'Внимательность',category: 'Soft Skills',  level: '' },
]

const CATEGORIES = ['Frontend', 'Инструменты', 'Другое', 'Soft Skills']

const CAT_META = {
  'Frontend':    { icon: '◈', color: 'blue' },
  'Инструменты': { icon: '⚙', color: 'teal' },
  'Другое':      { icon: '◎', color: 'purple' },
  'Soft Skills': { icon: '♡', color: 'pink' },
}

export default function Skills() {
  const [skills, setSkills]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSkills()
      .then(r => setSkills(r.data))
      .catch(() => setSkills(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="skills section-wrap">
      <p className="section-label tag-accent">НАВЫКИ</p>
      <h2 className="section-title">Что я изучал</h2>

      {loading
        ? <div className="skills-loading"><div className="spinner" style={{ border: '3px solid var(--light-g)', borderTopColor: 'var(--blue)' }} /></div>
        : (
          <div className="skills-grid">
            {CATEGORIES.map(cat => {
              const meta   = CAT_META[cat]
              const items  = skills.filter(s => s.category === cat)
              return (
                <div key={cat} className={`skill-card skill-card--${meta.color}`}>
                  <div className="skill-cat-header">
                    <span className="skill-icon">{meta.icon}</span>
                    <span className="skill-cat-name">{cat}</span>
                  </div>
                  <div className="skill-tags">
                    {items.map(s => (
                      <span key={s._id} className="skill-pill">{s.name}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </section>
  )
}
