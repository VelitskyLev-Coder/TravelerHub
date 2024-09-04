const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        required: true,
    },
    dislikes: {
        type: [String],
        required: true,
    },
}, { timestamps: true })

const forumSchema = new Schema({
    comments: [commentSchema],
    adventureCanvas_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdventureCanvas',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Forum', forumSchema)