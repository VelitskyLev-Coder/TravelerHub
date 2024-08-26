const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dateSchema = new Schema({
    starting: {
        type: String,
        required: true,
    },
    ending: {
        type: String,
        required: true,
    },
    currBooking: {
        type: Number,
        default: 0,
    },
    limitBooking: {
        type: Number,
        required: true,
    },
    executionConfirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const scheduledItemSchema = new Schema({
    location: {
        type: String,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const tripPlanSchema = new Schema({
    dates: [dateSchema],
    scheduled: [scheduledItemSchema],
    travelGuide: {
        type: String,
    },
    adventureCanvas_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdventureCanvas',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('TripPlan', tripPlanSchema)