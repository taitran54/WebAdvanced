const { Schema, model } = require('mongoose')
const uuid = require('uuid')

const userSchema = Schema({
  _id: { type: String, default: uuid.v4 },
  authId: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String },
  created: { type: Date },
  avatar: { type: String },
})

module.exports = model('users', userSchema)