const Booking = require('../models/bookingModel')
const TripPlan = require('../models/tripPlanModel')

// get booking details by user id
const getBookingByUserId = async (req, res) => {
    const user_id = req.user._id

    const userBooking = await Booking.find({ user_id }).select('-payment')
    res.status(200).json(userBooking)
}

// save booking details for traveler (after payment)
const saveBookingDetails = async (req, res) => {
    const { booking, payment, adventureCanvas_id, date_id } = req.body
    const user_id = req.user._id

    try {
        const tripPlan = await TripPlan.findOne({ adventureCanvas_id })
        if (!tripPlan) {
            return res.status(404).json({ error: 'TripPlan not found' })
        }

        // Find the specific date object
        const date = tripPlan.dates.id(date_id)
        if (!date) {
            return res.status(404).json({ error: 'Date not found' })
        }

        // Update the currBooking field
        date.currBooking += booking.member

        // Save the updated TripPlan
        await tripPlan.save()

        const newBooking = await Booking.create({ ...booking, payment, adventureCanvas_id, user_id })

        if (!newBooking) {
            return res.status(404).json({ error: 'Something went wrong...' })
        }

        res.status(200).json({ msg: 'The booking was made successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete booking
const deleteBooking = async (req, res) => {
    const { currBooking } = req.body

    try {
        const tripPlan = await TripPlan.findOne({ adventureCanvas_id: currBooking.adventureCanvas_id })
        if (!tripPlan) {
            return res.status(404).json({ error: 'TripPlan not found' })
        }

        // Find the specific date object
        const date = tripPlan.dates.id(currBooking.date_id)
        if (!date) {
            return res.status(404).json({ error: 'Date not found' })
        }
        
        // Update the currBooking field
        date.currBooking -= currBooking.member

        // Save the updated TripPlan
        await tripPlan.save()

        const booking = await Booking.findByIdAndDelete(currBooking._id)

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        res.status(200).json({ msg: 'Booking deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getBookingByUserId,
    saveBookingDetails,
    deleteBooking,
}