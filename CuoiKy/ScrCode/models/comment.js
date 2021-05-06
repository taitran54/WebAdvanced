const { Schema, model } = require('mongoose')
const uuid = require('uuid')
const User = require('./user')
const Status = require('./status')

const referrenceValidator = require('mongoose-referrence-validator')

const CommentSchema = Schema ({
    _id: { type: String, default: uuid.v4 },
    content: { type: String },
    time: { type: Date },
    user_comment: { type: String, ref: User.collection.collectionName },
    status_parent: { type: String, ref: Status.collection.collectionName }
})

CommentSchema.plugin(referrenceValidator)

module.exports = model('comment', CommentSchema)