import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <main className="hero">
      <div className="hero-blob" />

      <div className="hero-content">
        <div className="hero-left">
          <p className="hero-label tag-accent">Начинающий разработчик</p>
          <h1 className="hero-h1">
            <span className="h1-name">Шахан</span>
            <span className="h1-line2">Начинающий</span>
            <span className="h1-line3">Разработчик</span>
          </h1>

          <p className="hero-sub">
            Учусь в AITUC, группа ПО2403. Изучаю HTML, CSS,
            JavaScript, React.
          </p>

          <div className="hero-btns">
            <Link to="/projects" className="btn-primary">Посмотреть проекты →</Link>
            <Link to="/contact"  className="btn-secondary">Связаться со мной</Link>
          </div>
        </div>

        <div className="avatar-card">
          <div className="avatar-circle">
            <span className="mono">Ш.С.</span>
          </div>
          <p className="av-name">Сериков Шахан</p>
          <p className="av-role">Web Developer</p>
          <div className="av-tags">
            <span className="pill">ПО2403</span>
            <span className="pill">AITUC</span>
            <span className="pill">Developer</span>
          </div>
        </div>
      </div>
    </main>
  )
}
