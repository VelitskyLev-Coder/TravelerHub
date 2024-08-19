const express = require('express')

// controller functions
const { 
    addReview,
    getReviewByAdventureCanvasesId,
    getReviewByTourOperatorEmail
} = require('../controllers/reviewController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all profile routes
router.use(requireAuth)

// POST review for a trip route
router.post('/addReview', addReview)

// GET reviews by adventure canvases id route
router.get('/getReviewByAdventureCanvasesId/:id', getReviewByAdventureCanvasesId)

// GET reviews by tour operator email route
router.get('/getReviewByTourOperatorEmail/:email', getReviewByTourOperatorEmail)

module.exports = router