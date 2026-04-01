import './About.css'

const info = [
  { key: 'Имя',         val: 'Сериков Шахан' },
  { key: 'Город',       val: 'Астана, Казахстан' },
  { key: 'Образование', val: 'AITUC, ПО2403' },
  { key: 'Статус',      val: 'Открыт к работе', highlight: true },
  { key: 'Email',       val: 'aldanshakhan@gmail.com', link: 'mailto:aldanshakhan@gmail.com' },
  { key: 'GitHub',      val: 'github.com/aquaminti',   link: 'https://github.com/aquaminti' },
]

const values = [
  { icon: '✦', title: 'Старания',         desc: 'Стараюсь' },
  { icon: '✦', title: 'Открытость',       desc: 'Не боюсь задавать вопросы и просить помощи' },
]

export default function About() {
  return (
    <section className="about section-wrap">
      <p className="section-label tag-accent">ОБО МНЕ</p>
      <h2 className="section-title">Кто я такой и чем занимаюсь</h2>

      <div className="about-grid">
        <div className="about-left">
          <p className="about-bio">
            Привет! Меня зовут Шахан, я студент AITUC, группа ПО2403. Изучаю основы
            программирования.
          </p>

          <div className="info-table">
            {info.map(({ key, val, highlight, link }) => (
              <div key={key} className="info-row">
                <span className="info-key tag-accent">{key}</span>
                {link
                  ? <a href={link} target="_blank" rel="noreferrer" className={`info-val ${highlight ? 'info-green' : ''}`}>{val}</a>
                  : <span className={`info-val ${highlight ? 'info-green' : ''}`}>{val}</span>
                }
              </div>
            ))}
          </div>
        </div>

        <div className="values-card">
          <h3 className="values-title">Мои ценности</h3>
          <div className="values-list">
            {values.map(v => (
              <div key={v.title} className="value-item">
                <span className="value-icon">{v.icon}</span>
                <div>
                  <p className="value-title">{v.title}</p>
                  <p className="value-desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
