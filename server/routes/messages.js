const router  = require('express').Router()
const Message = require('../models/Message')
const auth    = require('../middleware/auth')

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Имя, email и сообщение обязательны' })
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Неверный формат email' })
    }
    const msg = await Message.create({ name, email, subject, message })
    res.status(201).json({ message: 'Сообщение отправлено', id: msg._id })
  } catch {
    res.status(500).json({ message: 'Ошибка при отправке сообщения' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch {
    res.status(500).json({ message: 'Ошибка при получении сообщений' })
  }
})

router.patch('/:id/read', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    if (!msg) return res.status(404).json({ message: 'Сообщение не найдено' })
    res.json(msg)
  } catch {
    res.status(500).json({ message: 'Ошибка при обновлении статуса' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id)
    if (!msg) return res.status(404).json({ message: 'Сообщение не найдено' })
    res.json({ message: 'Сообщение удалено' })
  } catch {
    res.status(500).json({ message: 'Ошибка при удалении сообщения' })
  }
})

module.exports = router
