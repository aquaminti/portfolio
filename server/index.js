require('dotenv').config()
const express   = require('express')
const mongoose  = require('mongoose')
const cors      = require('cors')
const dns       = require('dns')

dns.setServers(['8.8.8.8', '1.1.1.1'])

const authRoutes     = require('./routes/auth')
const skillsRoutes   = require('./routes/skills')
const projectsRoutes = require('./routes/projects')
const messagesRoutes = require('./routes/messages')

const app  = express()
const PORT = process.env.PORT || 5000

const corsOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(express.json())

app.use('/api/auth',     authRoutes)
app.use('/api/skills',   skillsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/messages', messagesRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' })
})

app.use((err, req, res, next) => {
  console.error('[server error]', err)
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB подключена')
    app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message)
    process.exit(1)
  })
