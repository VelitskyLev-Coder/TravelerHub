const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adventureCanvasSchema = new Schema({
    images: {
        type: [String],
        required: true,
    },
    tripName: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    assignTourOperator: {
        type: String,
        default: null
    },
}, { timestamps: true })

module.exports = mongoose.model('AdventureCanvas', adventureCanvasSchema)