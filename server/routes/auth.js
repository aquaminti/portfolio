const router = require('express').Router()
const jwt    = require('jsonwebtoken')

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Введите логин и пароль' })
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ message: 'Вход выполнен', token })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ message: 'Ошибка сервера при входе' })
  }
})

module.exports = router
