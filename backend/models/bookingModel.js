const mongoose = require('mongoose')

const Schema = mongoose.Schema

const paymentSchema = new Schema({
    method: {
        type: String,
        required: true,
    },
    cardHolder: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: String,
        required: true,
    },
    cvv: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const bookingSchema = new Schema({
    tripName: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true
    },
    member: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true
    },
    payment: paymentSchema,
    adventureCanvas_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdventureCanvas',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)