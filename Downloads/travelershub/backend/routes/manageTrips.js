const express = require('express')

// controller functions
const { 
    getUnpublishedAdventureCanvas,
    publishTrip,
    getExecutionUnconfirmedTripPlan,
    updateConfirmedDate,
    getAllTourOperators,
    deleteTrip,
} = require('../controllers/manageTripsController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all travel guide routes
router.use(requireAuth)

// GET all unpublished Adventure Canvases route
router.get('/getUnpublished', getUnpublishedAdventureCanvas)

// UPDATE publish trip status route
router.patch('/publishTrip', publishTrip)

// GET all unconfirmed Adventure Canvases route
router.get('/getUnconfirmed', getExecutionUnconfirmedTripPlan)

// UPDATE executionConfirmed date status route
router.patch('/updateConfirmedDate', updateConfirmedDate)

// GET all the tour operators users route
router.get('/getAllTourOperators', getAllTourOperators)

// DELETE trip route
router.delete('/deleteTrip', deleteTrip)

module.exports = router