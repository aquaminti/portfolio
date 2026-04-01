import { useState, useEffect } from 'react'
import { getSkills, createSkill, updateSkill, deleteSkill,
         getProjects, createProject, updateProject, deleteProject,
         getMessages, deleteMessage, markRead } from '../services/api'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/Toast'
import './Admin.css'

export default function Admin({ onLogout }) {
  const [tab, setTab] = useState('skills')

  return (
    <div className="admin-wrap">
      <Sidebar tab={tab} setTab={setTab} onLogout={onLogout} />
      <main className="admin-main">
        {tab === 'skills'   && <SkillsPanel />}
        {tab === 'projects' && <ProjectsPanel />}
        {tab === 'messages' && <MessagesPanel />}
      </main>
    </div>
  )
}

function Sidebar({ tab, setTab, onLogout }) {
  const items = [
    { id: 'skills',   icon: '◈', label: 'Навыки' },
    { id: 'projects', icon: '◎', label: 'Проекты' },
    { id: 'messages', icon: '✉', label: 'Сообщения' },
  ]
  return (
    <aside className="sidebar">
      <div>
        <p className="sb-logo mono">shahan.dev</p>
        <hr className="sb-divider" />
        <p className="sb-section-label">УПРАВЛЕНИЕ</p>
        <nav className="sb-nav">
          {items.map(i => (
            <button key={i.id} className={`sb-item ${tab===i.id?'active':''}`}
              onClick={() => setTab(i.id)}>
              <span>{i.icon}</span>{i.label}
            </button>
          ))}
        </nav>
        <hr className="sb-divider" />
        <button className="sb-back" onClick={onLogout}>← Открыть сайт</button>
      </div>
    </aside>
  )
}

const EMPTY_SKILL = { name: '', category: 'Frontend', level: 'Базовый' }

