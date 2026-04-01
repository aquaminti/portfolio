const router  = require('express').Router()
const Project = require('../models/Project')
const auth    = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort('number')
    res.json(projects)
  } catch {
    res.status(500).json({ message: 'Ошибка при получении проектов' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ message: 'Название обязательно' })
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch {
    res.status(500).json({ message: 'Ошибка при создании проекта' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ message: 'Проект не найден' })
    res.json(project)
  } catch {
    res.status(500).json({ message: 'Ошибка при обновлении проекта' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Проект не найден' })
    res.json({ message: 'Проект удалён' })
  } catch {
    res.status(500).json({ message: 'Ошибка при удалении проекта' })
  }
})

module.exports = router
