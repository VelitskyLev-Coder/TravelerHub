const express = require('express')

// controller functions
const { 
    getConcepts,
    postConcept,
    deleteConcept,
    updateLikeToConcept
} = require('../controllers/conceptController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all profile routes
router.use(requireAuth)

// GET all concepts route
router.get('/getConcepts', getConcepts)

// POST new concept route
router.post('/postConcept', postConcept)

// DELETE concept route
router.delete('/deleteConcept', deleteConcept)

// POST new concept route
router.patch('/updateLike', updateLikeToConcept)

module.exports = router