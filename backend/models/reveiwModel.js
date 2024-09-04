const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    // travelerName: {
    //     type: String,
    //     required: true,
    // },
    // travelerPhoto: {
    //     type: String,
    //     required: true,
    // },
    travelerEmail: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    content: {
        type: String,
        required: true,
    },
    tourOperator_email: {
        type: String,
        required: true,
    },
    adventureCanvas_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdventureCanvas',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)