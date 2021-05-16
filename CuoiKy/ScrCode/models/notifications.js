const { Schema, model } = require('mongoose')
const uuid = require('uuid')
const User = require('./user')

const referrenceValidator = require('mongoose-referrence-validator')

const NotificationsSchema = Schema ({
    _id: { type: String, default: uuid.v4 },
    title: { type: String },
    content: { type: String },
    time: { type: Date },
    user_comment: { type: String, ref: User.collection.collectionName },
})

NotificationsSchema.plugin(referrenceValidator)

module.exports = model('notifications', NotificationsSchema)