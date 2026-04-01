const router = require('express').Router()
const Skill  = require('../models/Skill')
const auth   = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().select('name category level').sort('category name')
    res.json(skills)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении навыков' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, category, level } = req.body
    if (!name || !category) return res.status(400).json({ message: 'Название и категория обязательны' })
    const skill = await Skill.create({ name, category, level })
    res.status(201).json(skill)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании навыка' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!skill) return res.status(404).json({ message: 'Навык не найден' })
    res.json(skill)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении навыка' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill) return res.status(404).json({ message: 'Навык не найден' })
    res.json({ message: 'Навык удалён' })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении навыка' })
  }
})

module.exports = router
