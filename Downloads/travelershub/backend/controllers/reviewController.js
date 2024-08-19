const AdventureCanvas = require('../models/adventureCanvasModel')
const Review = require('../models/reveiwModel')

// add review to a trip
const addReview = async (req, res) => {
    const { travelerName, travelerPhoto, rating, content, adventureCanvas_id } = req.body
    
    try {
        const tourOperator = await AdventureCanvas.findOne({ _id: adventureCanvas_id }).select('assignTourOperator.email')

        if(!tourOperator) {
            return res.status(404).json({ error: 'Tour Operator was not found' })
        }
        const tourOperator_email = tourOperator.assignTourOperator.email
        const review = await Review.create({ travelerName, travelerPhoto, rating, content, tourOperator_email, adventureCanvas_id })

        if(!review) {
            return res.status(404).json({ error: 'Something went worng...' })
        }

        res.status(200).json({ msg: 'The review was sent successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// get review by adventure canvases id
const getReviewByAdventureCanvasesId = async (req, res) => {
    const { id } = req.params

    try {
        const review = await Review.find({ adventureCanvas_id: id }).sort({updatedAt: -1})

        if (!review.length) {
            return res.status(404).json({ error: 'No review yet.' })
        }
        res.status(200).json(review)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
} 

// get review by tour operator email
const getReviewByTourOperatorEmail = async (req, res) => {
    const { email } = req.params

    try {
        const review = await Review.find({ tourOperator_email: email }).sort({updatedAt: -1})

        if (!review.length) {
            return res.status(404).json({ error: 'No review yet.' })
        }
        res.status(200).json(review)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    addReview,
    getReviewByAdventureCanvasesId,
    getReviewByTourOperatorEmail
}