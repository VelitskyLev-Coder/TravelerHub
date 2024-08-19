const mongoose = require('mongoose')

const Schema = mongoose.Schema

const assignTourOperatorSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: '/images/user-blank-profile.png',
    },
}, { timestamps: true })

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
        type: assignTourOperatorSchema,
        default: null
    },
}, { timestamps: true })

module.exports = mongoose.model('AdventureCanvas', adventureCanvasSchema)