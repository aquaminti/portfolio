import { useState, useEffect } from 'react'
import { getProjects } from '../services/api'
import './Projects.css'

const FALLBACK = [
  { _id: '1', number: '01', title: 'Cinema Website (Dwayne)',
    description: 'Сайт для вымышленного кинотеатра — учебный проект по HTML/CSS/JS.',
    stack: ['React','JavaScript','Node.js'], status: 'Завершён', link: 'https://github.com/aquaminti' },
  { _id: '2', number: '02', title: 'Wardrobe',
    description: 'HTML страница для создания вещей из гардероба.',
    stack: ['HTML','JavaScript'], status: 'Завершён', link: 'https://github.com/aquaminti' },
  { _id: '3', number: '03', title: 'Goal Tracker',
    description: 'Сайт для отслеживания и достижения целей.',
    stack: ['React','Express','MongoDB'], status: 'Завершён', link: 'https://github.com/aquaminti' },
  { _id: '4', number: '04', title: 'Fast-Food ESM',
    description: 'Вымышленный фаст-фуд сайт.',
    stack: ['HTML','JavaScript'], status: 'Завершён', link: 'https://github.com/aquaminti' },
]

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getProjects()
      .then(r => setProjects(r.data))
      .catch(() => setProjects(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="projects section-wrap">
      <p className="section-label tag-accent">ПРОЕКТЫ</p>
      <h2 className="section-title">Учебные проекты</h2>

      {loading
        ? <div className="proj-loading"><div className="proj-spinner" /></div>
        : (
          <div className="projects-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} />
            ))}
          </div>
        )
      }
    </section>
  )
}

function ProjectCard({ project: p, index }) {
  const num = p.number || String(index + 1).padStart(2, '0')
  const isDone = p.status === 'Завершён'

  return (
    <div className="proj-card">
      <span className="proj-bg-num mono">{num}</span>

      <div className={`proj-badge ${isDone ? 'badge-done' : 'badge-wip'}`}>
        {p.status || 'В разработке'}
      </div>

      <h3 className="proj-title">{p.title}</h3>
      <p className="proj-desc">{p.description}</p>

      <div className="proj-stack">
        {(p.stack || []).map(s => (
          <span key={s} className="proj-tag">{s}</span>
        ))}
      </div>

      {p.link && (
        <a href={p.link} target="_blank" rel="noreferrer" className="proj-link">
          Смотреть проект →
        </a>
      )}
    </div>
  )
}
