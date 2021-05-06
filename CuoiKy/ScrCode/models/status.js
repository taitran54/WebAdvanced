const { Schema, model } = require('mongoose')
const uuid = require('uuid')
const User = require('./user')

const referrenceValidator = require('mongoose-referrence-validator');

const StatusSchema = Schema({
    _id: { type: String, default: uuid.v4 },
    content: { type: String },
    time: { type: Date },
    user_post: { type: String, ref: User.collection.collectionName },
    image: { type : [ String ] }
    
})

StatusSchema.plugin(referrenceValidator)

module.exports = model('status', StatusSchema)