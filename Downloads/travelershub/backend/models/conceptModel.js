const mongoose = require('mongoose')

const Schema = mongoose.Schema

const conceptSchema = new Schema({
    tripName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    likes: {
        type: [String],
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Concept', conceptSchema)