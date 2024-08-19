const express = require('express')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// controller functions
const { 
    getadventureCanvas,
    createNewTrip,
    getTripPlanByAdventureCanvasId,
    getAdventureCanvasById,
    getTourOperatorTrips,
} = require('../controllers/adventureCanvasController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all travel guide routes
router.use(requireAuth)

// GET all Adventure Canvases route
router.get('/getAll', getadventureCanvas)

// POST (create) new trip route
router.post('/newTrip', upload.array('images', 10), createNewTrip)

// GET trip plan by adventure canvas id route
router.get('/getTripPlanByAdventureCanvasId/:adventureCanvas_id', getTripPlanByAdventureCanvasId)

// GET adventure canvas by id route
router.get('/getAdventureCanvasById/:adventureCanvas_id', getAdventureCanvasById)

// GET all trips (adventure canvases) for tour operator route
router.get('/getTourOperatorTrips/:email', getTourOperatorTrips)

module.exports = router