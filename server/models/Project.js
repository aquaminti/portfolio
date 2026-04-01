const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  number:      { type: String, default: '' },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  stack:       [{ type: String }],
  status:      { type: String, default: 'В разработке', enum: ['В разработке','Завершён'] },
  link:        { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
