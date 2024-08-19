const express = require('express')

// controller functions
const { 
    getBookingByUserId,
    saveBookingDetails,
    deleteBooking
} = require('../controllers/bookingController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all profile routes
router.use(requireAuth)

// GET booking details by traveler id route
router.get('/getBookingForUser', getBookingByUserId)

// POST booking details for traveler route
router.post('/saveBooking', saveBookingDetails)

// DELETE booking details for traveler route
router.delete('/deleteBooking', deleteBooking)

module.exports = router