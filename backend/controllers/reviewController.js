const AdventureCanvas = require('../models/adventureCanvasModel')
const Review = require('../models/reveiwModel')
const User = require('../models/userModel')

// add review to a trip
const addReview = async (req, res) => {
    const { travelerEmail, rating, content, adventureCanvas_id } = req.body
    
    try {
        const tourOperator = await AdventureCanvas.findOne({ _id: adventureCanvas_id }).select('assignTourOperator')

        if(!tourOperator) {
            return res.status(404).json({ error: 'Tour Operator was not found' })
        }
        const tourOperator_email = tourOperator.assignTourOperator
        const review = await Review.create({ travelerEmail, rating, content, tourOperator_email, adventureCanvas_id })

        if(!review) {
            return res.status(404).json({ error: 'Something went worng...' })
        }

        res.status(200).json({ msg: 'The review was sent successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// add user details to the review
const addUserDetailsToReview = async (reviews) => {
    return await Promise.all(reviews.map(async review => {
        const user = await User.findOne({ email: review.travelerEmail })

        if (!user) {
            // If the user is not found, fallback to default values
            return {
                ...review.toObject(), // Convert Mongoose document to plain object
                travelerName: 'Unknown',
                travelerPhoto: '/images/user-blank-profile.png'
            }
        }

        return {
            ...review.toObject(), // Convert Mongoose document to plain object
            travelerName: user.username,
            travelerPhoto: user.photo
        }
    }))
}

// get review by adventure canvases id
const getReviewByAdventureCanvasesId = async (req, res) => {
    const { id } = req.params

    try {
        const reviews = await Review.find({ adventureCanvas_id: id }).sort({updatedAt: -1})

        if (!reviews.length) {
            return res.status(404).json({ error: 'No review yet.' })
        }

        const reviewsWithUserDetails = await addUserDetailsToReview(reviews)

        res.status(200).json(reviewsWithUserDetails)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
} 

// get review by tour operator email
const getReviewByTourOperatorEmail = async (req, res) => {
    const { email } = req.params

    try {
        const reviews = await Review.find({ tourOperator_email: email }).sort({updatedAt: -1})

        if (!reviews.length) {
            return res.status(404).json({ error: 'No review yet.' })
        }

        const reviewsWithUserDetails = await addUserDetailsToReview(reviews)

        res.status(200).json(reviewsWithUserDetails)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    addReview,
    getReviewByAdventureCanvasesId,
    getReviewByTourOperatorEmail
}