function SkillsPanel() {
  const [skills,  setSkills]  = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)
  const [form,    setForm]    = useState(EMPTY_SKILL)
  const [saving,  setSaving]  = useState(false)
  const [filter,  setFilter]  = useState('Все')
  const { toasts, success, error } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await getSkills(); setSkills(r.data) }
    catch { } finally { setLoading(false) }
  }

  function openAdd()  { setForm(EMPTY_SKILL); setModal('add') }
  function openEdit(s){ setForm({ name: s.name, category: s.category, level: s.level }); setModal(s) }
  function closeModal(){ setModal(null) }

  async function handleSave() {
    if (!form.name.trim()) { error('Введите название навыка'); return }
    setSaving(true)
    try {
      if (modal === 'add') { await createSkill(form); success('Навык добавлен') }
      else                 { await updateSkill(modal._id, form); success('Навык обновлён') }
      await load(); closeModal()
    } catch(e) { error(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить навык?')) return
    try { await deleteSkill(id); await load(); success('Навык удалён') }
    catch(e) { error(e.message) }
  }

  const cats = ['Все', 'Frontend', 'Инструменты', 'Другое', 'Soft Skills']
  const visible = filter === 'Все' ? skills : skills.filter(s => s.category === filter)

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="panel-topbar">
        <div>
          <h1 className="panel-title">Управление навыками</h1>
          <p className="panel-sub">Добавляйте, редактируйте и удаляйте навыки</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Добавить навык</button>
      </div>

      <div className="filter-row">
        {cats.map(c => (
          <button key={c} className={`filter-pill ${filter===c?'active':''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {loading
        ? <LoadingRow />
        : (
          <div className="table-wrap">
            <div className="table-head">
              <span style={{width:260}}>Навык</span>
              <span style={{width:160}}>Категория</span>
              <span style={{width:160}}>Уровень</span>
              <span style={{width:180}}>Действия</span>
            </div>
            {visible.map(s => (
              <div key={s._id} className="table-row">
                <span className="row-name" style={{width:260}}>{s.name}</span>
                <span style={{width:160}}><Badge color="blue">{s.category}</Badge></span>
                <span style={{width:160}}><LevelBadge level={s.level} /></span>
                <span style={{width:180,display:'flex',gap:8}}>
                  <button className="btn-edit" onClick={() => openEdit(s)}>Изменить</button>
                  <button className="btn-del"  onClick={() => handleDelete(s._id)}>Удалить</button>
                </span>
              </div>
            ))}
          </div>
        )
      }

      {modal && (
        <Modal title={modal === 'add' ? 'Добавить навык' : 'Редактировать навык'} onClose={closeModal}>
          <Field label="Название навыка">
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="HTML5" />
          </Field>
          <Field label="Категория">
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              {['Frontend','Инструменты','Другое','Soft Skills'].map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Уровень знаний">
            <select value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
              {['Базовый','Начинающий','Чуть-чуть',''].map(l=><option key={l}>{l}</option>)}
            </select>
          </Field>
          <button className="btn-primary btn-full" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner"/>Сохраняем...</> : 'Сохранить изменения'}
          </button>
        </Modal>
      )}
    </>
  )
}

const EMPTY_PROJ = { number:'', title:'', description:'', stack:'', status:'В разработке', link:'' }

function ProjectsPanel() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(EMPTY_PROJ)
  const [saving,   setSaving]   = useState(false)
  const { toasts, success, error } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await getProjects(); setProjects(r.data) }
    catch {} finally { setLoading(false) }
  }

  function openAdd()   { setForm(EMPTY_PROJ); setModal('add') }
  function openEdit(p) {
    setForm({ number: p.number||'', title: p.title, description: p.description,
      stack: Array.isArray(p.stack) ? p.stack.join(', ') : p.stack,
      status: p.status, link: p.link||'' })
    setModal(p)
  }

  async function handleSave() {
    if (!form.title.trim()) { error('Введите название'); return }
    setSaving(true)
    try {
      const payload = { ...form, stack: form.stack.split(',').map(s=>s.trim()).filter(Boolean) }
      if (modal === 'add') { await createProject(payload); success('Проект добавлен') }
      else                 { await updateProject(modal._id, payload); success('Проект обновлён') }
      await load(); setModal(null)
    } catch(e) { error(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить проект?')) return
    try { await deleteProject(id); await load(); success('Проект удалён') }
    catch(e) { error(e.message) }
  }

  const done = projects.filter(p => p.status === 'Завершён').length

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="panel-topbar">
        <div>
          <h1 className="panel-title">Управление проектами</h1>
          <p className="panel-sub">Добавляйте и редактируйте учебные проекты</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Добавить проект</button>
      </div>

      <div className="stats-row">
        <StatCard num={projects.length} label="Всего проектов" />
        <StatCard num={projects.length - done} label="В разработке" />
        <StatCard num={done} label="Завершено" />
      </div>

      {loading
        ? <LoadingRow />
        : (
          <div className="proj-cards-grid">
            {projects.map((p, i) => (
              <div key={p._id} className="admin-proj-card">
                <span className="apj-bg-num mono">{p.number || String(i+1).padStart(2,'0')}</span>
                <Badge color={p.status==='Завершён'?'green':'amber'}>{p.status||'В разработке'}</Badge>
                <h3 className="apj-title">{p.title}</h3>
                <p className="apj-desc">{p.description}</p>
                <div className="apj-stack">
                  {(Array.isArray(p.stack)?p.stack:p.stack?.split(',')?.map(s=>s.trim())||[]).map(s=>(
                    <span key={s} className="filter-pill">{s}</span>
                  ))}
                </div>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="btn-edit" onClick={() => openEdit(p)}>Изменить</button>
                  <button className="btn-del"  onClick={() => handleDelete(p._id)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal && (
        <Modal title={modal==='add'?'Добавить проект':'Редактировать проект'} onClose={()=>setModal(null)}>
          <Field label="Номер (01, 02)">
            <input value={form.number} onChange={e=>setForm(f=>({...f,number:e.target.value}))} placeholder="01" />
          </Field>
          <Field label="Название проекта">
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="To-Do List App" />
          </Field>
          <Field label="Стек (через запятую)">
            <input value={form.stack} onChange={e=>setForm(f=>({...f,stack:e.target.value}))} placeholder="HTML, CSS, JavaScript" />
          </Field>
          <Field label="Статус">
            <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option>В разработке</option><option>Завершён</option>
            </select>
          </Field>
          <Field label="Ссылка">
            <input value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} placeholder="https://github.com/..." />
          </Field>
          <Field label="Описание">
            <textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Краткое описание проекта" />
          </Field>
          <button className="btn-primary btn-full" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner"/>Сохраняем...</> : 'Сохранить изменения'}
          </button>
        </Modal>
      )}
    </>
  )
}

function MessagesPanel() {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const { toasts, success, error } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await getMessages(); setMessages(r.data) }
    catch {} finally { setLoading(false) }
  }

  async function handleRead(msg) {
    setSelected(msg)
    if (!msg.isRead) {
      try {
        await markRead(msg._id)
        setMessages(ms => ms.map(m => m._id===msg._id ? {...m,isRead:true} : m))
      } catch {}
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить сообщение?')) return
    try { await deleteMessage(id); await load(); setSelected(null); success('Удалено') }
    catch(e) { error(e.message) }
  }

  const unread = messages.filter(m => !m.isRead).length

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="panel-topbar">
        <div>
          <h1 className="panel-title">Входящие сообщения</h1>
          <p className="panel-sub">Сообщения</p>
        </div>
      </div>

      <div className="stats-row">
        <StatCard num={messages.length} label="Всего" />
        <StatCard num={unread} label="Новых" />
        <StatCard num={messages.length - unread} label="Прочитано" />
      </div>

      {loading
        ? <LoadingRow />
        : (
          <div className="msg-layout">
            <div className="msg-list">
              <div className="msg-thead">
                <span>Отправитель</span><span>Тема</span><span>Дата</span><span>Статус</span>
              </div>
              {messages.length === 0 && <p className="msg-empty">Сообщений пока нет</p>}
              {messages.map(m => (
                <div key={m._id} className={`msg-row ${!m.isRead?'unread':''} ${selected?._id===m._id?'selected':''}`}
                  onClick={() => handleRead(m)}>
                  <div className="msg-avatar">{m.name?.[0]?.toUpperCase()||'?'}</div>
                  <div className="msg-info">
                    <p className="msg-from">{m.name}</p>
                    <p className="msg-email">{m.email}</p>
                  </div>
                  <div className="msg-subject-col">
                    <p className="msg-subj">{m.subject || '(без темы)'}</p>
                    <p className="msg-preview">{m.message?.slice(0,60)}...</p>
                  </div>
                  <span className="msg-date">{new Date(m.createdAt).toLocaleDateString('ru')}</span>
                  <Badge color={m.isRead?'gray':'blue'}>{m.isRead?'Прочитано':'Новое'}</Badge>
                  <button className="btn-del-sm" onClick={e=>{e.stopPropagation();handleDelete(m._id)}}>✕</button>
                </div>
              ))}
            </div>

            {selected && (
              <div className="msg-preview-panel">
                <div className="preview-header">
                  <div className="preview-avatar">{selected.name?.[0]?.toUpperCase()||'?'}</div>
                  <div>
                    <p className="preview-name">{selected.name}</p>
                    <p className="preview-email">{selected.email}</p>
                  </div>
                  <span className="preview-date">{new Date(selected.createdAt).toLocaleString('ru')}</span>
                </div>
                <hr style={{border:'none',borderTop:'1px solid var(--light-g)',margin:'16px 0'}} />
                <p className="preview-subj">{selected.subject || '(без темы)'}</p>
                <p className="preview-body">{selected.message}</p>
                <div style={{marginTop:'auto',paddingTop:24}}>
                  <button className="btn-del" onClick={() => handleDelete(selected._id)} style={{width:'100%',justifyContent:'center'}}>
                    Удалить сообщение
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      }
    </>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <hr style={{border:'none',borderTop:'1px solid var(--light-g)',margin:'0 0 20px'}} />
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="field" style={{marginBottom:16}}>
      <label className="tag-accent" style={{color:'var(--muted)',marginBottom:6,display:'block'}}>{label}</label>
      {children}
    </div>
  )
}

function Badge({ color, children }) {
  return <span className={`admin-badge badge-${color}`}>{children}</span>
}

function LevelBadge({ level }) {
  const map = { 'Базовый': 'amber', 'Начинающий': 'pink', 'Чуть-чуть': 'gray', '': 'gray' }
  return <Badge color={map[level]||'gray'}>{level||'—'}</Badge>
}

function StatCard({ num, label }) {
  return (
    <div className="stat-card">
      <p className="sc-num mono">{num}</p>
      <p className="sc-lbl">{label}</p>
    </div>
  )
}

function LoadingRow() {
  return <div style={{display:'flex',justifyContent:'center',padding:64}}><div className="proj-spinner" /></div>
}
